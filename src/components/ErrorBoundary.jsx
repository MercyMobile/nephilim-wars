import React from 'react';

/**
 * React Error Boundary
 * Catches JavaScript errors in child components and displays a fallback UI
 * Prevents the entire app from crashing when an error occurs
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    // Reset error state and reload the page
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI when error occurs
      return (
        <div className="min-h-screen bg-[#0c0a09] text-[#d6d3d1] font-serif flex items-center justify-center p-4">
          <div className="max-w-2xl w-full border-2 border-red-800 bg-[#1c1917] rounded-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-cinzel font-bold text-red-500 mb-4">
                Something Went Wrong
              </h1>
              <p className="text-[#a8a29e] text-lg mb-2">
                The application encountered an unexpected error.
              </p>
              <p className="text-[#78716c] text-sm">
                This has been logged for debugging. Try refreshing the page.
              </p>
            </div>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-black border border-[#44403c] p-4 rounded mb-6 overflow-auto max-h-64">
                <div className="text-red-400 font-bold text-sm mb-2">Error Details:</div>
                <pre className="text-[#78716c] text-xs whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-8 py-3 bg-[#78350f] border border-[#f59e0b] text-[#fcd34d] font-bold rounded hover:bg-[#92400e] transition"
              >
                Reload Application
              </button>
              <a
                href="/"
                className="px-8 py-3 bg-[#44403c] border border-[#78716c] text-white font-bold rounded hover:bg-[#57534e] transition inline-block"
              >
                Return to Home
              </a>
            </div>

            <div className="mt-8 text-center">
              <p className="text-[#78716c] text-xs">
                If this problem persists, please report it on{' '}
                <a
                  href="https://github.com/anthropics/claude-code/issues"
                  className="text-[#fcd34d] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
