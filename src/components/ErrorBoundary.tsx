import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
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

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 border border-slate-100 p-10 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
              System Interrupted
            </h1>
            
            <p className="text-slate-500 font-medium mb-8">
              A runtime exception has occurred. Our engineers have been notified.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-8 p-4 bg-slate-900 rounded-2xl text-left overflow-auto max-h-40">
                <code className="text-xs text-emerald-400 font-mono">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
              <Button 
                onClick={this.handleReset}
                className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/90"
              >
                <Home className="h-4 w-4 mr-2" /> Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
