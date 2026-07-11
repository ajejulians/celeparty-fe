"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";

  // Effect to handle navbar styling on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change and lock body scroll when open
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Produk", path: "/products" },
    { name: "Vendor", path: "/vendor" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-[60] transition-all duration-300 border-b ${
          scrolled 
            ? "bg-c-blue/90 backdrop-blur-lg border-white/10 shadow-xl py-2" 
            : "bg-c-blue border-transparent py-3 md:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-4 md:gap-8">
            
            {/* Logo */}
            <Link 
              href="/"
              className="flex items-center gap-2.5 font-quick font-bold text-2xl text-white tracking-wide shrink-0 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-c-green to-[#A3A702] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-c-blue" />
              </div>
              CELEPARTY
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8 shrink-0">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="relative font-quick font-semibold text-sm text-white/80 hover:text-white py-2 group transition-colors"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-c-green transition-all duration-300 group-hover:w-full rounded-full opacity-0 group-hover:opacity-100"></span>
                </Link>
              ))}
            </nav>

            {/* Search and CTA Container */}
            <div className="hidden md:flex flex-1 justify-end items-center gap-6">
              {!isLanding && (
                <div className="relative w-full max-w-sm group">
                  <input
                    type="text"
                    placeholder="Cari event, vendor..."
                    className="w-full pl-11 pr-4 py-2.5 text-sm font-sans rounded-full bg-white/10 text-white placeholder:text-white/60 border border-white/10 focus:outline-none focus:border-c-green/50 focus:bg-white/15 focus:ring-4 focus:ring-c-green/20 transition-all duration-300"
                  />
                  <span className="absolute left-4 top-2.5 text-white/50 group-focus-within:text-c-green transition-colors">
                    <Search size={18} />
                  </span>
                </div>
              )}
              
              <Link
                href="/auth/login"
                className="font-quick font-semibold text-sm bg-c-green text-neutral-900 px-7 py-2.5 rounded-full inline-flex items-center gap-2 hover:bg-[#e4e91f] hover:shadow-[0_0_24px_rgba(203,208,2,0.5)] active:scale-95 transition-all duration-300 shrink-0"
              >
                Mulai Sekarang
                <ChevronRight size={16} className="text-neutral-900" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-white/10 active:scale-95 transition-all z-[70]"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[50] bg-c-blue/98 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col pt-[88px] ${
          mobileOpen 
            ? "opacity-100 pointer-events-auto translate-x-0" 
            : "opacity-0 pointer-events-none translate-x-12"
        }`}
      >
        <div className="flex flex-col p-6 gap-8 h-full overflow-y-auto">
          {!isLanding && (
            <div className="relative w-full shadow-lg">
              <input
                type="text"
                placeholder="Cari event, vendor..."
                className="w-full pl-12 pr-4 py-4 text-base font-sans rounded-2xl bg-white/10 text-white placeholder:text-white/50 border border-white/10 focus:outline-none focus:border-c-green focus:bg-white/15 transition-all"
              />
              <span className="absolute left-4 top-4 text-white/50">
                <Search size={22} />
              </span>
            </div>
          )}

          <nav className="flex flex-col gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.path}
                className="font-quick font-bold text-3xl text-white/90 hover:text-c-green hover:translate-x-4 transition-all duration-300 flex items-center justify-between py-4 border-b border-white/5"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {link.name}
                <ChevronRight size={28} className="opacity-30" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8 pb-12">
            <Link
              href="/auth/login"
              className="w-full font-quick font-bold text-lg bg-c-green text-neutral-900 px-6 py-5 rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(203,208,2,0.3)]"
            >
              Mulai Sekarang <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
