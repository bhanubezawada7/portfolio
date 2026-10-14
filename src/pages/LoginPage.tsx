import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAuthorizedAdminEmail } from '../services/authService';
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, isAdmin, login, register, loginGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  // If already authenticated with admin permissions, auto-redirect to admin dashboard
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const getFriendlyError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return 'Invalid email or password. Please try again.';
    }
    if (code === 'auth/user-not-found') {
      return 'No account registered with this email address.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account with this email already exists. Please log in.';
    }
    if (code === 'auth/weak-password') {
      return 'Password should be at least 6 characters.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Google sign-in popup was cancelled.';
    }
    return err?.message || 'An error occurred during authentication.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password, displayName);
      } else {
        try {
          await login(email, password);
        } catch (loginErr: any) {
          const errCode = loginErr?.code || '';
          // If authorized admin email and user doesn't exist yet, auto-register for seamless first-time onboarding
          if (
            (errCode === 'auth/user-not-found' || errCode === 'auth/invalid-credential') &&
            isAuthorizedAdminEmail(email)
          ) {
            try {
              await register(email, password, displayName || 'Bhausri Bezawada');
            } catch {
              throw loginErr;
            }
          } else {
            throw loginErr;
          }
        }
      }
      navigate('/admin');
    } catch (err: any) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginGoogle();
      navigate('/admin');
    } catch (err: any) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address to receive password reset instructions.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Monogram brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 mx-auto flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
            BB
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {isRegister ? 'Create Administrator Account' : 'Portfolio Admin Sign In'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isRegister
              ? 'Register with authorized credentials to access management console.'
              : 'Sign in to manage portfolio content, media assets, and view inquiries.'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Reset Sent Banner */}
          {resetSent && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium">
                Password reset link sent to <strong>{email}</strong>. Please check your inbox.
              </p>
            </div>
          )}

          {/* Google Sign In Option */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-wider">
                Or with Email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Bhausri Bezawada"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bhanu1@gmail.com"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                loading={loading}
                className="w-full shadow-lg shadow-indigo-600/30"
              >
                {isRegister ? 'Complete Registration' : 'Sign In to Dashboard'}
              </Button>
            </div>
          </form>

          {/* Toggle Register / Login */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegister(false)}
                  className="text-indigo-400 hover:underline font-semibold"
                >
                  Sign in here
                </button>
              </span>
            ) : (
              <span>
                First-time administrator?{' '}
                <button
                  onClick={() => setIsRegister(true)}
                  className="text-indigo-400 hover:underline font-semibold"
                >
                  Register account
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
