import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CatalogContext = createContext();

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get('/api/products?limit=100');
      if (res.data && res.data.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Error fetching catalog products:', err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`/api/categories?_t=${Date.now()}`);
      if (res.data && res.data.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const parentCategories = React.useMemo(() => {
    const fromCategories = categories.map(c => c.parentCategory).filter(Boolean);
    const fromProducts = products.map(p => p.category).filter(Boolean);
    const set = new Set([...fromCategories, ...fromProducts]);
    const list = Array.from(set).map(cat => (cat.toLowerCase() === 'rakhis' ? 'Special Collections' : cat));
    return Array.from(new Set(list));
  }, [categories, products]);

  const getSubcategoriesForCategory = useCallback((parentCategory) => {
    if (!parentCategory || parentCategory === 'All') {
      return categories;
    }
    const target = parentCategory.toLowerCase();
    return categories.filter(cat => {
      const p = (cat.parentCategory || '').toLowerCase();
      if (p === target) return true;
      if (
        (target === 'rakhis' || target === 'special collections') &&
        (p === 'rakhis' || p === 'special collections' || !p)
      ) {
        return true;
      }
      return false;
    });
  }, [categories]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    const handleCatalogUpdate = () => {
      fetchProducts();
      fetchCategories();
    };

    window.addEventListener('catalogUpdated', handleCatalogUpdate);
    window.addEventListener('categoryUpdated', handleCatalogUpdate);
    window.addEventListener('productUpdated', handleCatalogUpdate);

    return () => {
      window.removeEventListener('catalogUpdated', handleCatalogUpdate);
      window.removeEventListener('categoryUpdated', handleCatalogUpdate);
      window.removeEventListener('productUpdated', handleCatalogUpdate);
    };
  }, [fetchProducts, fetchCategories]);

  const notifyCatalogChange = useCallback(() => {
    fetchProducts();
    fetchCategories();
    window.dispatchEvent(new Event('catalogUpdated'));
  }, [fetchProducts, fetchCategories]);

  return (
    <CatalogContext.Provider
      value={{
        products,
        setProducts,
        categories,
        setCategories,
        parentCategories,
        loadingProducts,
        loadingCategories,
        refetchProducts: fetchProducts,
        refetchCategories: fetchCategories,
        getSubcategoriesForCategory,
        notifyCatalogChange
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
