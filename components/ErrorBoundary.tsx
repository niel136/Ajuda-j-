
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro Crítico capturado pelo Boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAF5] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-[2rem] flex items-center justify-center mb-6">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-2xl font-black text-black tracking-tighter mb-2">Ops! Algo deu errado.</h1>
          <p className="text-gray-500 font-bold text-sm mb-8 max-w-xs">
            O aplicativo encontrou um erro inesperado. Não se preocupe, seus dados estão seguros.
          </p>
          <Button 
            variant="black" 
            fullWidth 
            onClick={() => window.location.href = '/'}
            className="max-w-xs"
          >
            <RefreshCw size={18} className="mr-2" /> Recarregar App
          </Button>
          <pre className="mt-8 p-4 bg-gray-100 rounded-xl text-[10px] text-gray-400 font-mono overflow-auto max-w-full text-left">
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    // Fix: access children from this.props instead of this
    return this.props.children;
  }
}

export default ErrorBoundary;
