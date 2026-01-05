import { useEffect, useMemo, useState } from "react";
import "./Products.scss";
import ProductCard from "./ProductCard";
import { getProducts } from "../../services/products.api";

const Products = ({ searchQuery = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch products once
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 🔹 Search logic (derived data)
  const searchedProducts = useMemo(() => {
    if (!searchQuery) return products;

    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <div className="border-div">
      <div className="border">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error-text">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {searchedProducts.length === 0 ? (
              <div className="error-container">
                <p className="error-text">
                  No products found{searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
            ) : (
              <div className="products-grid">
                {searchedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
