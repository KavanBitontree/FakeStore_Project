import { useEffect, useState } from "react";
import { fetchAllUsers } from "../services/user.api";
import Navbar from "../components/Layout/Navbar/Navbar";
import "../styles/page-offset.scss";
import "./Users.scss";

import type { User } from "../types/user";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper no-search">
        <Navbar onSearch={null} />
        <main className="main-content">
          <div className="navbar-spacer" />
          <div className="users-container">
            <div className="loader">Loading users...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <Navbar onSearch={null} />
        <main className="main-content">
          <div className="navbar-spacer" />
          <div className="users-container">
            <p className="error">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrapper no-search">
      <Navbar onSearch={null} />
      <main className="main-content">
        <div className="navbar-spacer" />
        <div className="users-container">
          <h1 className="users-title">Users</h1>

          <div className="users-grid">
            {users.map((user) => (
              <div className="user-card" key={user.id}>
                <div className="avatar">
                  {user.username?.charAt(0).toUpperCase()}
                </div>

                <div className="user-info">
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Users;
