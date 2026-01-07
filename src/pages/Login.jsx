import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { loginUser } from "../services/auth.api";
import { fetchAllUsers } from "../services/user.api";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/routes";
import { LoginSchema } from "../schemas/login";
import { syncCartAfterLogin } from "../utils/cartUtils";

import "./Login.scss";

const Login = () => {
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");

      // 1️⃣ Authenticate (returns token only)
      const authResponse = await loginUser(values.username, values.password);

      // 2️⃣ Fetch all users (FakeStore limitation)
      const users = await fetchAllUsers();

      // 3️⃣ Find logged-in user
      const matchedUser = users.find(
        (user) => user.username === values.username
      );

      if (!matchedUser) {
        throw new Error("User not found");
      }

      // 4️⃣ Store token + userId ONLY
      login(authResponse.token, matchedUser.id);

      // 5️⃣ Sync cart after successful login
      await syncCartAfterLogin(matchedUser.id, matchedUser);

      // 6️⃣ Redirect
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
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
                <Link to={ROUTES.SIGNUP} className="auth-link">
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
