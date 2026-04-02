import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCoffee, FiBell } from 'react-icons/fi';
import { FaBed } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* Navigation */}
      <nav style={{ padding: '1rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 30, 30, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--glass-border)', position: 'fixed', width: '100%', top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--primary-color)', cursor: 'pointer' }} onClick={() => window.scrollTo(0,0)}>Colonial Grand</h1>
        
        {/* Desktop Menu */}
        <div className="desktop-menu">
          <a href="#about" style={{ color: '#fff', fontSize: '1rem', fontWeight: '500' }}>About</a>
          <a href="#amenities" style={{ color: '#fff', fontSize: '1rem', fontWeight: '500' }}>Amenities</a>
          <a href="#dining" style={{ color: '#fff', fontSize: '1rem', fontWeight: '500' }}>Dining</a>
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '0.6rem 1.5rem', marginLeft: '1rem' }}>Sign In / Book</button>
        </div>

        {/* Mobile Toggle Button */}
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="mobile-dropdown">
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#amenities" onClick={() => setIsMobileMenuOpen(false)}>Amenities</a>
            <a href="#dining" onClick={() => setIsMobileMenuOpen(false)}>Dining</a>
            <button className="btn-primary" onClick={() => navigate('/login')}>Sign In / Book</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{ 
        height: '100vh', 
        background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80") center/cover no-repeat',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '5%',
        paddingTop: '60px'
      }}>
        <div className="animate-fade-in" style={{ maxWidth: '650px' }}>
          <h1 style={{ fontSize: '4.5rem', color: '#fff', marginBottom: '1rem', lineHeight: '1.1' }}>Experience Absolute <span style={{ color: 'var(--primary-color)' }}>Luxury</span></h1>
          <p style={{ fontSize: '1.2rem', color: '#ddd', marginBottom: '2rem', lineHeight: '1.6' }}>
            Escape to the Colonial Grand. Immerse yourself in a secluded, elegant retreat complete with world-class dining, magnificent rooms, and uncompromising comfort designed exclusively for you.
          </p>
          <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }} onClick={() => navigate('/login')}>
            Start Your Journey
          </button>
        </div>
      </section>

      {/* About The Hotel Section */}
      <section id="about" style={{ padding: '6rem 5%', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Hotel Exterior" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
        </div>
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>A Legacy of Elegance</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
            Established in the heart of the city, Colonial Grand has redefined luxury hospitality for over two decades. We blend classic architectural grandeur with state-of-the-art modern amenities, creating a timeless environment for both leisure and business travelers.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
            Whether you are visiting for a weekend getaway, an executive conference, or a lavish wedding, our breathtaking venues and meticulously curated suites ensure every moment of your stay is nothing short of extraordinary.
          </p>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" style={{ padding: '6rem 5%', background: 'var(--surface-color)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Unparalleled Amenities</h2>
        <div className="grid-3" style={{ gap: '2rem' }}>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}><FaBed /></div>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Magnificent Rooms</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>From comfortable executive singles to breathtaking ocean-view presidential suites, our rooms are tailored for ultimate relaxation.</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}><FiCoffee /></div>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Gourmet Dining</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Satisfy your palate with signature dishes from our Michelin-star executive chefs at the exclusive Grand Restaurant.</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}><FiBell /></div>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>24/7 Premium Service</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Our dedicated concierge and room service staff work tirelessly round the clock to ensure your absolute perfection.</p>
          </div>
        </div>
      </section>

      {/* Restaurant Highlight Section */}
      <section id="dining" style={{ padding: '6rem 5%', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
        <div style={{ flex: '1 1 400px' }}>
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Restaurant" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
        </div>
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>The Grand Restaurant</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
            Our in-house dining experience brings global culinary excellence directly to your table. You can explore a diverse menu featuring locally sourced ingredients and international delicacies.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
            As a guest, you have the privilege of ordering exquisite room service directly from your booking dashboard, or reserving a romantic table overlooking the city skyline.
          </p>
        </div>
      </section>

      {/* Spa & Wellness Section */}
      <section style={{ padding: '6rem 5%', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Spa & Wellness" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
        </div>
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Oasis Spa & Wellness</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
            Rejuvenate your mind, body, and soul at our award-winning Oasis Spa. We offer an extensive range of holistic treatments, deep tissue massages, and revitalizing skincare therapies designed to melt away your stress.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
            Our state-of-the-art wellness center also includes a fully equipped fitness studio, heated indoor lap pools, and serene meditation gardens exclusively for our guests.
          </p>
        </div>
      </section>

      {/* Events & Weddings Section */}
      <section style={{ padding: '6rem 5%', background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80") center/cover fixed', color: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#fff' }}>Unforgettable Events</h2>
          <p style={{ fontSize: '1.2rem', color: '#ddd', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            From fairy-tale weddings in our grand ballroom to high-profile corporate conferences, the Colonial Grand provides breathtaking venues and dedicated event planners to ensure perfection down to the smallest detail.
          </p>
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>Inquire Now</button>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ background: 'var(--bg-color)', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', padding: '5rem 5%' }}>
          {/* Brand Col */}
          <div>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Colonial Grand</h3>
            <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>Redefining luxury hospitality and providing unparalleled experiences since our establishment.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ cursor: 'pointer', color: '#fff' }}>Fb.</span>
              <span style={{ cursor: 'pointer', color: '#fff' }}>Ig.</span>
              <span style={{ cursor: 'pointer', color: '#fff' }}>Tw.</span>
            </div>
          </div>
          
          {/* Links Col */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><a href="#about" style={{ color: 'var(--text-muted)' }}>Our Story</a></li>
              <li><a href="#amenities" style={{ color: 'var(--text-muted)' }}>Amenities</a></li>
              <li><a href="#dining" style={{ color: 'var(--text-muted)' }}>Dining</a></li>
              <li style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Book a Stay</li>
            </ul>
          </div>
          
          {/* Contact Col */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>123 Luxury Avenue</li>
              <li>Prestige District, Metropolis</li>
              <li>+1 (800) 555-0199</li>
              <li>concierge@colonialgrand.com</li>
            </ul>
          </div>
          
          {/* Newsletter Col */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Newsletter</h4>
            <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>Subscribe to receive exclusive offers and seasonal updates.</p>
            <form style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="Your email" style={{ padding: '0.8rem', flex: 1, borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'transparent', color: '#fff', outline: 'none' }} />
              <button className="btn-primary" style={{ padding: '0.8rem 1.2rem', borderRadius: '4px' }}>Submit</button>
            </form>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--surface-color)', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} Colonial Grand Hotel Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
