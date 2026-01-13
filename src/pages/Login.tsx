import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { loginUser } from "../services/auth.api";
import { fetchAllUsers } from "../services/user.api";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/routes";
import { LoginSchema } from "../schemas/login";
import { syncCartAfterLogin } from "../utils/cartUtils";
import { ROLES } from "../constants/roles";
import { ADMIN_CREDENTIALS } from "../constants/admin";

import "./Login.scss";

import type { User } from "../types/user";

const Login = () => {
  const [error, setError] = useState<string>("");
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect location from state, default to HOME
  const from = location.state?.from || ROUTES.HOME;

  // Redirect if already logged in
  useEffect(() => {
    if (!isAuthenticated) return;

    if (role === ROLES.ADMIN) {
      navigate(ROUTES.ADMIN, { replace: true });
    } else {
      // Use the 'from' location for regular users
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, role, navigate, from]);

  const handleSubmit = async (
    values: User,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setError("");

      // ================= ADMIN LOGIN =================
      if (
        values.username === ADMIN_CREDENTIALS.username &&
        values.password === ADMIN_CREDENTIALS.password
      ) {
        login("admin-token", ADMIN_CREDENTIALS.id, ROLES.ADMIN);
        navigate(ROUTES.ADMIN);
        return;
      }

      // ================= USER LOGIN =================
      // 1️⃣ Authenticate (returns token only)
      const authResponse = await loginUser(values.username, values.password);

      // 2️⃣ Fetch all users (FakeStore limitation)
      const users: User[] = await fetchAllUsers();

      // 3️⃣ Find logged-in user
      const matchedUser = users.find(
        (user) => user.username === values.username
      );

      if (!matchedUser || matchedUser.id === undefined) {
        throw new Error("User not found");
      }

      login(authResponse.token, matchedUser.id, ROLES.USER);

      // 4️⃣ Store token + userId + role
      login(authResponse.token, matchedUser.id, ROLES.USER);

      // 5️⃣ Sync cart after successful login
      await syncCartAfterLogin(matchedUser.id, matchedUser);

      // 6️⃣ Redirect to intended page (from state or default to HOME)
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        console.error("Login error:", err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="login-page-wrapper">
      <main className="login-main">
        <div className="login-container">
          <div className="auth-card">
            <h1 className="auth-title">Login</h1>
            <p className="auth-subtitle">
              Welcome back! Please login to your account.
            </p>

            {error && <div className="auth-error">{error}</div>}

            <Formik
              initialValues={{ username: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="auth-form">
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <Field
                      id="username"
                      name="username"
                      className="form-input"
                      placeholder="Enter username"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <Field
                      id="password"
                      type="password"
                      name="password"
                      className="form-input"
                      placeholder="Enter password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <button
                    type="submit"
                    className="auth-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="auth-footer">
              <p className="auth-link-text">
                Don't have an account?{" "}
                <Link to={ROUTES.SIGNUP} className="auth-link" state={{ from }}>
                  Sign up
                </Link>
              </p>
              <Link to={ROUTES.HOME} className="auth-link">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
