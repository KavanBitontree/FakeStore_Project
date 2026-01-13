import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Layout/Navbar/Navbar";
import Footer from "../components/Layout/Footer/Footer";
import ProductCard from "../components/Products/ProductCard";
import { getProductById } from "../services/products.api";

import "../styles/page-offset.scss";
import "./Product.scss";

import type { Product } from "../types/product";

const Product = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  return (
    <div className="page-wrapper no-search">
      <Navbar onSearch={null} />

      <main className="main-content">
        <div className="navbar-spacer" />

        <div className="product-detail-container">
          {loading && <p>Loading product...</p>}
          {error && <p>{error}</p>}
          {product && (
            <ProductCard
              product={product}
              showFullDescription
              disableNavigation
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Product;
