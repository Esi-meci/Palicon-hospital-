import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Portal error caught by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white border border-emerald-100 rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              ✚
            </div>
            <h1 className="text-xl font-bold text-emerald-950 mb-2">Palicon Hospital</h1>
            <p className="text-sm text-slate-600 mb-6">
              A temporary render hiccup occurred. Click below to reload the patient and staff portal.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-md"
            >
              Reload Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
