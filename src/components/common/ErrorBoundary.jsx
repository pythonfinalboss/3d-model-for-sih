import React from 'react';
import { AlertTriangle, RefreshCw, Layers } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#050811] text-slate-100 font-mono select-none">
          <div className="max-w-md w-full glass-panel border border-rose-500/40 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {this.props.title || '3D Rendering Warning'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {this.state.error?.message || 'A WebGL context or graphics pipeline error occurred.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload 3D Scene</span>
              </button>

              {this.props.onSwitchTo2D && (
                <button
                  onClick={this.props.onSwitchTo2D}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Return to 2D Plan</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
