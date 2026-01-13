import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../context/AuthContext";
import { fetchUserById, updateUser } from "../services/user.api";
import { UserEditSchema } from "../schemas/user_edit";
import Navbar from "../components/Layout/Navbar/Navbar";
import "./Profile.scss";

import type { User } from "../types/user";

const Profile = () => {
  const { userId, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Fetch user on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    const loadUser = async () => {
      try {
        setLoading(true);
        const data = await fetchUserById(userId);
        setUser(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId, isAuthenticated]);

  if (!isAuthenticated) return null;

  if (loading || !user)
    return (
      <>
        <Navbar onSearch={null} />
        <div className="profile-loader">Loading...</div>
      </>
    );

  return (
    <div className="page-wrapper no-search">
      <Navbar onSearch={null} />
      <main className="main-content profile-wrapper">
        <div className="navbar-spacer" />

        <div className="profile-grid">
          {/* ----------------- LEFT COLUMN ----------------- */}
          <div className="profile-left">
            <div className="profile-card">
              <h1 className="profile-title">My Profile</h1>

              <section className="profile-section">
                <h3>Personal Info</h3>
                <p>
                  <span>Name</span>
                  {user.name?.firstname} {user.name?.lastname}
                </p>
                <p>
                  <span>Username</span>
                  {user.username}
                </p>
                <p>
                  <span>Email</span>
                  {user.email}
                </p>
                <p>
                  <span>Phone</span>
                  {user.phone}
                </p>
              </section>

              <section className="profile-section">
                <h3>Address</h3>
                <p>
                  {user.address?.number}, {user.address?.street}
                </p>
                <p>
                  {user.address?.city} - {user.address?.zipcode}
                </p>
                <p className="geo">
                  Lat: {user.address?.geolocation?.lat} | Long:{" "}
                  {user.address?.geolocation?.long}
                </p>
              </section>
            </div>
          </div>

          {/* ----------------- RIGHT COLUMN (EDIT FORM) ----------------- */}
          <div className="profile-right">
            <div className="profile-card profile-form-card">
              <h1 className="profile-title">Edit Profile</h1>

              <Formik
                initialValues={{
                  username: user.username,
                  email: user.email,
                  password: user.password,
                  confirmPassword: user.password,
                }}
                validationSchema={UserEditSchema}
                validateOnChange={true}
                validateOnBlur={true}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  try {
                    setSaving(true);
                    const confirm = window.confirm(
                      "Do you want to save changes?"
                    );
                    if (!confirm) {
                      setSaving(false);
                      setSubmitting(false);
                      return;
                    }

                    await updateUser(userId, {
                      username: values.username,
                      email: values.email,
                      password: values.password,
                    });

                    alert("Profile updated successfully!");
                    setUser((prev) => ({
                      ...prev,
                      username: values.username,
                      email: values.email,
                      password: values.password,
                    }));
                    resetForm({ values });
                  } catch (err) {
                    console.error("Update error:", err);
                    alert("Failed to update profile. Try again.");
                  } finally {
                    setSaving(false);
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, values, dirty, isValid, resetForm }) => {
                  const showConfirmPassword = values.password !== user.password;

                  return (
                    <Form className="profile-form">
                      <div className="form-group">
                        <label htmlFor="username">Username</label>
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
                        <label htmlFor="email">Email</label>
                        <Field
                          id="email"
                          name="email"
                          type="email"
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
                        <label htmlFor="password">Password</label>
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          className="form-input"
                          placeholder="Enter password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="form-error"
                        />
                      </div>

                      {showConfirmPassword && (
                        <div className="form-group">
                          <label htmlFor="confirmPassword">
                            Confirm Password
                          </label>
                          <Field
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="form-input"
                            placeholder="Confirm your password"
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="form-error"
                          />
                        </div>
                      )}

                      <div className="profile-form-actions">
                        <button
                          type="submit"
                          className="profile-form-button"
                          disabled={
                            isSubmitting || saving || !dirty || !isValid
                          }
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                          type="button"
                          className="profile-form-button profile-form-cancel"
                          onClick={() => resetForm()}
                        >
                          Cancel
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
