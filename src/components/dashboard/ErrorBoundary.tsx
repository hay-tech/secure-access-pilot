
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Chart rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <Card className="border-dashed border-2 h-full">
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
            <h3 className="text-lg font-medium">Chart could not be displayed</h3>
            <p className="text-muted-foreground text-sm text-center mt-2">
              There was an error rendering this visualization.
              Please check the console for more details or try refreshing.
            </p>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
