import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

// Page stubs for navigation
function Home() {
  // PUBLIC_INTERFACE
  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-primary mb-4">Home</h1>
      <p className="text-secondary">Welcome to HairFit Pro!</p>
    </div>
  );
}
function Profile() {
  // PUBLIC_INTERFACE
  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-primary mb-4">Profile</h1>
      <p className="text-secondary">Manage your personal information.</p>
    </div>
  );
}
function RoutinePlanner() {
  // PUBLIC_INTERFACE
  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-primary mb-4">Routine Planner</h1>
      <p className="text-secondary">Plan your daily hair routines here.</p>
    </div>
  );
}
function Products() {
  // PUBLIC_INTERFACE
  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-primary mb-4">Products</h1>
      <p className="text-secondary">Explore recommended hair products.</p>
    </div>
  );
}
function Blog() {
  // PUBLIC_INTERFACE
  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-primary mb-4">Blog</h1>
      <p className="text-secondary">Read latest articles and tips.</p>
    </div>
  );
}
function Community() {
  // PUBLIC_INTERFACE
  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-primary mb-4">Community</h1>
      <p className="text-secondary">Connect and share with others.</p>
    </div>
  );
}
function Journal() {
  // PUBLIC_INTERFACE
  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-primary mb-4">Journal</h1>
      <p className="text-secondary">Track your hair journey.</p>
    </div>
  );
}
function Contact() {
  // PUBLIC_INTERFACE
  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-primary mb-4">Contact</h1>
      <p className="text-secondary">Get in touch with us.</p>
    </div>
  );
}

// Navigation link config
const navLinks = [
  { name: "Home", to: "/" },
  { name: "Profile", to: "/profile" },
  { name: "Routine Planner", to: "/routine-planner" },
  { name: "Products", to: "/products" },
  { name: "Blog", to: "/blog" },
  { name: "Community", to: "/community" },
  { name: "Journal", to: "/journal" },
  { name: "Contact", to: "/contact" },
];

// Tailwind-based main App
function App() {
  // mobile menu state
  const [navOpen, setNavOpen] = useState(false);

  // Utility for responsive nav link handles
  const linkClasses =
    "transition-all duration-300 ease-in-out px-4 py-2 rounded-2xl text-base font-medium text-textMain hover:bg-accent/20 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary";

  const activeLink =
    "bg-primary text-white shadow-md";

  return (
    <Router>
      {/* Custom palette via Tailwind config or inline styles */}
      <div
        className="min-h-screen bg-background text-textMain"
        style={{
          "--primary": "#7F56D9",
          "--background": "#F9FAFB",
          "--textMain": "#111827",
          "--textSecondary": "#6B7280",
          "--accent": "#D0BCFF"
        }}
      >
        {/* NAVIGATION */}
        <nav className="fixed top-0 left-0 w-full z-20 bg-white shadow-md rounded-b-2xl bg-background">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-extrabold text-primary select-none tracking-tight">
                  HairFit <span className="text-accent">Pro</span>
                </span>
              </div>
              {/* Desktop Nav Links */}
              <div className="hidden md:flex space-x-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      [
                        linkClasses,
                        isActive ? activeLink : "text-textMain"
                      ].join(" ")
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
              {/* Hamburger menu button (mobile only) */}
              <div className="flex md:hidden">
                <button
                  type="button"
                  onClick={() => setNavOpen(!navOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-2xl text-primary hover:text-white hover:bg-primary transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  aria-controls="mobile-menu"
                  aria-expanded={navOpen}
                  aria-label="Open main menu"
                >
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {navOpen ? (
                      // X Icon
                      <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      // Hamburger
                      <path d="M4 8h16M4 16h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Mobile nav */}
          {navOpen && (
            <div className="md:hidden px-2 pb-3 pt-2 space-y-1 bg-background shadow rounded-b-2xl transition-all duration-300 ease-in-out" id="mobile-menu">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) =>
                    [
                      "block w-full text-left",
                      linkClasses,
                      isActive ? activeLink : "text-textMain"
                    ].join(" ")
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
        {/* Main layout container, add spacing for fixed nav */}
        <div className="pt-24 pb-8 px-4 max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-md px-6 py-8 min-h-[60vh] transition-all duration-300 ease-in-out">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/routine-planner" element={<RoutinePlanner />} />
              <Route path="/products" element={<Products />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/community" element={<Community />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </div>
        {/* Footer, optional */}
        <footer className="text-center text-secondary text-xs py-4">
          &copy; {new Date().getFullYear()} HairFit Pro. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
