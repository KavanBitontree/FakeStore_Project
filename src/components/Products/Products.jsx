import { useEffect, useMemo, useState } from "react";
import "./Products.scss";
import ProductCard from "./ProductCard";
import Filter from "../Home/Filter";
import { getProducts } from "../../services/products.api";

const Products = ({ searchQuery = "" }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch products once
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data); // initial = all products
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

  // 🔹 Callback from Filter component
  const handleFilterChange = (filtered) => {
    setFilteredProducts(filtered);
  };

  // 🔹 Apply search on top of filtered products
  const searchedProducts = useMemo(() => {
    if (!searchQuery) return filteredProducts;

    return filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredProducts, searchQuery]);

  return (
    <div className="border-div">
      <div className="border">
        {/* Loading */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading products...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-container">
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* Success */}
        {!loading && !error && (
          <>
            {/* Filter UI */}
            <Filter products={products} onFilterChange={handleFilterChange} />

            {/* Search + Filter result */}
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
