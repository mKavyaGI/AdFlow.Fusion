import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "motion/react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center min-h-[400px] p-6"
        >
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="flex justify-center mb-4"
              >
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </motion.div>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left text-xs bg-muted p-3 rounded">
                  <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
                  <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                    {this.state.error.message}
                    {'\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <Button 
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    return this.props.children;
  }
}