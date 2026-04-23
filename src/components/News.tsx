import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface NewsProps {
  isActive: boolean;
}

const newsItems = [
  {
    id: 1,
    date: "APR 2026",
    code: "N-001",
    headline: "REDEFINING AUTOMOTIVE VISUAL LANGUAGE",
    body: "Our latest campaign pushes the boundaries of what automotive cinematography can achieve. Shot across three continents with next-generation camera systems, the project represents a fundamental shift in how performance vehicles are presented to audiences worldwide.",
  },
  {
    id: 2,
    date: "MAR 2026",
    code: "N-002",
    headline: "STUDIO EXPANSION INTO TOKYO",
    body: "Creative Negative opens its third global outpost in Shibuya, Tokyo. The 4,000 sqft facility features a dedicated vehicle staging area, precision lighting rigs, and post-production suites designed for real-time color grading and compositing.",
  },
  {
    id: 3,
    date: "FEB 2026",
    code: "N-003",
    headline: "CANNES LIONS GRAND PRIX SHORTLIST",
    body: "Our work for the Meridian project has been shortlisted for the Cannes Lions Grand Prix in the Film Craft category. The piece showcases our signature negative-space approach to automotive storytelling.",
  },
  {
    id: 4,
    date: "JAN 2026",
    code: "N-004",
    headline: "PARTNERSHIP WITH HYPERION MOTORS",
    body: "We are proud to announce an exclusive creative partnership with Hyperion Motors for their upcoming electric hypercar launch. The collaboration will span visual identity, campaign films, and experiential design.",
  },
  {
    id: 5,
    date: "DEC 2025",
    code: "N-005",
    headline: "YEAR IN REVIEW — 312 PROJECTS DELIVERED",
    body: "A record-breaking year for Creative Negative. We delivered 312 projects across 14 countries, working with the world's most demanding automotive brands to produce content that sets new industry benchmarks.",
  },
];

export default function News({ isActive }: NewsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const wordRefs = useRef<Map<number, HTMLSpanElement[]>>(new Map());

  useEffect(() => {
    const tl = gsap.timeline();

    // Title reveal character by character
    tl.to(titleLettersRef.current.filter(Boolean), {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "back.out(2)",
    }, 0);

      rowsRef.current.filter(Boolean).forEach((row, i) => {
        gsap.set(row!, { opacity: 0, y: 20 });
        tl.to(row!, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.2 + i * 0.1);
      });

    return () => { tl.kill(); };
  }, []);

  const handleToggle = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const words = wordRefs.current.get(id);
        if (words && words.length > 0) {
          const validWords = words.filter(Boolean);
          gsap.set(validWords, { opacity: 0, y: 8 });
          gsap.to(validWords, {
            opacity: 1,
            y: 0,
            duration: 0.08,
            stagger: 0.03,
            ease: "power2.out",
          });
        }
      });
    });
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full flex flex-col md:flex-row">
      
      {/* Left 30% - Vertical Title (Negative effect) */}
      <div className="w-full md:w-[25%] lg:w-[20%] h-[20%] md:h-full flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="font-display text-[22vw] md:text-[16vw] uppercase leading-[0.8] tracking-normal select-none origin-center md:-rotate-90 whitespace-nowrap mix-blend-difference text-white flex">
          {"NEWS".split('').map((letter, i) => (
            <span key={i} ref={el => titleLettersRef.current[i] = el} className="inline-block opacity-0 translate-y-[50px]">
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Right 70% - Accordion content */}
      <div className="relative w-full md:flex-1 h-[80%] md:h-full">
        <div className="relative w-full h-full flex flex-col justify-start px-4 md:px-16 lg:px-24 pt-28 md:pt-40 pb-10 overflow-y-auto">
          <div className="max-w-[1200px] w-full flex flex-col backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            {newsItems.map((item, i) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  ref={el => rowsRef.current[i] = el}
                  className="border-b border-white/20 cursor-pointer group"
                  data-clickable
                  onClick={() => handleToggle(item.id)}
                >
                  {/* Row header */}
                  <div className="flex items-baseline justify-between py-4 md:py-6 gap-4">
                    <div className="flex items-baseline gap-3 md:gap-6 min-w-0">
                      <span className="text-[8px] md:text-[9px] font-light tracking-widest uppercase text-white/30 flex-shrink-0">
                        {item.date}
                      </span>
                      <span className="text-[8px] md:text-[9px] font-light tracking-widest uppercase text-white/20 flex-shrink-0 hidden md:inline">
                        {item.code}
                      </span>
                      <h3 className={`font-display text-base md:text-2xl lg:text-3xl uppercase leading-[0.9] tracking-[-0.02em] transition-colors duration-300 truncate ${
                        isExpanded ? 'text-white' : 'text-white/70 group-hover:text-white'
                      }`}>
                        {item.headline}
                      </h3>
                    </div>
                    <span className={`text-[9px] md:text-[11px] font-light tracking-widest text-white/40 flex-shrink-0 transition-transform duration-300 ${
                      isExpanded ? 'rotate-45' : ''
                    }`}>
                      +
                    </span>
                  </div>

                  {/* Expanded content */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isExpanded ? 'max-h-[200px] md:max-h-[150px] pb-4 md:pb-6' : 'max-h-0'
                    }`}
                  >
                    <p className="text-[9px] md:text-[10px] font-light tracking-wider uppercase leading-[1.8] text-white/50 pl-0 md:pl-[120px] max-w-[800px]">
                      {item.body.split(' ').map((word, wi) => {
                        return (
                          <span
                            key={wi}
                            ref={el => {
                              if (el) {
                                if (!wordRefs.current.has(item.id)) {
                                  wordRefs.current.set(item.id, []);
                                }
                                const arr = wordRefs.current.get(item.id)!;
                                arr[wi] = el;
                              }
                            }}
                            className="inline-block mr-[0.3em]"
                          >
                            {word}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
