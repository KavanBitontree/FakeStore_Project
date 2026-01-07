import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.scss";

import ProductCard from "./ProductCard";
import ProductForm from "../../pages/ProductForm";
import Filter from "../Home/Filter";
import Pagination from "../Pagination/Pagination";
import { getProducts } from "../../services/products.api";
import {
  initializeProducts,
  getStoredProducts,
  areProductsInitialized,
} from "../../utils/productUtils";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../routes/routes";

const ITEMS_PER_PAGE = 6;

const Products = ({ searchQuery = "" }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);

  const { role } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === ROLES.ADMIN;

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        if (areProductsInitialized()) {
          const storedProducts = getStoredProducts();
          setProducts(storedProducts);
          setFilteredProducts(storedProducts);
        } else {
          const apiProducts = await getProducts();
          const initializedProducts = initializeProducts(apiProducts);
          setProducts(initializedProducts);
          setFilteredProducts(initializedProducts);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    const handleProductsUpdated = () => {
      const updatedProducts = getStoredProducts();
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    };

    window.addEventListener("productsUpdated", handleProductsUpdated);
    return () =>
      window.removeEventListener("productsUpdated", handleProductsUpdated);
  }, []);

  // Filter logic
  const handleFilterChange = (filtered) => {
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const searchedProducts = useMemo(() => {
    if (!searchQuery) return filteredProducts;
    const q = searchQuery.toLowerCase();
    return filteredProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [filteredProducts, searchQuery]);

  useEffect(() => setCurrentPage(1), [searchQuery]);

  const totalPages = Math.ceil(searchedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return searchedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [searchedProducts, currentPage]);

  // ------------------ RENDER ------------------
  if (editingProduct) {
    return (
      <ProductForm
        mode="Edit"
        initialValues={editingProduct}
        onDone={() => setEditingProduct(null)}
      />
    );
  }

  return (
    <div className="border-div">
      <div className="border">
        {loading && <p>Loading products...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            <div className="products-toolbar">
              <Filter products={products} onFilterChange={handleFilterChange} />

              {isAdmin && (
                <button
                  className="auth-button"
                  onClick={() =>
                    setEditingProduct(null) || navigate(ROUTES.PRODUCT_FORM)
                  }
                >
                  + Add Product
                </button>
              )}
            </div>

            {searchedProducts.length === 0 ? (
              <p>No products found</p>
            ) : (
              <>
                <div className="products-grid">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      disableNavigation={isAdmin}
                      onEdit={() => setEditingProduct(product)} // Pass edit handler
                    />
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
