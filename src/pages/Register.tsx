
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Calendar } from "lucide-react";
import { UserRole } from "@/context/AuthContext";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(name, email, password, role);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light py-5">
      <div className="card shadow fade-in w-100" style={{ maxWidth: "450px" }}>
        <div className="card-header text-center bg-white border-0 pt-4">
          <div className="d-flex justify-content-center">
            <Calendar className="text-primary" size={48} />
          </div>
          <h4 className="card-title fw-bold mt-3">Create an account</h4>
          <p className="card-text text-muted">
            Register to start using Smart Scheduler
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
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                className="form-control"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Account Type</label>
              <div className="row g-2">
                <div className="col-4">
                  <div className="form-check border rounded p-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="accountType"
                      id="customer"
                      value="customer"
                      checked={role === "customer"}
                      onChange={() => setRole("customer")}
                    />
                    <label className="form-check-label" htmlFor="customer">
                      Customer
                    </label>
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-check border rounded p-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="accountType"
                      id="provider"
                      value="provider"
                      checked={role === "provider"}
                      onChange={() => setRole("provider")}
                    />
                    <label className="form-check-label" htmlFor="provider">
                      Provider
                    </label>
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-check border rounded p-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="accountType"
                      id="admin"
                      value="admin"
                      checked={role === "admin"}
                      onChange={() => setRole("admin")}
                    />
                    <label className="form-check-label" htmlFor="admin">
                      Admin
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="text-muted small">Already have an account?</span>{" "}
            <Link to="/login" className="text-decoration-none text-primary">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
