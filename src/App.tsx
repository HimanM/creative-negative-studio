import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import gsap from 'gsap';

const scrambleChars = "XO>_-\\/[]{}—=+*^?#0123456789";
const finalScrambleText = "MEET SPEED";

const descriptionLines = [
  "FOR DRIVERS SEEKING",
  "EXCELLENCE, SHEER",
  "PERFORMANCE MEETS",
  "ICONIC DESIGN AND",
  "UNSTOPPABLE ENERGY."
];

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrambledText, setScrambledText] = useState("MEETSPCed ");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const engineLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const descWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleLabelRef = useRef<HTMLParagraphElement>(null);
  const meetSpeedRef = useRef<HTMLDivElement>(null);

  // Reset dynamically populated refs on each render to prevent infinite append on state updates
  descWordsRef.current = [];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // GSAP Master Timeline
    const tl = gsap.timeline();

    // Initial resets
    gsap.set(engineLettersRef.current, { opacity: 0, y: 50 });
    gsap.set(descWordsRef.current, { opacity: 0 });
    gsap.set(meetSpeedRef.current, { opacity: 0 });
    gsap.set(subtitleLabelRef.current, { opacity: 0 });

    // Animation 1: ENGINE pop up letter by letter (Total ~1s)
    tl.to(engineLettersRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: "back.out(2)",
    }, 0.2);

    // Subtitle Scramble & Fade
    const scrambleObj = { progress: 0 };
    tl.to(meetSpeedRef.current, {
      opacity: 1,
      duration: 0.1,
    }, 1.0)
    .to(scrambleObj, {
      progress: 1,
      duration: 0.8,
      ease: "none",
      onUpdate: () => {
        const p = scrambleObj.progress;
        const length = finalScrambleText.length;
        let currentString = "";
        for (let i = 0; i < length; i++) {
          if (p >= (i / length)) {
             currentString += finalScrambleText[i];
          } else {
             if (finalScrambleText[i] === " ") {
               currentString += " ";
             } else {
               currentString += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
             }
          }
        }
        setScrambledText(currentString);
      }
    }, 1.0)
    .to(subtitleLabelRef.current, {
      opacity: 0.7,
      duration: 0.5,
      ease: "power2.out"
    }, 1.3);

    // Animation 2: Description word by word
    tl.to(descWordsRef.current, {
      opacity: 1,
      duration: 0.1,
      stagger: 0.08,
    }, 1.0);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black cursor-none">
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/src/public/13190440_3840_2160_24fps.mp4"
      />

      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 z-10 flex w-full pointer-events-none opacity-[0.10]">
        <div className="w-[25%] h-full border-r border-white/50"></div>
        <div className="w-[25%] h-full border-r border-white/50"></div>
        <div className="w-[25%] h-full border-r border-white/50"></div>
        <div className="w-[25%] h-full"></div>
      </div>

      {/* Layer 1: GSAP Engine Title (Negative Effect - Mix Blend Difference) */}
      <div className="absolute inset-0 z-20 pointer-events-none mix-blend-difference text-white">
        <div className="absolute top-[38%] md:top-1/2 -translate-y-1/2 right-[2%] md:right-[5%] font-black uppercase text-[24vw] md:text-[15vw] leading-[0.8] tracking-[-0.05em] pointer-events-auto flex">
          {"ENGINE".split('').map((letter, i) => (
            <span key={i} ref={el => engineLettersRef.current[i] = el} className="inline-block">
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Layer 2: Normal White UI Elements */}
      <div className="absolute inset-0 z-30 pointer-events-none text-white">
        
        {/* Top Header */}
        <header className="absolute top-6 left-6 right-6 md:top-10 md:left-10 md:right-12 flex justify-between items-start pointer-events-auto">
          <div className="text-[2rem] md:text-[3.5rem] leading-none font-medium tracking-tighter flex items-center gap-1">
            <span>(BO<sup className="text-sm md:text-xl font-normal tracking-normal -ml-1">®</sup></span>
            <span className="font-light mx-1 md:mx-2 text-[1.5rem] md:text-[2.5rem] tracking-tight opacity-80">&mdash;</span>
            <span>01)</span>
          </div>
          <nav className="flex items-center gap-4 md:gap-8 text-[9px] md:text-[11px] font-semibold tracking-widest uppercase mt-2 md:mt-4">
            <div className="hidden md:flex gap-8">
              <a href="#" className="hover:opacity-70 transition-opacity">Home</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Work</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Studio</a>
              <a href="#" className="hover:opacity-70 transition-opacity">News</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Contact</a>
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

        {/* Small Data Blocks on the left */}
        <div className="absolute bottom-[10%] md:bottom-auto md:top-[35%] w-full md:w-auto px-6 md:px-0 left-0 md:left-10 flex flex-col md:flex-row gap-6 md:gap-24 text-[9px] md:text-[10px] font-semibold tracking-widest justify-center md:justify-start items-center md:items-start pointer-events-none">
           <div className="hidden md:block">00</div>
           <div className="flex flex-col gap-4 md:gap-12 w-[85vw] md:max-w-[200px] text-center md:text-left">
             <div className="hidden md:block">
               <p className="opacity-50 font-normal">code/num</p>
               <p className="font-bold opacity-80">GTR-W108/109</p>
             </div>
             <p className="opacity-60 leading-[1.6]">
               {descriptionLines.map((line, lineIdx) => (
                  <React.Fragment key={lineIdx}>
                    {line.split(' ').map((word, wordIdx) => (
                      <span 
                        key={wordIdx} 
                        ref={el => { if(el) descWordsRef.current.push(el); }}
                        className="inline-block mr-[0.25em]"
                      >
                        {word}
                      </span>
                    ))}
                    <br/>
                  </React.Fragment>
               ))}
             </p>
           </div>
        </div>

        {/* Bottom text */}
        <div className="absolute top-[44%] left-6 md:top-auto md:bottom-12 md:left-10 flex flex-col gap-1 md:gap-2 pointer-events-auto text-left items-start">
          <p ref={subtitleLabelRef} className="text-[8px] md:text-[10px] font-semibold tracking-widest uppercase opacity-70">1300 HP - GTR</p>
          <div 
            ref={meetSpeedRef} 
            className="text-[12vw] sm:text-[6rem] lg:text-[8.5rem] leading-[0.85] uppercase flex tracking-[-0.04em] whitespace-pre"
          >
            <span className="font-black italic pr-1">
              {scrambledText.substring(0, 4)}
            </span>
            <span className="font-normal italic opacity-90">
              {scrambledText.substring(4)}
            </span>
          </div>
        </div>

      </div>

      {/* Mobile Overscreen Nav Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-black/60 flex flex-col items-center justify-center text-white"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-2 hover:opacity-70 transition-opacity"
            >
              <X className="w-8 h-8" strokeWidth={1.5} />
            </button>
            <nav className="flex flex-col items-center gap-8 text-2xl font-bold tracking-widest uppercase">
              <a href="#" className="hover:text-[#f46830] transition-colors" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#" className="hover:text-[#f46830] transition-colors" onClick={() => setIsMenuOpen(false)}>Work</a>
              <a href="#" className="hover:text-[#f46830] transition-colors" onClick={() => setIsMenuOpen(false)}>Studio</a>
              <a href="#" className="hover:text-[#f46830] transition-colors" onClick={() => setIsMenuOpen(false)}>News</a>
              <a href="#" className="hover:text-[#f46830] transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Cursor (Difference Blended) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white mix-blend-difference pointer-events-none z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.1 }}
      >
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
      </motion.div>

    </div>
  );
}
