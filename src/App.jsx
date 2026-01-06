import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import { ROUTES } from "./routes/routes";

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <main>
      <ScrollToTop />
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.PRODUCT_DETAIL} element={<Product />} />
        <Route path={ROUTES.CART} element={<Cart />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        {/* <Route path={ROUTES.SIGNUP} element={<Signup />} /> */}
      </Routes>
    </main>
  );
}

export default App;
