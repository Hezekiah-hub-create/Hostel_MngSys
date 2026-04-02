import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiArrowRight, FiStar, FiMapPin, FiPhone, FiMail, FiInstagram, FiTwitter, FiFacebook, FiSunset, FiWind, FiAward, FiHeart } from 'react-icons/fi';
import { FaBed, FaConciergeBell, FaSpa } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));

  const CustomDateInput = forwardRef(({ value, onClick, label }, ref) => (
    <div style={{ cursor: 'pointer' }} onClick={onClick} ref={ref}>
      <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', letterSpacing: '1px', fontFamily: 'var(--font-family-body)' }}>{label}</label>
      <div style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', fontFamily: 'var(--font-family-body)' }}>{value}</div>
    </div>
  ));
  CustomDateInput.displayName = 'CustomDateInput';

  const highlights = [
    { icon: <FiAward />, title: 'Award Winning', desc: 'Recognized by Forbes Travel Guide five years running.' },
    { icon: <FaSpa />, title: 'Oasis Spa', desc: 'World-class treatments in our serene wellness retreat.' },
    { icon: <FaConciergeBell />, title: '24/7 Concierge', desc: 'Bespoke service, any hour, any request.' },
    { icon: <FiHeart />, title: 'Curated Stays', desc: 'Every detail tailored to your personal preferences.' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', overflowX: 'hidden' }}>

      {/* Hero Section */}
      <section style={{ 
        height: '100vh', 
        backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 5%',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.4) 50%, var(--bg-color) 100%)', zIndex: 0 }}></div>
        
        <div style={{ maxWidth: '1000px', position: 'relative', zIndex: 1 }}>
          <h4 style={{ color: 'var(--primary-color)', letterSpacing: '8px', marginBottom: '2rem', fontWeight: '400', fontSize: '0.85rem', fontFamily: 'var(--font-family-body)' }}>ESTABLISHED 1998</h4>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: '#fff', marginBottom: '2rem', lineHeight: '1.1' }}>
            BEHOLD THE <br />
            <span style={{ fontStyle: 'italic', color: 'var(--primary-color)', fontWeight: '400' }}>Incomparable</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.75)', maxWidth: '600px', margin: '0 auto 3rem', fontWeight: '300', letterSpacing: '0.5px', lineHeight: '1.9', fontFamily: 'var(--font-family-body)' }}>
            A sanctuary of curated elegance where historical grandeur meets the pinnacle of modern luxury.
          </p>
          <button className="btn-primary" onClick={() => navigate('/rooms')}>Explore The Collection</button>
        </div>

        {/* Floating Quick Reserve */}
        <div 
          className="quick-book-bar"
          style={{ 
            position: 'absolute', bottom: '4rem', zIndex: 1
          }}
        >
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
             <DatePicker selected={startDate} onChange={date => setStartDate(date)} customInput={<CustomDateInput label="Arrival" />} />
             <DatePicker selected={endDate} onChange={date => setEndDate(date)} customInput={<CustomDateInput label="Departure" />} />
             <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem' }} className="mobile-hide-border">
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', letterSpacing: '1px', fontFamily: 'var(--font-family-body)' }}>Guests</label>
                <div style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', fontFamily: 'var(--font-family-body)' }}>02 ADULTS</div>
             </div>
          </div>
          <button className="btn-primary" onClick={() => navigate('/rooms')}>Reserve Stay</button>
        </div>
      </section>

      {/* Highlights Strip */}
      <section style={{ padding: '5rem 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          {highlights.map((h, i) => (
            <div key={i} style={{ 
              display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.5rem 2rem',
              background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.08)',
              borderRadius: '20px', transition: 'all 0.3s'
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.08)'}
            >
              <div style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>{h.icon}</div>
              <div>
                <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{h.title}</div>
                <div style={{ color: '#666', fontSize: '0.8rem', fontFamily: 'var(--font-family-body)' }}>{h.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About / Heritage - Split Section */}
      <section id="about" style={{ display: 'flex', alignItems: 'stretch', minHeight: '600px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', minHeight: '400px', backgroundImage: 'url("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', borderRadius: '0 40px 40px 0', overflow: 'hidden' }}>
        </div>
        <div style={{ flex: '1 1 400px', padding: '5rem 5%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ color: 'var(--primary-color)', letterSpacing: '5px', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-family-body)' }}>THE LEGACY</h4>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            A History of<br />
            <span style={{ fontStyle: 'italic', fontWeight: '400' }}>Excellence</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', fontSize: '1.05rem', marginBottom: '2.5rem', fontFamily: 'var(--font-family-body)' }}>
            Established in the golden age of travel, the Colonial Grand has stood as a beacon of architectural magnificence for over two decades. We don't just offer rooms — we offer a continuation of heritage, tradition, and world-class hospitality.
          </p>
          <div style={{ display: 'flex', gap: '3rem' }}>
            {[{ n: '25+', l: 'Years' }, { n: '50K+', l: 'Guests' }, { n: '5★', l: 'Rating' }].map(s => (
              <div key={s.l}>
                <div style={{ color: 'var(--primary-color)', fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-family-title)' }}>{s.n}</div>
                <div style={{ color: '#666', fontSize: '0.75rem', letterSpacing: '1px', fontFamily: 'var(--font-family-body)', marginTop: '0.3rem' }}>{s.l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suite Collection */}
      <section style={{ padding: '8rem 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h4 style={{ color: 'var(--primary-color)', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-family-body)' }}>The Curated Selection</h4>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#fff', fontWeight: '400' }}>
            THE SUITE <span style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Collection</span>
          </h2>
        </div>

        <div className="grid-3">
          {[
            { type: 'Classic King', img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80', desc: 'Timeless elegance for the modern executive.' },
            { type: 'Deluxe Ocean', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', desc: 'Breathtaking vistas of the metropolitan skyline.' },
            { type: 'Presidential', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80', desc: 'The ultimate pinnacle of prestige and privacy.' }
          ].map((room, i) => (
            <div key={i} style={{ 
              borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.08)',
              background: 'var(--surface-color)', transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)', cursor: 'pointer'
            }}
              onClick={() => navigate('/rooms')}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
                <img src={room.img} alt={room.type} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)' }}></div>
              </div>
              <div style={{ padding: '2rem 2rem 2.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.6rem', fontWeight: '500' }}>{room.type} Suite</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', fontFamily: 'var(--font-family-body)', fontSize: '0.95rem' }}>{room.desc}</p>
                <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem' }}>
                   VIEW DETAILS <FiArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="btn-primary" onClick={() => navigate('/rooms')} style={{ padding: '1.1rem 3.5rem' }}>VIEW FULL COLLECTION</button>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '8rem 5%', background: 'var(--surface-color)', borderRadius: '40px', margin: '0 3%' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
               <h4 style={{ color: 'var(--primary-color)', letterSpacing: '6px', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-family-body)' }}>GUEST PERSPECTIVES</h4>
               <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#fff', fontWeight: '400' }}>Voices of <span style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Excellence</span></h2>
            </div>
            <p style={{ color: 'var(--text-muted)', maxWidth: '380px', fontSize: '1rem', lineHeight: '1.8', fontFamily: 'var(--font-family-body)' }}>Hear from our global community of travelers who define luxury by Colonial Grand standards.</p>
         </div>

         <div className="grid-3">
            {[
              { name: 'Sarah Montgomery', role: 'Architect', text: 'An architectural marvel. The attention to detail in the Presidential Suite is simply unparalleled.' },
              { name: 'James Chen', role: 'Venture Partner', text: 'The dining experience at The Grand is world-class. A perfect blend of local culture and global standards.' },
              { name: 'Elena Rossi', role: 'Artist', text: 'A sanctuary in the city. The Oasis Spa provided the most rejuvenating experience I have ever had.' }
            ].map((t, i) => (
              <div key={i} style={{ 
                padding: '2.5rem', borderRadius: '24px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.08)',
                transition: 'all 0.4s'
              }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.08)'}
              >
                 <div style={{ display: 'flex', color: 'var(--primary-color)', gap: '0.3rem', marginBottom: '1.5rem' }}>
                    <FiStar fill="var(--primary-color)" size={16} /> <FiStar fill="var(--primary-color)" size={16} /> <FiStar fill="var(--primary-color)" size={16} /> <FiStar fill="var(--primary-color)" size={16} /> <FiStar fill="var(--primary-color)" size={16} />
                 </div>
                 <p style={{ fontSize: '1.1rem', fontStyle: 'italic', lineHeight: '1.8', marginBottom: '2rem', color: '#fff', fontFamily: 'var(--font-family-title)' }}>"{t.text}"</p>
                 <div>
                    <div style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '0.95rem' }}>{t.name}</div>
                    <div style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-family-body)', marginTop: '0.3rem' }}>{t.role}</div>
                 </div>
              </div>
            ))}
         </div>
      </section>

      <section id="dining" style={{ display: 'flex', alignItems: 'stretch', minHeight: '600px', margin: '8rem 0', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', padding: '5rem 5%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ color: 'var(--primary-color)', letterSpacing: '5px', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-family-body)' }}>GASTRONOMIC JOURNEY</h4>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            The Art of<br />
            <span style={{ fontStyle: 'italic', fontWeight: '400' }}>Dining</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', fontSize: '1.05rem', marginBottom: '2rem', fontFamily: 'var(--font-family-body)' }}>
            Our signature restaurant, <span style={{ color: '#fff' }}>The Grand</span>, is a theater of culinary excellence. Led by our executive chefs, we serve masterpieces crafted from the finest seasonal ingredients.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
               <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '1.3rem' }}><FiWind /></div>
               <div>
                  <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>Vintage Collection</div>
                  <div style={{ color: '#666', fontSize: '0.85rem', fontFamily: 'var(--font-family-body)' }}>A private cellar featuring over 5,000 rare vintages.</div>
               </div>
            </div>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
               <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '1.3rem' }}><FiSunset /></div>
               <div>
                  <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>Panoramic View</div>
                  <div style={{ color: '#666', fontSize: '0.85rem', fontFamily: 'var(--font-family-body)' }}>Dine among the stars with 360-degree skyline vistas.</div>
               </div>
            </div>
          </div>
          <button className="btn-primary" onClick={() => navigate('/gastronomy')} style={{ alignSelf: 'flex-start' }}>
            EXPLORE GASTRONOMY <FiArrowRight style={{ marginLeft: '0.5rem' }} />
          </button>
        </div>
        <div style={{ flex: '1 1 400px', minHeight: '400px', backgroundImage: 'url("https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '40px 0 0 40px', overflow: 'hidden' }}></div>
      </section>

      {/* Bottom CTA */}
      <section style={{ 
        padding: '10rem 5%', 
        backgroundImage: 'url("https://images.unsplash.com/photo-1549294413-26f195af01c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        textAlign: 'center', 
        position: 'relative',
        borderRadius: '100px',
        margin: '0 3% 5rem',
        overflow: 'hidden'
      }}>
         <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }}></div>
         <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px', margin: '0 auto' }}>
            <FaBed style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '2rem', opacity: 0.6 }} />
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: '#fff', marginBottom: '1.5rem', fontWeight: '300' }}>
              Reserve Your <span style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Sanctuary</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginBottom: '3rem', lineHeight: '1.8', fontFamily: 'var(--font-family-body)' }}>
              Begin your journey with Colonial Grand. Where every stay is a chapter in the story of excellence.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '1.1rem 3rem' }}>BOOK YOUR STAY TODAY</button>
              <button className="btn-secondary" onClick={() => navigate('/rooms')}>EXPLORE THE SUITES</button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#050505', borderTop: '1px solid var(--glass-border)', padding: '6rem 5% 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '6rem' }}>
           <div>
              <h3 style={{ color: 'var(--primary-color)', letterSpacing: '4px', marginBottom: '2rem' }}>COLONIAL GRAND</h3>
              <p style={{ color: '#666', lineHeight: '2', marginBottom: '2rem', fontFamily: 'var(--font-family-body)' }}>Defining the pinnacle of luxury hospitality through centuries of tradition and modern innovation. Your sanctuary in the heart of the city.</p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                 <FiFacebook style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)' }} />
                 <FiTwitter style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)' }} />
                 <FiInstagram style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)' }} />
              </div>
           </div>

           <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '2rem', letterSpacing: '2px', fontFamily: 'var(--font-family-body)' }}>COLLECTION</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#666', fontSize: '0.9rem', fontFamily: 'var(--font-family-body)' }}>
                 <li style={{ cursor: 'pointer' }} onClick={() => navigate('/rooms')}>Classic Suites</li>
                 <li style={{ cursor: 'pointer' }} onClick={() => navigate('/rooms')}>Garden Villas</li>
                 <li style={{ cursor: 'pointer' }} onClick={() => navigate('/rooms')}>Ocean Penthouses</li>
                 <li style={{ cursor: 'pointer' }} onClick={() => navigate('/rooms')}>Presidential Wing</li>
              </ul>
           </div>

           <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '2rem', letterSpacing: '2px', fontFamily: 'var(--font-family-body)' }}>QUICK LINKS</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#666', fontSize: '0.9rem', fontFamily: 'var(--font-family-body)' }}>
                 <li style={{ color: 'var(--primary-color)' }}>Home</li>
                 <li style={{ cursor: 'pointer' }} onClick={() => navigate('/gastronomy')}>Gastronomy</li>
                 <li>Spa & Wellness</li>
                 <li>Events & Weddings</li>
              </ul>
           </div>

           <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '2rem', letterSpacing: '2px', fontFamily: 'var(--font-family-body)' }}>RESERVATIONS</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#666', fontSize: '0.9rem', fontFamily: 'var(--font-family-body)' }}>
                 <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FiMapPin style={{ color: 'var(--primary-color)' }} /> 123 Luxury Ave, MT</li>
                 <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FiPhone style={{ color: 'var(--primary-color)' }} /> +1 800 555 777</li>
                 <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FiMail style={{ color: 'var(--primary-color)' }} /> reserve@colonialgrand.com</li>
              </ul>
           </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#444', fontSize: '0.8rem', flexWrap: 'wrap', gap: '1rem', fontFamily: 'var(--font-family-body)' }}>
           <p>&copy; {new Date().getFullYear()} COLONIAL GRAND HOTEL. ALL RIGHTS RESERVED.</p>
           <div style={{ display: 'flex', gap: '2rem' }}>
              <span>PRIVACY POLICY</span>
              <span>TERMS OF SERVICE</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
