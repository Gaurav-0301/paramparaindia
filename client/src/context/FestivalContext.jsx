import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FestivalContext = createContext();

const DEFAULT_FESTIVAL = {
  festivalKey: 'raksha-bandhan',
  title: 'Raksha Bandhan',
  tagline: 'A Sacred Thread of Eternal Bond & Love',
  heroHeadline: 'Celebrate the Pure Bond of Sibling Love & Protection',
  heroSubheadline: 'Handcrafted premium Rakhis, curated mithai hampers, and timeless keepsake jewelry delivered directly to your loved ones.',
  storyTitle: 'The Story & Sacred Sentiment of Raksha Bandhan',
  storyNarrative: `Raksha Bandhan is more than a tradition; it is an emotional promise wrapped in silk and gold. Originating from ancient Vedic heritage, the sacred thread (Rakhi) symbolizes a sister's heartfelt prayers for her brother's longevity and prosperity, and a brother's silent pledge to stand as her eternal protector. At Parampara India, we craft each piece with reverence for this timeless memory — pairing artisan craftsmanship with soft-luxury elegance so your bond transcends distance.`,
  bannerImage: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=1600&auto=format&fit=crop&q=80',
  storyImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=80',
  countdownTargetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days ahead
  isActive: true
};

export const FestivalProvider = ({ children }) => {
  const [festival, setFestival] = useState(DEFAULT_FESTIVAL);
  const [loading, setLoading] = useState(true);

  const fetchActiveFestival = async () => {
    try {
      const res = await axios.get('/api/festival/active');
      if (res.data.festival) {
        setFestival(res.data.festival);
      }
    } catch (err) {
      console.warn('Using default Raksha Bandhan festival config');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveFestival();
  }, []);

  return (
    <FestivalContext.Provider value={{ festival, loading, refetchFestival: fetchActiveFestival }}>
      {children}
    </FestivalContext.Provider>
  );
};

export const useFestival = () => useContext(FestivalContext);
