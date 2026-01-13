import Navbar from "../components/Layout/Navbar/Navbar";
import Footer from "../components/Layout/Footer/Footer";
import CartMain from "../components/Cart/Cart";
import "../styles/page-offset.scss";

const Cart = () => {
  return (
    <div className="page-wrapper no-search">
      <Navbar onSearch={null} />
      <main className="main-content">
        <div className="navbar-spacer" />
        <CartMain />
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
