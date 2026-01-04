import { useState } from "react";
import Footer from "../components/Layout/Footer/Footer";
import Navbar from "../components/Layout/Navbar/Navbar";
import Products from "../components/Products/Products";
import "../styles/page-offset.scss";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="page-wrapper">
      <Navbar onSearch={setSearchQuery} />

      <main className="main-content">
        <div className="navbar-spacer" />
        <Products searchQuery={searchQuery} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
