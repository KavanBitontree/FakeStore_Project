import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/auth.api";
import { ROUTES } from "../routes/routes";
import { LoginSchema } from "../schemas/login";
import "./Login.scss";

const Login = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      const data = await loginUser(values.username, values.password);
      login(data.token, { username: values.username });
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
                    <label className="form-label">Username</label>
                    <Field
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
                    <label className="form-label">Password</label>
                    <Field
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
                Don’t have an account?{" "}
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
