import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, setError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from || "/index";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light font-display dark:bg-background-dark">
      {/* Left Side - Image */}
      <div
        className="hidden w-1/2 bg-cover bg-center lg:block"
        style={{
          backgroundImage:
            'linear-gradient(rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80")',
        }}
      >
        <div className="flex h-full flex-col items-center justify-center px-12 text-white">
          <span className="material-symbols-outlined mb-6 text-6xl">storefront</span>
          <h1 className="mb-4 text-4xl font-bold">Welcome Back!</h1>
          <p className="text-center text-lg text-white/90">
            Sign in to access your account, view orders, and enjoy personalized shopping experience.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="mb-8 flex items-center justify-center gap-3 text-primary lg:hidden dark:text-white">
            <span className="material-symbols-outlined text-3xl">storefront</span>
            <h1 className="text-2xl font-bold">Shopify</h1>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Sign In</h2>
            <p className="mt-2 text-subtle-light dark:text-subtle-dark">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-light dark:text-text-dark">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">
                  mail
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border-light bg-card-light py-3 pl-10 pr-4 text-text-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-light dark:text-text-dark">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border-light bg-card-light py-3 pl-10 pr-12 text-text-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle-light hover:text-text-light dark:text-subtle-dark dark:hover:text-text-dark"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-border-light text-accent focus:ring-accent"
                />
                <span className="text-sm text-subtle-light dark:text-subtle-dark">Remember me</span>
              </label>
              <Link
                to="/index/forgot-password"
                className="text-sm font-medium text-accent hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent font-bold text-white transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">login</span>
                  Sign In
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-light dark:border-border-dark"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background-light px-4 text-subtle-light dark:bg-background-dark dark:text-subtle-dark">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex h-12 items-center justify-center gap-2 rounded-lg border border-border-light bg-card-light font-medium text-text-light transition-all hover:bg-border-light dark:border-border-dark dark:bg-card-dark dark:text-text-dark dark:hover:bg-border-dark"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex h-12 items-center justify-center gap-2 rounded-lg border border-border-light bg-card-light font-medium text-text-light transition-all hover:bg-border-light dark:border-border-dark dark:bg-card-dark dark:text-text-dark dark:hover:bg-border-dark"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-subtle-light dark:text-subtle-dark">
            Don't have an account?{" "}
            <Link
              to="/index/register"
              state={{ from }}
              className="font-medium text-accent hover:underline"
            >
              Create an account
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link
              to="/index"
              className="inline-flex items-center gap-1 text-sm text-subtle-light hover:text-accent dark:text-subtle-dark"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
