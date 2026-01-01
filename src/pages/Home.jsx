import Footer from "../components/Layout/Footer/Footer";
import Navbar from "../components/Layout/Navbar/Navbar";
import Products from "../components/Products/Products";
import "../styles/page-offset.scss";

const Home = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="navbar-spacer" />
        <Products />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
