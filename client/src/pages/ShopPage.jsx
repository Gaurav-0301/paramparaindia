import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All';
  const currentSubCategory = searchParams.get('subCategory') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = ['All', 'Rakhis', 'Sweets', 'Gifts', 'Combos'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?sort=${currentSort}`;
      if (currentCategory !== 'All') url += `&category=${encodeURIComponent(currentCategory)}`;
      if (currentSubCategory) url += `&subCategory=${encodeURIComponent(currentSubCategory)}`;
      if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;

      const res = await axios.get(url);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch catalog products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentCategory, currentSubCategory, currentSort, currentSearch]);

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.delete('subCategory');
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  const handleFilterApply = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#9CAF97] font-semibold">
          Handcrafted Luxury Catalog
        </span>
        <h1 className="font-serif-display text-4xl font-semibold text-[#3A342E]">
          {currentCategory === 'All' ? 'Festive Collection' : currentCategory}
        </h1>
        {currentSearch && (
          <p className="text-xs text-[#3A342E]/60">
            Showing results for "<span className="font-semibold text-[#3A342E]">{currentSearch}</span>"
          </p>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
              currentCategory === cat
                ? 'bg-[#3A342E] text-[#FAF7F2] border-[#3A342E] shadow-sm'
                : 'glass-panel text-[#3A342E] border-[#D4B896]/40 hover:border-[#9CAF97]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter & Sort Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#D4B896]/40 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Price Range Filter Form */}
        <form onSubmit={handleFilterApply} className="flex items-center gap-2 text-xs">
          <SlidersHorizontal className="w-4 h-4 text-[#9CAF97]" />
          <span className="font-semibold text-[#3A342E]">Price Range (₹):</span>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-20 px-2.5 py-1.5 rounded-lg border border-[#D4B896]/50 bg-white text-[#3A342E] focus:outline-none"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-20 px-2.5 py-1.5 rounded-lg border border-[#D4B896]/50 bg-white text-[#3A342E] focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#9CAF97] text-white text-xs uppercase font-medium rounded-lg hover:bg-[#3A342E] transition-colors"
          >
            Apply
          </button>
        </form>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#3A342E]">Sort By:</span>
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="px-3 py-1.5 rounded-lg border border-[#D4B896]/50 bg-white text-[#3A342E] focus:outline-none font-medium"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="popular">Most Popular / Rating</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="h-80 bg-white/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white/40 rounded-2xl border border-[#EFE6D8] space-y-3">
          <Search className="w-10 h-10 text-[#D4B896] mx-auto stroke-1" />
          <h3 className="font-serif-display text-xl font-medium text-[#3A342E]">No products match your criteria</h3>
          <p className="text-xs text-[#3A342E]/60">Try clearing filters or searching for another term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(prod => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
};

export default ShopPage;
