import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getImageUrl, DEFAULT_CATEGORY_IMAGE } from '../utils/imageUrl';
import { useCatalog } from '../context/CatalogContext';

const FALLBACK_CATEGORIES = [
  { name: 'Bracelet & Combo Rakhi', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&auto=format&fit=crop&q=80' },
  { name: 'Designer & Pearl Rakhi', image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=80' },
  { name: 'Premium Rakhi', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80' },
  { name: 'Golden Rakhi', image: 'https://images.unsplash.com/photo-1611591475140-be3e72a2034c?w=500&auto=format&fit=crop&q=80' },
  { name: 'Flower Design Rakhi', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=80' },
  { name: 'Religious & Devotional Rakhi', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=500&auto=format&fit=crop&q=80' },
  { name: 'Kids & Charm Rakhi', image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&auto=format&fit=crop&q=80' },
  { name: 'Peacock & Floral Rakhi', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80' },
  { name: 'Personalized Rakhi', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=80' },
  { name: 'Rakhi Combo', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&auto=format&fit=crop&q=80' },
  { name: 'Exclusive Rakhi Sets', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80' }
];

const RakhiCategoryBar = ({ activeSubCategory, onSelectSubCategory, title = "Explore Rakhi Categories" }) => {
  const { categories: catalogCategories } = useCatalog();
  const scrollContainerRef = useRef(null);

  const categories = catalogCategories && catalogCategories.length > 0 ? catalogCategories : FALLBACK_CATEGORIES;

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full py-4 sm:py-6 relative">
      
      {/* Header Label if title provided */}
      {title && (
        <div className="flex items-center justify-between px-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4B896]" />
            <h3 className="font-serif-display text-lg sm:text-xl font-semibold text-[#3A342E]">
              {title}
            </h3>
          </div>
          {activeSubCategory && (
            <button
              onClick={() => onSelectSubCategory('')}
              className="text-xs text-[#9CAF97] hover:text-[#3A342E] font-medium underline underline-offset-4"
            >
              Clear Subcategory Filter
            </button>
          )}
        </div>
      )}

      {/* Main Carousel Wrapper */}
      <div className="relative group">
        
        {/* Scroll Left Button */}
        <button
          onClick={() => handleScroll('left')}
          aria-label="Scroll Left"
          className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 text-[#3A342E] shadow-md border border-[#D4B896]/40 flex items-center justify-center hover:bg-[#3A342E] hover:text-white transition-all focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Scroll Right Button */}
        <button
          onClick={() => handleScroll('right')}
          aria-label="Scroll Right"
          className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 text-[#3A342E] shadow-md border border-[#D4B896]/40 flex items-center justify-center hover:bg-[#3A342E] hover:text-white transition-all focus:outline-none"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Circular Categories Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-start gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth px-4 sm:px-6 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, idx) => {
            const isSelected = activeSubCategory === cat.name;
            return (
              <div
                key={cat._id || idx}
                onClick={() => onSelectSubCategory(isSelected ? '' : cat.name)}
                className="flex flex-col items-center cursor-pointer shrink-0 group/item w-24 sm:w-28 text-center transition-all transform hover:-translate-y-1"
              >
                {/* Circle Avatar with Ring */}
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all duration-300 ${
                    isSelected
                      ? 'ring-4 ring-[#D4B896] ring-offset-2 ring-offset-[#FAF7F2] scale-105 shadow-lg'
                      : 'border-2 border-[#D4B896]/40 hover:border-[#9CAF97] group-hover/item:shadow-md'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <img
                      src={getImageUrl(cat.image, DEFAULT_CATEGORY_IMAGE)}
                      alt={cat.name}
                      onError={(e) => { e.target.src = DEFAULT_CATEGORY_IMAGE; }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Highlight Glow Tag if Selected */}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4B896] text-[#3A342E] text-[10px] font-bold flex items-center justify-center shadow">
                      ✓
                    </span>
                  )}
                </div>

                {/* Subcategory Label */}
                <span
                  className={`mt-2.5 text-xs sm:text-[13px] leading-tight font-medium transition-colors line-clamp-2 px-1 ${
                    isSelected
                      ? 'text-[#3A342E] font-bold scale-105'
                      : 'text-[#3A342E]/80 group-hover/item:text-[#9CAF97]'
                  }`}
                >
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default RakhiCategoryBar;
