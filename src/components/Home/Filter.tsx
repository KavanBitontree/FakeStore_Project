import { useState, useEffect } from "react";
import "./Filter.scss";
import type { Product } from "../../types/product";

type FilterProps = {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
};

const Filter = ({ products, onFilterChange }: FilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>("default");

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    applyFilters(category, priceRange, sortBy);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newRange = [0, value];
    setPriceRange(newRange);
    applyFilters(selectedCategory, newRange, sortBy);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    applyFilters(selectedCategory, priceRange, newSort);
  };

  const applyFilters = (category: string, range: number[], sort: string) => {
    // First, filter by category and price
    let filtered = products.filter((product: Product): boolean => {
      const categoryMatch = category === "all" || product.category === category;
      const priceMatch = product.price >= range[0] && product.price <= range[1];
      return categoryMatch && priceMatch;
    });

    // Then, apply sorting
    if (sort === "name-asc") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "name-desc") {
      filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
    } else if (sort === "price-asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    // "default" means no sorting applied

    onFilterChange(filtered);
  };

  const handleReset = () => {
    setSelectedCategory("all");
    setPriceRange([0, maxPrice]);
    setSortBy("default");
    onFilterChange(products);
  };

  // Calculate percentage for slider gradient
  const sliderPercentage: number = ((priceRange[1] - 0) / (maxPrice - 0)) * 100;

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
        <label className="filter-label">Sort By</label>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="default">Default</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
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
          style={{
            background: `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${sliderPercentage}%, #666 ${sliderPercentage}%, #666 100%)`,
          }}
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
