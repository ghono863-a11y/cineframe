import React, { useState, useEffect } from 'react';
import { ChevronRight, Play, Download, LogOut, Menu, X, Eye, Lock, Upload, Plus, Trash2, LogIn } from 'lucide-react';

export default function PhotographyWebsite() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation 
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="pt-20">
        {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} currentUser={currentUser} />}
        {currentPage === 'portfolio' && <PortfolioPage />}
        {currentPage === 'login' && <LoginPage setCurrentUser={setCurrentUser} setCurrentPage={setCurrentPage} />}
        {currentPage === 'register' && <RegisterPage setCurrentUser={setCurrentUser} setCurrentPage={setCurrentPage} />}
        {currentPage === 'client-portal' && currentUser && <ClientPortal currentUser={currentUser} />}
        {currentPage === 'admin' && currentUser?.role === 'admin' && <AdminDashboard currentUser={currentUser} />}
      </div>
    </div>
  );
}

// Navigation Component
function Navigation({ currentUser, setCurrentUser, currentPage, setCurrentPage, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            onClick={() => {
              setCurrentPage('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition">
              <Play size={20} className="fill-white" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tighter">CINEFRAME</div>
              <div className="text-xs text-cyan-400 font-semibold">FILMS & MOMENTS</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink label="Portfolio" page="portfolio" currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {currentUser ? (
              <>
                <NavLink 
                  label={currentUser.role === 'admin' ? 'Dashboard' : 'My Files'} 
                  page={currentUser.role === 'admin' ? 'admin' : 'client-portal'} 
                  currentPage={currentPage} 
                  setCurrentPage={setCurrentPage} 
                />
                <button 
                  onClick={() => {
                    setCurrentUser(null);
                    setCurrentPage('home');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg transition text-sm font-semibold"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink label="Login" page="login" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                <button 
                  onClick={() => setCurrentPage('register')}
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition text-sm"
                >
                  Client Access
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-800/50 pt-4">
            <MobileNavLink label="Portfolio" page="portfolio" currentPage={currentPage} setCurrentPage={setCurrentPage} setMobileMenuOpen={setMobileMenuOpen} />
            {currentUser ? (
              <>
                <MobileNavLink 
                  label={currentUser.role === 'admin' ? 'Dashboard' : 'My Files'} 
                  page={currentUser.role === 'admin' ? 'admin' : 'client-portal'} 
                  currentPage={currentPage} 
                  setCurrentPage={setCurrentPage}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
                <button 
                  onClick={() => {
                    setCurrentUser(null);
                    setCurrentPage('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-600/10 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink label="Login" page="login" currentPage={currentPage} setCurrentPage={setCurrentPage} setMobileMenuOpen={setMobileMenuOpen} />
                <button 
                  onClick={() => {
                    setCurrentPage('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg"
                >
                  Client Access
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ label, page, currentPage, setCurrentPage }) {
  const isActive = currentPage === page;
  return (
    <button 
      onClick={() => setCurrentPage(page)}
      className={`uppercase text-xs font-bold tracking-widest transition ${
        isActive 
          ? 'text-cyan-400' 
          : 'text-gray-300 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function MobileNavLink({ label, page, currentPage, setCurrentPage, setMobileMenuOpen }) {
  const isActive = currentPage === page;
  return (
    <button 
      onClick={() => {
        setCurrentPage(page);
        setMobileMenuOpen(false);
      }}
      className={`w-full text-left px-4 py-2 rounded transition ${
        isActive 
          ? 'bg-cyan-500/20 text-cyan-400' 
          : 'text-gray-300 hover:bg-gray-800/50'
      }`}
    >
      {label}
    </button>
  );
}

// Home Page
function HomePage({ setCurrentPage, currentUser }) {
  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll('.fade-in').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          el.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="min-h-[90vh] relative flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="block mb-2">Cinematic</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Visual Storytelling
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Weddings, Events & Cinematic Films. We capture moments that move hearts and tell stories that inspire.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('portfolio')}
              className="group px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-lg rounded-lg transition flex items-center justify-center gap-2"
            >
              View Work <ChevronRight className="group-hover:translate-x-1 transition" />
            </button>
            {!currentUser && (
              <button 
                onClick={() => setCurrentPage('login')}
                className="px-8 py-4 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-bold text-lg rounded-lg transition"
              >
                Client Login
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="🎬" 
            title="Cinematography" 
            description="Cinematic wedding films & event videos with professional color grading"
          />
          <FeatureCard 
            icon="📸" 
            title="Photography" 
            description="Stunning wedding & event photography capturing every precious moment"
          />
          <FeatureCard 
            icon="🔐" 
            title="Secure Portal" 
            description="Access your photos & videos securely. Download in high quality anytime"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-cyan-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to See Your Moments?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Browse our complete portfolio or log in to access your files
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('portfolio')}
              className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Explore Portfolio
            </button>
            {!currentUser && (
              <button 
                onClick={() => setCurrentPage('register')}
                className="px-8 py-4 border border-white text-white hover:bg-white/10 font-bold rounded-lg transition"
              >
                Get Client Access
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-cyan-500/50 transition group">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

// Portfolio Page
function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('videos');
  const [selectedItem, setSelectedItem] = useState(null);

  const videos = [
    { id: 1, title: 'Wedding Highlight - Raj & Priya', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop', duration: '5:42' },
    { id: 2, title: 'Corporate Event Film', thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop', duration: '3:20' },
    { id: 3, title: 'Cinematic Reel 2024', thumbnail: 'https://images.unsplash.com/photo-1533000971552-74f440642117?w=400&h=300&fit=crop', duration: '2:15' },
    { id: 4, title: 'Event Coverage - Tech Summit', thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', duration: '4:30' },
  ];

  const photos = [
    { id: 1, title: 'Wedding Day - Ceremony', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop' },
    { id: 2, title: 'Reception Moments', src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop' },
    { id: 3, title: 'Event Photography', src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=500&fit=crop' },
    { id: 4, title: 'Detail Shots', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop' },
    { id: 5, title: 'Bride Portrait', src: 'https://images.unsplash.com/photo-1494976866925-5b100481aa4b?w=400&h=500&fit=crop' },
    { id: 6, title: 'Group Photos', src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=500&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black mb-12 text-center">Our Portfolio</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 justify-center mb-12 flex-wrap">
          <button 
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === 'videos' 
                ? 'bg-cyan-500 text-black' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            🎬 Videos
          </button>
          <button 
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === 'photos' 
                ? 'bg-cyan-500 text-black' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            📸 Photos
          </button>
        </div>

        {/* Videos Grid */}
        {activeTab === 'videos' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
              <div 
                key={video.id}
                onClick={() => setSelectedItem(video)}
                className="group cursor-pointer relative overflow-hidden rounded-lg"
              >
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                  <Play size={48} className="text-cyan-400 group-hover:scale-125 transition" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-white mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-300">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photos Grid */}
        {activeTab === 'photos' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map(photo => (
              <div 
                key={photo.id}
                onClick={() => setSelectedItem(photo)}
                className="group cursor-pointer relative overflow-hidden rounded-lg aspect-[3/4]"
              >
                <img 
                  src={photo.src} 
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                  <Eye size={40} className="text-cyan-400 group-hover:scale-125 transition" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-white text-sm">{photo.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div 
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        >
          <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
            {selectedItem.thumbnail ? (
              <img src={selectedItem.thumbnail} alt={selectedItem.title} className="w-full rounded-lg" />
            ) : (
              <img src={selectedItem.src} alt={selectedItem.title} className="w-full rounded-lg" />
            )}
            <p className="text-center text-white text-lg font-bold mt-4">{selectedItem.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Login Page
function LoginPage({ setCurrentUser, setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      setCurrentUser({
        id: 1,
        name: email.split('@')[0],
        email: email,
        role: 'client'
      });
      setCurrentPage('client-portal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6">Client Login</h2>
        <div className="space-y-4">
          <input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 outline-none transition"
          />
          <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 outline-none transition"
          />
          <button 
            onClick={handleLogin}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg transition"
          >
            Login
          </button>
        </div>
        <p className="text-center text-gray-400 mt-6">
          Don't have access? <button onClick={() => setCurrentPage('register')} className="text-cyan-400 hover:underline">Get access here</button>
        </p>
      </div>
    </div>
  );
}

// Register Page
function RegisterPage({ setCurrentUser, setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = () => {
    if (email && password && name) {
      setCurrentUser({
        id: 1,
        name: name,
        email: email,
        role: 'client'
      });
      setCurrentPage('client-portal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6">Get Client Access</h2>
        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 outline-none transition"
          />
          <input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 outline-none transition"
          />
          <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 outline-none transition"
          />
          <button 
            onClick={handleRegister}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg transition"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

// Client Portal
function ClientPortal({ currentUser }) {
  const [files, setFiles] = useState([
    { id: 1, name: 'Wedding_Photos.zip', type: 'photos', size: '2.4 GB', date: '2024-01-15', event: 'Raj & Priya Wedding' },
    { id: 2, name: 'Wedding_Film_4K.mp4', type: 'video', size: '4.8 GB', date: '2024-01-15', event: 'Raj & Priya Wedding' },
    { id: 3, name: 'Event_Highlights.zip', type: 'photos', size: '1.2 GB', date: '2024-02-20', event: 'Corporate Gala' },
  ]);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Welcome, {currentUser.name}!</h1>
        <p className="text-gray-400 mb-8">Download your photos and videos here</p>

        <div className="grid gap-6">
          {files.map(file => (
            <div 
              key={file.id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-cyan-500/50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{file.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{file.event}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{file.size}</span>
                    <span>{file.date}</span>
                    <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                      {file.type === 'video' ? '🎬 Video' : '📸 Photos'}
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition w-full md:w-auto justify-center">
                  <Download size={20} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard({ currentUser }) {
  const [galleries, setGalleries] = useState([
    { id: 1, name: 'Raj & Priya Wedding', type: 'mixed', items: 450, date: '2024-01-15' },
    { id: 2, name: 'Corporate Gala 2024', type: 'mixed', items: 320, date: '2024-02-20' },
  ]);
  const [newGallery, setNewGallery] = useState('');

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Create Gallery */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Create New Gallery</h2>
          <div className="flex gap-4 flex-col md:flex-row">
            <input 
              type="text"
              placeholder="Gallery name (e.g., Wedding - John & Jane)"
              value={newGallery}
              onChange={e => setNewGallery(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 outline-none"
            />
            <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition">
              <Plus size={20} /> Create
            </button>
          </div>
        </div>

        {/* Galleries List */}
        <h2 className="text-2xl font-bold mb-4">Your Galleries</h2>
        <div className="space-y-4">
          {galleries.map(gallery => (
            <div key={gallery.id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-cyan-500/50 transition">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{gallery.name}</h3>
                  <p className="text-gray-400 text-sm">{gallery.items} files • {gallery.date}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">Edit</button>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}