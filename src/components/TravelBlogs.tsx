import React from 'react';

const blogs = [
  { id: 1, img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', badge: 'New Feature', title: 'Explore our new feature', desc: 'Booking for female' },
  { id: 2, img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', badge: 'Female Travelers', title: 'Top women-friendly destinations', desc: 'Safe & secure' },
  { id: 3, img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', badge: 'Student', title: 'Budget destinations for student travellers in India', desc: 'Affordable trips' },
  { id: 4, img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', badge: 'Long Weekend', title: 'Top locations for a weekend road trip', desc: 'Quick getaways' },
  { id: 5, img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', badge: 'Mysore', title: 'Places to visit in Mysore', desc: 'Heritage & culture' },
];

export default function TravelBlogs() {
  return (
    <div style={{ marginBottom: '40px', width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '24px' }}>Travel Blogs</h2>
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
        {blogs.map(blog => (
          <div key={blog.id} style={{ minWidth: '220px', maxWidth: '220px', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s', borderRadius: '16px' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ height: '160px', width: '100%', borderRadius: '16px 16px 0 0', overflow: 'hidden', position: 'relative' }}>
              <img src={blog.img} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '0 0 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0', lineHeight: '1.4' }}>{blog.title}</h3>
              <p style={{ fontSize: '12px', color: '#4b5563', margin: 0 }}>{blog.desc}</p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
              {blog.badge}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
