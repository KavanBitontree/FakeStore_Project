import Navbar from "../components/Layout/Navbar/Navbar";
import Products from "../components/Products/Products";

const Admin = () => {
  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content">
        <div className="navbar-spacer" />
        <Products />
      </main>
    </div>
  );
};

export default Admin;
