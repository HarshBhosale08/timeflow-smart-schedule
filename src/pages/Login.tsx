
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Calendar } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow fade-in w-100" style={{ maxWidth: "450px" }}>
        <div className="card-header text-center bg-white border-0 pt-4">
          <div className="d-flex justify-content-center">
            <Calendar className="text-primary" size={48} />
          </div>
          <h4 className="card-title fw-bold mt-3">Welcome back</h4>
          <p className="card-text text-muted">
            Sign in to access your Smart Scheduler account
          </p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label htmlFor="password" className="form-label">Password</label>
                <Link to="/forgot-password" className="text-decoration-none small text-primary">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center mt-3">
              <span className="text-muted small">Don't have an account?</span>{" "}
              <Link to="/register" className="text-decoration-none text-primary">
                Register here
              </Link>
            </div>

            <div className="mt-4">
              <div className="position-relative">
                <hr />
                <div className="position-absolute top-50 start-50 translate-middle px-3 bg-white">
                  <span className="text-muted small">
                    Demo Accounts
                  </span>
                </div>
              </div>

              <div className="mt-3 small text-muted">
                <div className="bg-light p-3 rounded">
                  <div>Customer: customer@example.com</div>
                  <div>Provider: provider@example.com</div>
                  <div>Admin: admin@example.com</div>
                  <div className="mt-1 text-muted small">Password: "password" for all demo accounts</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
