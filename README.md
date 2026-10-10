<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/67597e84-2cb3-4a9e-b324-f65b015138eb

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Render (Web Service)

1. **Create a new Web Service** connected to your repository on [Render](https://dashboard.render.com).
2. Configure service settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
3. In the **Environment** tab on Render:
   - Click **Add from .env** and paste the contents of `.env.render` (or upload the `.env.render` file).
   - Insert your `GEMINI_API_KEY` and update `APP_URL` with your Render domain.
4. **Firebase Auth setup (if using Google Login):**
   - Add your Render URL (e.g. `your-app.onrender.com`) and custom domain to **Authorized domains** in the Firebase Console under **Authentication > Settings**.

## Custom Domain & Firebase Setup Guide

If your app is deployed to Render, a custom domain (e.g. `paliconhospital.com`), or any external host, follow these steps so that your domain works seamlessly:

### 1. Authorize Domain in Firebase Console
1. Open [Firebase Console Authentication Settings](https://console.firebase.google.com/project/tidal-timer-491612-c8/authentication/settings).
2. Go to **Authentication** > **Settings** tab.
3. Scroll down to **Authorized domains**.
4. Click **Add domain**.
5. Add your domain(s):
   - Your Render URL: `palicon-hospital.onrender.com` (or your specific service name)
   - Your custom domain: `yourdomain.com` and `www.yourdomain.com`
6. Click **Save**.

### 2. Authorize Domain in Google Cloud OAuth (Credentials)
1. Open [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials?project=tidal-timer-491612-c8).
2. Under **OAuth 2.0 Client IDs**, click the Web client created for your app.
3. Under **Authorized JavaScript origins**, click **Add URI** and add:
   - `https://palicon-hospital.onrender.com`
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`
4. Under **Authorized redirect URIs**, verify that:
   - `https://tidal-timer-491612-c8.firebaseapp.com/__/auth/handler` is listed.
5. Click **Save**.

### 3. Immediate Email Sign-In (No Configuration Required)
- Patients and admins can also sign in directly using the **"Or Sign In with Email"** option in the login modal at any time without waiting for Google OAuth domain verification.
