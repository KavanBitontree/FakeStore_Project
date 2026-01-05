import { useState, useEffect } from "react";
import "./Filter.scss";

const Filter = ({ products, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Get unique categories and max price from products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const max = Math.ceil(Math.max(...prices));
      setMaxPrice(max);
      setPriceRange([0, max]);
    }
  }, [products]);

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters(category, priceRange);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    const newRange = [0, value];
    setPriceRange(newRange);
    applyFilters(selectedCategory, newRange);
  };

  const applyFilters = (category, range) => {
    const filtered = products.filter((product) => {
      const categoryMatch = category === "all" || product.category === category;
      const priceMatch = product.price >= range[0] && product.price <= range[1];
      return categoryMatch && priceMatch;
    });
    onFilterChange(filtered);
  };

  const handleReset = () => {
    setSelectedCategory("all");
    setPriceRange([0, maxPrice]);
    onFilterChange(products);
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="filter-section">
        <label className="filter-label">Category</label>
        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="price-slider"
        />
        <div className="price-labels">
          <span>$0</span>
          <span>${maxPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Filter;
