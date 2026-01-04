import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./Products.scss";

const Products = ({ searchQuery = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // 🔁 Replace with your real API
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Derived data (NO state, NO useEffect)
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 UI states
  if (loading) {
    return <div className="products-status">Loading products...</div>;
  }

  if (error) {
    return <div className="products-status error">{error}</div>;
  }

  if (!filteredProducts.length) {
    return (
      <div className="products-status">
        No products found{searchQuery && ` for "${searchQuery}"`}
      </div>
    );
  }

  return (
    <section className="products">
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Products;
