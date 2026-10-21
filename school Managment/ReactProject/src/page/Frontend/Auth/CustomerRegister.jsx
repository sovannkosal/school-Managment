import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const CustomerRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoading, error, setError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const from = location.state?.from || "/index";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms and Conditions");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    const result = await register(userData);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Weak", color: "bg-red-500" },
      { strength: 2, label: "Fair", color: "bg-orange-500" },
      { strength: 3, label: "Good", color: "bg-yellow-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
      { strength: 5, label: "Very Strong", color: "bg-green-600" },
    ];

    return levels[Math.min(strength, 5)];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="flex min-h-screen bg-background-light font-display dark:bg-background-dark">
      {/* Left Side - Image */}
      <div
        className="hidden w-1/2 bg-cover bg-center lg:block"
        style={{
          backgroundImage:
            'linear-gradient(rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)), url("https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80")',
        }}
      >
        <div className="flex h-full flex-col items-center justify-center px-12 text-white">
          <span className="material-symbols-outlined mb-6 text-6xl">storefront</span>
          <h1 className="mb-4 text-4xl font-bold">Join Shopify</h1>
          <p className="text-center text-lg text-white/90">
            Create an account to unlock exclusive deals, track orders, and enjoy a personalized shopping experience.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-8 text-center">
            <div>
              <span className="material-symbols-outlined mb-2 text-3xl">local_shipping</span>
              <p className="text-sm">Free Shipping</p>
            </div>
            <div>
              <span className="material-symbols-outlined mb-2 text-3xl">verified</span>
              <p className="text-sm">Secure Payment</p>
            </div>
            <div>
              <span className="material-symbols-outlined mb-2 text-3xl">support_agent</span>
              <p className="text-sm">24/7 Support</p>
            </div>
          </div>
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
            <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Create Account</h2>
            <p className="mt-2 text-subtle-light dark:text-subtle-dark">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-light dark:text-text-dark">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border-light bg-card-light py-3 px-4 text-text-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-light dark:text-text-dark">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border-light bg-card-light py-3 px-4 text-text-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-light dark:text-text-dark">
                Email Address *
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
                Phone Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">
                  phone
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border-light bg-card-light py-3 pl-10 pr-4 text-text-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-light dark:text-text-dark">
                Password *
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
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= passwordStrength.strength
                            ? passwordStrength.color
                            : "bg-border-light dark:bg-border-dark"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-subtle-light dark:text-subtle-dark">
                    Password strength: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-light dark:text-text-dark">
                Confirm Password *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border-light bg-card-light py-3 pl-10 pr-4 text-text-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
                  placeholder="••••••••"
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    check_circle
                  </span>
                )}
              </div>
            </div>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 rounded border-border-light text-accent focus:ring-accent"
              />
              <span className="text-sm text-subtle-light dark:text-subtle-dark">
                I agree to the{" "}
                <a href="#" className="text-accent hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-accent hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent font-bold text-white transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">person_add</span>
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-subtle-light dark:text-subtle-dark">
            Already have an account?{" "}
            <Link
              to="/index/login"
              state={{ from }}
              className="font-medium text-accent hover:underline"
            >
              Sign in
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

export default CustomerRegister;
