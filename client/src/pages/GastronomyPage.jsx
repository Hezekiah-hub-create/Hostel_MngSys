import { useNavigate } from 'react-router-dom';
import { FiStar, FiSunset, FiMapPin, FiPhone, FiMail, FiInstagram, FiTwitter, FiFacebook, FiArrowRight } from 'react-icons/fi';
import { FaWineGlass, FaLeaf, FaFire, FaConciergeBell } from 'react-icons/fa';

const GastronomyPage = () => {
  const navigate = useNavigate();

  const menuHighlights = [
    {
      category: 'SIGNATURE STARTERS',
      items: [
        { name: 'Foie Gras Torchon', desc: 'House-cured, fig mostarda, brioche', price: 'GH₵ 120' },
        { name: 'Oysters Rockefeller', desc: 'Spinach, pernod cream, crispy shallots', price: 'GH₵ 95' },
        { name: 'Burrata Suprema', desc: 'Heritage tomatoes, aged balsamic, basil oil', price: 'GH₵ 85' },
      ]
    },
    {
      category: 'MAIN COURSES',
      items: [
        { name: 'Wagyu Tenderloin A5', desc: 'Truffle jus, pomme purée, seasonal jus', price: 'GH₵ 450' },
        { name: 'Atlantic Lobster', desc: 'Saffron bisque, tarragon butter, caviar', price: 'GH₵ 380' },
        { name: 'Rack of Lamb', desc: 'Herb crust, minted pea purée, rosemary reduction', price: 'GH₵ 290' },
      ]
    },
    {
      category: 'DESSERTS',
      items: [
        { name: 'Valrhona Chocolate', desc: 'Fondant, gold leaf, salted caramel', price: 'GH₵ 95' },
        { name: 'Crème Brûlée', desc: 'Madagascar vanilla, fresh raspberries', price: 'GH₵ 80' },
        { name: 'Soufflé du Jour', desc: 'Ask your server for today\'s creation', price: 'GH₵ 110' },
      ]
    }
  ];

  const experiences = [
    {
      icon: <FaWineGlass />,
      title: 'The Wine Cellar',
      desc: 'Descend into our private cellar housing over 5,000 rare vintages from Bordeaux, Burgundy, Tuscany, and Napa Valley.',
      img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      icon: <FaFire />,
      title: "Chef's Table",
      desc: 'An exclusive eight-seat experience in the heart of our open kitchen. A bespoke twelve-course tasting menu.',
      img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      icon: <FaLeaf />,
      title: 'Farm to Plate',
      desc: 'We partner with local heritage farms. Every ingredient tells a story of terroir, season, and artisanal craft.',
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      icon: <FiSunset />,
      title: 'Rooftop Terrace',
      desc: 'Dine among the stars with sweeping 360-degree views of the skyline. Available every evening from 7pm.',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', overflowX: 'hidden' }}>

      {/* Cinematic Hero */}
      <section style={{
        height: '100vh',
        backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
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
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 50%, var(--bg-color) 100%)', zIndex: 0 }}></div>
        
        <div style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
          <h4 style={{ color: 'var(--primary-color)', letterSpacing: '8px', marginBottom: '2rem', fontWeight: '400', fontSize: '0.85rem', fontFamily: 'var(--font-family-body)' }}>
            COLONIAL GRAND × THE GRAND RESTAURANT
          </h4>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: '#fff', lineHeight: '1.1', marginBottom: '2rem' }}>
            A Theater of<br />
            <span style={{ fontStyle: 'italic', color: 'var(--primary-color)', fontWeight: '400' }}>Culinary Excellence</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.75)', maxWidth: '600px', margin: '0 auto 3rem', fontWeight: '300', lineHeight: '1.9', fontFamily: 'var(--font-family-body)' }}>
            Helmed by three Michelin-starred Executive Chef Antoine Moreau, The Grand is a sensory journey where each dish is a masterwork.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/dining-reservation')}>
              RESERVE A TABLE
            </button>
            <button className="btn-secondary" onClick={() => navigate('/rooms')}>
              VIEW ROOMS
            </button>
          </div>
        </div>
      </section>

      {/* The Grand Restaurant - Split Section */}
      <section style={{ display: 'flex', alignItems: 'stretch', minHeight: '650px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', minHeight: '400px', backgroundImage: 'url("https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', borderRadius: '0 40px 40px 0', overflow: 'hidden' }}>
        </div>
        <div style={{ flex: '1 1 400px', padding: '5rem 5%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ color: 'var(--primary-color)', letterSpacing: '5px', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-family-body)' }}>
            THE FLAGSHIP
          </h4>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            The Grand<br />
            <span style={{ fontStyle: 'italic', fontWeight: '400' }}>Restaurant</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', fontSize: '1.05rem', marginBottom: '2rem', fontFamily: 'var(--font-family-body)' }}>
            The space—draped in warm amber light, dark mahogany, and handcrafted crystal—is an architectural statement. Open for breakfast, lunch, and a five-course dinner experience.
          </p>
          
          {/* Quote */}
          <div style={{ borderLeft: '3px solid var(--primary-color)', paddingLeft: '1.5rem', marginBottom: '2.5rem', background: 'rgba(212,175,55,0.03)', padding: '1.5rem', borderRadius: '0 16px 16px 0' }}>
            <p style={{ color: '#fff', fontStyle: 'italic', fontSize: '1.05rem', fontFamily: 'var(--font-family-title)' }}>"Dining at The Grand is not a meal — it is a memory in the making."</p>
            <p style={{ color: 'var(--primary-color)', fontSize: '0.7rem', marginTop: '0.8rem', letterSpacing: '2px', fontFamily: 'var(--font-family-body)' }}>— GOURMET AFRICA MAGAZINE</p>
          </div>

          {/* Hours */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Breakfast', time: '7:00 – 11:00' },
              { label: 'Lunch', time: '12:00 – 15:00' },
              { label: 'Dinner', time: '19:00 – 23:00' }
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', padding: '0.8rem 1.5rem', borderRadius: '16px' }}>
                <div style={{ color: 'var(--primary-color)', fontSize: '0.65rem', letterSpacing: '2px', fontFamily: 'var(--font-family-body)', fontWeight: '700' }}>{s.label.toUpperCase()}</div>
                <div style={{ color: '#fff', fontWeight: '600', fontFamily: 'var(--font-family-body)', marginTop: '0.2rem' }}>{s.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Experiences - Card Grid with Images */}
      <section style={{ padding: '8rem 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h4 style={{ color: 'var(--primary-color)', letterSpacing: '6px', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-family-body)' }}>UNIQUE OFFERINGS</h4>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#fff', fontWeight: '400' }}>
            Curated <span style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Experiences</span>
          </h2>
        </div>

        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {experiences.map((exp, i) => (
            <div key={i} style={{ 
              borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.08)',
              background: 'var(--surface-color)', transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)', cursor: 'default'
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img src={exp.img} alt={exp.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)' }}></div>
                <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', fontSize: '1.8rem', color: 'var(--primary-color)' }}>{exp.icon}</div>
              </div>
              <div style={{ padding: '2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.8rem', fontWeight: '500' }}>{exp.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', fontFamily: 'var(--font-family-body)' }}>{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seasonal Menu Showcase */}
      <section style={{ padding: '8rem 5%', background: 'var(--surface-color)', borderRadius: '40px', margin: '0 3%' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h4 style={{ color: 'var(--primary-color)', letterSpacing: '6px', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-family-body)' }}>SEASONAL MENU</h4>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#fff', fontWeight: '400' }}>
            Culinary <span style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Masterworks</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '550px', margin: '1.5rem auto 0', lineHeight: '1.8', fontFamily: 'var(--font-family-body)' }}>
            Our menu changes with the seasons to honor the finest ingredients at their peak.
          </p>
        </div>

        <div className="grid-3" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {menuHighlights.map((section, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(212,175,55,0.08)' }}>
              <h4 style={{ color: 'var(--primary-color)', letterSpacing: '4px', fontSize: '0.7rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(212,175,55,0.15)', fontFamily: 'var(--font-family-body)' }}>
                {section.category}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {section.items.map((item, j) => (
                  <div key={j}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#fff', fontWeight: '500', fontFamily: 'var(--font-family-title)', fontSize: '1.05rem' }}>{item.name}</span>
                      <span style={{ color: 'var(--primary-color)', fontWeight: '700', whiteSpace: 'nowrap', fontSize: '0.9rem', fontFamily: 'var(--font-family-body)' }}>{item.price}</span>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.85rem', fontFamily: 'var(--font-family-body)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Wine Cellar Feature */}
      <section style={{ display: 'flex', alignItems: 'stretch', minHeight: '550px', margin: '8rem 0', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', padding: '5rem 5%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ color: 'var(--primary-color)', letterSpacing: '5px', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-family-body)' }}>
            SINCE 1998
          </h4>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            The Private<br />
            <span style={{ fontStyle: 'italic', fontWeight: '400' }}>Wine Cellar</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', fontSize: '1rem', marginBottom: '2.5rem', fontFamily: 'var(--font-family-body)' }}>
            Built into the foundations of the original 1898 building, our cellar holds over 5,000 bottles spanning six continents. Our Master Sommelier personally guides guests through private tastings.
          </p>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[{ n: '5,000+', l: 'Bottles' }, { n: '120+', l: 'Vineyards' }, { n: '70yrs', l: 'Oldest Vintage' }].map(s => (
              <div key={s.l}>
                <div style={{ color: 'var(--primary-color)', fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-family-title)' }}>{s.n}</div>
                <div style={{ color: '#666', fontSize: '0.75rem', letterSpacing: '1px', fontFamily: 'var(--font-family-body)', marginTop: '0.3rem' }}>{s.l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: '1 1 400px', minHeight: '400px', backgroundImage: 'url("https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '40px 0 0 40px', overflow: 'hidden' }}></div>
      </section>

      {/* Reservation CTA */}
      <section style={{
        padding: '10rem 5%',
        backgroundImage: 'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
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
          <FaConciergeBell style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '2rem', opacity: 0.6 }} />
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: '#fff', marginBottom: '1.5rem', fontWeight: '300' }}>
            Craft Your <span style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Perfect Evening</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginBottom: '3rem', lineHeight: '1.8', fontFamily: 'var(--font-family-body)' }}>
            Reservations are recommended for all dining experiences. Chef's Table bookings require 72 hours advance notice.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/dining-reservation')} style={{ padding: '1.1rem 3rem' }}>
              RESERVE NOW
            </button>
            <button className="btn-secondary" onClick={() => navigate('/')}>
              BACK TO HOME
            </button>
          </div>
        </div>
      </section>

      {/* Footer - unified */}
      <footer style={{ background: '#050505', borderTop: '1px solid var(--glass-border)', padding: '6rem 5% 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '6rem' }}>
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
                 <li style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</li>
                 <li style={{ color: 'var(--primary-color)' }}>Dining</li>
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

export default GastronomyPage;
