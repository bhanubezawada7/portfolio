import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Verifying administrator authorization...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white">
        <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-rose-500/30 text-center space-y-5">
          <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 w-16 h-16 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-100">Access Restricted</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            You are signed in as <span className="text-slate-200 font-semibold">{user.email}</span>, but your account does not possess administrator permissions for this portfolio.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="outline" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
                Return Home
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="primary" size="md" icon={<LogIn className="w-4 h-4" />}>
                Switch Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
