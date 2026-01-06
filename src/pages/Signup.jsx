import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signupUser } from "../services/auth.api";
import { ROUTES } from "../routes/routes";
import { SignupSchema } from "../schemas/signup";
import "./Login.scss";

const Signup = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      await signupUser(values);
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <main className="login-main">
        <div className="login-container">
          <div className="auth-card">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Sign up to start shopping with us.</p>

            {error && <div className="auth-error">{error}</div>}

            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={SignupSchema}
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
                    <label className="form-label">Email</label>
                    <Field
                      name="email"
                      className="form-input"
                      placeholder="Enter email"
                    />
                    <ErrorMessage
                      name="email"
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

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      className="form-input"
                      placeholder="Confirm password"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <button
                    type="submit"
                    className="auth-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating account..." : "Sign Up"}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="auth-footer">
              <p className="auth-link-text">
                Already have an account?{" "}
                <Link to={ROUTES.LOGIN} className="auth-link">
                  Login
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

export default Signup;
