import React, { useRef, useState, useEffect } from 'react';

const blogs = [
  { id: 1, img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', badge: 'New Feature', title: 'Explore our new feature', desc: 'Booking for female' },
  { id: 2, img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', badge: 'Female Travelers', title: 'Top women-friendly destinations', desc: 'Safe & secure' },
  { id: 3, img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', badge: 'Student', title: 'Budget destinations for student travellers in India', desc: 'Affordable trips' },
  { id: 4, img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', badge: 'Long Weekend', title: 'Top locations for a weekend road trip', desc: 'Quick getaways' },
  { id: 5, img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', badge: 'Mysore', title: 'Places to visit in Mysore', desc: 'Heritage & culture' },
];

export default function TravelBlogs() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ marginBottom: '40px', width: '100%', position: 'relative' }}>

    </div>
  );
}
