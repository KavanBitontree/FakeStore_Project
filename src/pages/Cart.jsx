import Navbar from "../components/Layout/Navbar/Navbar";
import Footer from "../components/Layout/Footer/Footer";
import "../styles/page-offset.scss";

const Cart = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="navbar-spacer" />
        <div className="cart-container">
          <h1>Cart Page</h1>
          <p>This is a dummy cart page.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;

