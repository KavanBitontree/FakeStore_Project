import Navbar from "../components/Layout/Navbar/Navbar";
import Products from "../components/Products/Products";
import { useState } from "react";

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <div className="page-wrapper">
      <Navbar onSearch={setSearchQuery} />

      <main className="main-content">
        <div className="navbar-spacer" />
        <Products searchQuery={searchQuery} />
      </main>
    </div>
  );
};

export default Admin;
