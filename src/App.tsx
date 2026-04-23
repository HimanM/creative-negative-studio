import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import gsap from 'gsap';

import Home from './components/Home';
import Work from './components/Work';
import Studio from './components/Studio';
import News from './components/News';
import Contact from './components/Contact';

type PageKey = 'home' | 'work' | 'studio' | 'news' | 'contact';

const pages: { key: PageKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'work', label: 'Work' },
  { key: 'studio', label: 'Studio' },
  { key: 'news', label: 'News' },
  { key: 'contact', label: 'Contact' },
];

const pagesArray = pages.map(p => p.key);

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>(() => {
    const hash = window.location.hash.replace('#', '');
    return pages.some(p => p.key === hash) ? (hash as PageKey) : 'home';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorScale, setCursorScale] = useState(1);

  const navIndicatorRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const navigate = useCallback((page: PageKey) => {
    setCurrentPage(page);
    window.location.hash = page;
    setIsMenuOpen(false);
  }, []);

  // Sync with Hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (pagesArray.includes(hash as PageKey)) {
        setCurrentPage(hash as PageKey);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pagesArray]);

  // Wheel and Touch navigation
  useEffect(() => {
    let lastScrollTime = 0;
    let touchStartY = 0;

    const handleNavigate = (direction: 1 | -1) => {
      const now = Date.now();
      if (now - lastScrollTime < 1000) return;
      const currentIndex = pagesArray.indexOf(currentPage);
      if (direction === 1 && currentIndex < pagesArray.length - 1) {
        navigate(pagesArray[currentIndex + 1]);
        lastScrollTime = now;
      } else if (direction === -1 && currentIndex > 0) {
        navigate(pagesArray[currentIndex - 1]);
        lastScrollTime = now;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) {
        handleNavigate(e.deltaY > 0 ? 1 : -1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      if (Math.abs(deltaY) > 50) {
        handleNavigate(deltaY > 0 ? 1 : -1);
      }
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPage, navigate, pagesArray]);

  // Global mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cursor hover detection for interactive elements
  useEffect(() => {
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[data-clickable]') ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON'
      ) {
        setCursorScale(2.5);
      } else {
        setCursorScale(1);
      }
    };
    window.addEventListener('mouseover', handleOver);
    return () => window.removeEventListener('mouseover', handleOver);
  }, []);

  // Animate nav indicator
  useEffect(() => {
    const activeIdx = pages.findIndex(p => p.key === currentPage);
    const activeLink = navLinksRef.current[activeIdx];
    const indicator = navIndicatorRef.current;
    if (activeLink && indicator) {
      const rect = activeLink.getBoundingClientRect();
      const parentRect = activeLink.parentElement?.getBoundingClientRect();
      if (parentRect) {
        gsap.to(indicator, {
          x: rect.left - parentRect.left,
          width: rect.width,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    }
  }, [currentPage]);

  const currentActiveIndex = pages.findIndex(p => p.key === currentPage);

  // Render the current page component
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home isActive={true} />;
      case 'work': return <Work isActive={true} />;
      case 'studio': return <Studio isActive={true} />;
      case 'news': return <News isActive={true} />;
      case 'contact': return <Contact isActive={true} />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black cursor-none">
      
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/13190440_3840_2160_24fps.mp4"
      />

      {/* ═══════════════ PERSISTENT GRID OVERLAY (z-[5]) ═══════════════ */}
      <div className="absolute inset-0 z-[5] flex w-full pointer-events-none opacity-[0.10]">
        <div className="w-[25%] h-full border-r border-white/50"></div>
        <div className="w-[25%] h-full border-r border-white/50"></div>
        <div className="w-[25%] h-full border-r border-white/50"></div>
        <div className="w-[25%] h-full"></div>
      </div>

      {/* ═══════════════ PAGE CONTENT ═══════════════ */}
      <div className="absolute inset-0">
        {renderPage()}
      </div>

      {/* ═══════════════ PERSISTENT HEADER (z-[40]) ═══════════════ */}
      <header className="absolute top-6 left-6 right-6 md:top-10 md:left-10 md:right-12 flex justify-between items-start z-[40] pointer-events-auto">
        {/* Logo */}
        <button
          onClick={() => navigate('home')}
          className="text-[2rem] md:text-[3.5rem] leading-none font-medium tracking-tighter flex items-center gap-1 text-white hover:opacity-80 transition-opacity"
        >
          <span>(BO<sup className="text-sm md:text-xl font-normal tracking-normal -ml-1">®</sup></span>
          <span className="font-light mx-1 md:mx-2 text-[1.5rem] md:text-[2.5rem] tracking-tight opacity-80">&mdash;</span>
          <span>01)</span>
        </button>

        {/* Desktop Nav */}
        <nav className="flex items-center gap-4 md:gap-8 text-[9px] md:text-[11px] font-semibold tracking-widest uppercase mt-2 md:mt-4">
          <div className="hidden md:flex gap-8 relative">
            {/* Active indicator line */}
            <div
              ref={navIndicatorRef}
              className="absolute -bottom-1 h-[1px] bg-[#f46830]"
              style={{ width: 0 }}
            />
            {pages.map((page, i) => (
              <a
                key={page.key}
                ref={el => navLinksRef.current[i] = el}
                href="#"
                onClick={(e) => { e.preventDefault(); navigate(page.key); }}
                className={`transition-opacity duration-300 ${
                  currentPage === page.key ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
              >
                {page.label}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden hover:opacity-70 transition-opacity flex items-center justify-center p-1"
          >
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <button className="relative ml-2 md:ml-0">
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute -top-2 -right-2 bg-[#f46830] text-white text-[8px] md:text-[9px] w-3 h-3 md:w-4 md:h-4 flex items-center justify-center rounded-full font-bold">2</span>
          </button>
        </nav>
      </header>

      {/* ═══════════════ PERSISTENT PAGE INDICATOR (z-[40]) ═══════════════ */}
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-12 z-[40] flex items-center gap-3 pointer-events-none">
        <span className="text-[9px] font-light tracking-widest uppercase text-white/30">
          {String(currentActiveIndex + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
        </span>
        <div className="flex gap-1">
          {pages.map((page, i) => (
            <div
              key={page.key}
              className={`h-[2px] transition-all duration-500 ${
                i === currentActiveIndex ? 'w-6 bg-[#f46830]' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════ MOBILE NAV OVERLAY (z-[50]) ═══════════════ */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-[50] bg-black/70 flex flex-col items-center justify-center text-white"
        >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-2 hover:opacity-70 transition-opacity"
            >
              <X className="w-8 h-8" strokeWidth={1.5} />
            </button>
            <nav className="flex flex-col items-center gap-6">
              {pages.map((page, i) => (
                <a
                  key={page.key}
                  href="#"
                  onClick={(e) => { e.preventDefault(); navigate(page.key); }}
                  className={`text-2xl font-display uppercase tracking-widest transition-colors duration-300 ${
                    currentPage === page.key ? 'text-[#f46830]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="text-[9px] font-sans font-light tracking-widest text-white/20 mr-3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {page.label}
                </a>
              ))}
            </nav>
        </motion.div>
      )}

      {/* ═══════════════ CUSTOM CURSOR (z-[60]) ═══════════════ */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-white mix-blend-difference pointer-events-none z-[60] flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          width: 32 * cursorScale,
          height: 32 * cursorScale,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.1 }}
      >
        <motion.div
          className="bg-white rounded-full"
          animate={{
            width: cursorScale > 1 ? 0 : 6,
            height: cursorScale > 1 ? 0 : 6,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

    </div>
  );
}
