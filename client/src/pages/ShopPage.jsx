import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, Layers, Grid, Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import RakhiCategoryBar from '../components/RakhiCategoryBar';
import { useCatalog } from '../context/CatalogContext';
import { getImageUrl, DEFAULT_CATEGORY_IMAGE } from '../utils/imageUrl';
import axios from 'axios';

const RAKHI_SUBCATEGORIES_ORDER = [
  'Bracelet & Combo Rakhi',
  'Designer & Pearl Rakhi',
  'Premium Rakhi',
  'Golden Rakhi',
  'Flower Design Rakhi',
  'Religious & Devotional Rakhi',
  'Kids & Charm Rakhi',
  'Peacock & Floral Rakhi',
  'Personalized Rakhi',
  'Rakhi Combo',
  'Exclusive Rakhi Sets'
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: catalogProducts, categories: catalogCategories, getSubcategoriesForCategory } = useCatalog();

  const currentCategory = searchParams.get('category') || 'All';
  const currentSubCategory = searchParams.get('subCategory') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState(catalogProducts);
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [viewMode, setViewMode] = useState('sections');

  const categories = ['All', 'Rakhis', 'Sweets', 'Gifts', 'Combos'];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/products?sort=${currentSort}&limit=100`;
      if (currentCategory !== 'All') url += `&category=${encodeURIComponent(currentCategory)}`;
      if (currentSubCategory) url += `&subCategory=${encodeURIComponent(currentSubCategory)}`;
      if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;

      const res = await axios.get(url);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [currentCategory, currentSubCategory, currentSort, currentSearch, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (categoryName) => {
    const params = new URLSearchParams(searchParams);
    if (categoryName === 'All') {
      params.delete('category');
    } else {
      params.set('category', categoryName);
    }
    params.delete('subCategory');
    setSearchParams(params);
  };

  const handleSubCategorySelect = (subCat) => {
    const params = new URLSearchParams(searchParams);
    if (subCat) {
      params.set('subCategory', subCat);
    } else {
      params.delete('subCategory');
    }
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

  // Enable subcategory section view across ALL main categories
  const isSectionView = !currentSubCategory && !currentSearch && viewMode === 'sections';

  const rawSubcats = getSubcategoriesForCategory ? getSubcategoriesForCategory(currentCategory) : [];
  const subCategoryList = rawSubcats && rawSubcats.length > 0
    ? rawSubcats
    : (catalogCategories && catalogCategories.length > 0 ? catalogCategories : RAKHI_SUBCATEGORIES_ORDER.map((name, idx) => ({ name, displayOrder: idx })));

  const groupedProducts = subCategoryList.map(catItem => {
    const subCatName = typeof catItem === 'string' ? catItem : catItem.name;
    const catImage = (typeof catItem === 'object' && catItem.image)
      ? catItem.image
      : 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=80';
    const catDescription = (typeof catItem === 'object' && catItem.description)
      ? catItem.description
      : `Handcrafted ${subCatName} collection for ${currentCategory === 'All' ? 'Parampara India' : currentCategory}.`;

    const matchingProducts = products.filter(p =>
      p.subCategory === subCatName ||
      p.subCategory?.toLowerCase() === subCatName.toLowerCase()
    );

    return {
      subCategoryName: subCatName,
      image: getImageUrl(catImage, DEFAULT_CATEGORY_IMAGE),
      description: catDescription,
      products: matchingProducts
    };
  }).filter(group => group.products.length > 0 || (rawSubcats && rawSubcats.some(c => c.name === group.subCategoryName)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#9CAF97] font-semibold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D4B896]" /> Handcrafted Luxury Catalog
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#3A342E]">
          {currentCategory === 'All' ? 'Festive Rakhi Collection' : currentCategory}
        </h1>
        {currentSubCategory && (
          <p className="text-xs text-[#9CAF97] font-semibold tracking-wide">
            Subcategory: <span className="text-[#3A342E]">{currentSubCategory}</span>
          </p>
        )}
        {currentSearch && (
          <p className="text-xs text-[#3A342E]/60">
            Showing results for "<span className="font-semibold text-[#3A342E]">{currentSearch}</span>"
          </p>
        )}
      </div>

      {/* Main Category Pills */}
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

      {/* Circular Subcategories Header Bar (rendered for all main categories) */}
      <div className="glass-panel p-2 sm:p-4 rounded-2xl border border-[#D4B896]/40 shadow-xs">
        <RakhiCategoryBar
          activeSubCategory={currentSubCategory}
          onSelectSubCategory={handleSubCategorySelect}
          currentCategory={currentCategory}
        />
      </div>

      {/* Filter, Sort & View Mode Switcher Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#D4B896]/40 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Price Range Filter Form */}
        <form onSubmit={handleFilterApply} className="flex items-center gap-2 text-xs flex-wrap">
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

        {/* Right Action Switcher (View Mode & Sort) */}
        <div className="flex items-center gap-4 text-xs flex-wrap">
          
          {/* Layout Toggle (Subcategory Sections vs Grid) */}
          {!currentSubCategory && (
            <div className="flex items-center bg-white/80 p-1 rounded-xl border border-[#D4B896]/40">
              <button
                onClick={() => setViewMode('sections')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'sections' ? 'bg-[#3A342E] text-white shadow-2xs' : 'text-[#3A342E]/70 hover:text-[#3A342E]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Subcategory Sections
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid' ? 'bg-[#3A342E] text-white shadow-2xs' : 'text-[#3A342E]/70 hover:text-[#3A342E]'
                }`}
              >
                <Grid className="w-3.5 h-3.5" /> All Grid
              </button>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
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

      </div>

      {/* Main Content Display */}
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
          <p className="text-xs text-[#3A342E]/60">Try clearing filters or selecting another category</p>
          {currentSubCategory && (
            <button
              onClick={() => handleSubCategorySelect('')}
              className="mt-2 px-4 py-2 bg-[#3A342E] text-white text-xs uppercase rounded-lg font-semibold"
            >
              View All {currentCategory === 'All' ? 'Products' : currentCategory}
            </button>
          )}
        </div>
      ) : isSectionView ? (
        /* DEDICATED SECTIONS FOR EACH SUBCATEGORY UNDER RAKHIS */
        <div className="space-y-12 py-4">
          {groupedProducts.map(group => {
            if (group.products.length === 0) return null;
            return (
              <section key={group.subCategoryName} className="glass-panel p-5 sm:p-8 rounded-3xl border border-[#D4B896]/40 space-y-6 shadow-2xs">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE6D8] pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4B896] shrink-0 shadow-sm bg-white">
                      <img src={group.image} alt={group.subCategoryName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif-display text-xl sm:text-2xl font-semibold text-[#3A342E]">
                          {group.subCategoryName}
                        </h2>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#9CAF97]/20 text-[#3A342E]">
                          {group.products.length} Designs
                        </span>
                      </div>
                      <p className="text-xs text-[#3A342E]/70 mt-0.5">{group.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubCategorySelect(group.subCategoryName)}
                    className="px-4 py-2 bg-[#3A342E] text-[#FAF7F2] text-xs uppercase font-semibold tracking-wider rounded-xl hover:bg-[#9CAF97] transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0 shadow-2xs"
                  >
                    View All {group.subCategoryName} <ArrowRight className="w-3.5 h-3.5 text-[#D4B896]" />
                  </button>
                </div>

                {/* Subcategory Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {group.products.map(prod => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </div>

              </section>
            );
          })}
        </div>
      ) : (
        /* STANDARD ALL PRODUCTS GRID VIEW */
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
