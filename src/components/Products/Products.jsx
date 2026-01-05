import { useEffect, useMemo, useState } from "react";
import "./Products.scss";
import ProductCard from "./ProductCard";
import Filter from "../Home/Filter";
import Pagination from "../Pagination/Pagination";
import { getProducts } from "../../services/products.api";

const ITEMS_PER_PAGE = 6;

const Products = ({ searchQuery = "" }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Handle filter changes from Filter component
  const handleFilterChange = (filtered) => {
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Apply search query to filtered products
  const searchedProducts = useMemo(() => {
    if (!searchQuery) return filteredProducts;

    return filteredProducts.filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
  }, [filteredProducts, searchQuery]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(searchedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return searchedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [searchedProducts, currentPage]);

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
            <Filter products={products} onFilterChange={handleFilterChange} />

            {searchedProducts.length === 0 ? (
              <div className="error-container">
                <p className="error-text">
                  No products found{searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
