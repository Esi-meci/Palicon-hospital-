# Security Specification

## 1. Data Invariants

1. **User Profile Sanity**: A user cannot self-assign the `admin` role upon registration. All new users default to the `patient` role.
2. **PII Protections**: User profiles (especially email addresses) should only be visible to the user themselves and to authorized administrators.
3. **Appointment Ownership**: Patients can only view, create, list, and cancel appointments belonging to their own `uid`. They cannot look up or search other patients' appointments.
4. **Report Privacy**: Medical reports are strictly confidential. Only the patient owner (`patientId == request.auth.uid`) or authorized system administrators (`isAdmin()`) can view or upload them.
5. **No Orphaned Appointments**: An appointment must reference a valid authenticated patient ID matching `request.auth.uid`.

## 2. The "Dirty Dozen" Vulnerability Payloads

These JSON payloads simulate attackers attempting to violate data integrity, spoof identities, or escalate privileges:

1. **Self-Escalation**: Patient attempts to create a user profile with `role: "admin"`.
2. **Profile Theft**: Patient attempts to read another user's profile containing PII (email).
3. **Orphaned Appointment**: Attacker attempts to book an appointment with a flat `patientId` string that does not match their own UID.
4. **Ghost Update**: Patient attempts to modify appointment notes or doctor specialties after the appointment Status is already in a terminal state like Completed.
5. **Admin Forgery**: Patient attempts to edit their profile to change their role from "patient" to "admin".
6. **Malicious Doctor**: Patient (authenticated but not admin) attempts to create a new Doctor document in the global lookup.
7. **Report Snooping**: Patient signs in and queries `/reports` without filtering by their own `uid`, trying to download another patient's medical history.
8. **Malicious Report Injection**: Attacker tries to upload a fake report to another patient's document under their own authentication.
9. **Junk ID Poisoning**: Attacker sends a 1MB string containing arbitrary characters as an appointment ID to attempt denial of wallet attacks or ID hijacking.
10. **Timestamp Spoofing**: Patient provides a static client-side creation date for an appointment instead of using the mandatory server timestamp (`request.time`).
11. **Doctor Defacement**: Patient attempts to update the rating or consultation fee of any Doctor.
12. **Shadow Field Injection**: Patient creates an appointment with unapproved fields (e.g., `isVIP: true`, `insuranceOverride: true`) that do not exist in the schema.

## 3. The Test Design

These boundaries will be enforced by writing strict Attribute-Based Access Control logic in `firestore.rules`. Any write, update, or read that commits these violations will return a `PERMISSION_DENIED` status.
