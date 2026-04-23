import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface WorkProps {
  isActive: boolean;
}

const projects = [
  { id: 1, title: "NIGHTFALL", category: "AUTOMOTIVE", code: "PRJ-001", year: "2026", img: "/work1.png" },
  { id: 2, title: "VELOCITY", category: "CINEMATIC", code: "PRJ-002", year: "2025", img: "/work2.png" },
  { id: 3, title: "CHROMATIC", category: "EDITORIAL", code: "PRJ-003", year: "2025", img: "/work3.png" },
  { id: 4, title: "OBSIDIAN", category: "AUTOMOTIVE", code: "PRJ-004", year: "2026", img: "/work4.png" },
  { id: 5, title: "MERIDIAN", category: "CINEMATIC", code: "PRJ-005", year: "2024", img: "/work5.png" },
  { id: 6, title: "PHANTOM", category: "EDITORIAL", code: "PRJ-006", year: "2024", img: "/work6.png" },
];

export default function Work({ isActive }: WorkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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

      // Stagger grid items with mask reveal
      const validItems = itemsRef.current.filter(Boolean);
      validItems.forEach((item, i) => {
        gsap.set(item!, { clipPath: "inset(100% 0 0 0)", opacity: 0 });
        tl.to(item!, {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        }, 0.1 + i * 0.12);
      });

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full flex flex-col md:flex-row">
      
      {/* Left 40% - Title (Negative effect) */}
      <div className="w-full md:w-[40%] h-[30%] md:h-full flex items-center justify-center md:justify-start px-10 pointer-events-none">
        <div className="font-display text-[22vw] md:text-[14vw] uppercase leading-[0.8] tracking-[-0.05em] select-none mix-blend-difference text-white whitespace-nowrap">
          {"WORK".split('').map((letter, i) => (
            <span key={i} ref={el => titleLettersRef.current[i] = el} className="inline-block opacity-0 translate-y-[50px]">
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Right 60% - Grid content */}
      <div className="relative w-full md:w-[60%] h-[70%] md:h-full">
        <div className="relative w-full h-full overflow-y-auto px-4 md:px-12 pt-28 md:pt-40 pb-10">
          <div className="grid grid-cols-2 gap-2 md:gap-4 max-w-[1000px] mx-auto">
            {projects.map((project, i) => (
              <div
                key={project.id}
                ref={el => itemsRef.current[i] = el}
                className="relative group overflow-hidden cursor-pointer aspect-[4/5] md:aspect-[3/4]"
                data-clickable
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Image */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={project.img}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      hoveredIdx === i ? 'grayscale-0 scale-105' : 'grayscale'
                    }`}
                  />
                </div>

                {/* Overlay info */}
                <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-6 pointer-events-none">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] md:text-[9px] font-semibold tracking-widest uppercase text-white/60">
                      {project.code}
                    </span>
                    <span className="text-[8px] md:text-[9px] font-semibold tracking-widest uppercase text-white/60">
                      {project.year}
                    </span>
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[9px] font-semibold tracking-widest uppercase text-white/50 mb-1">
                      {project.category}
                    </p>
                    <h3 className="font-display text-xl md:text-3xl lg:text-4xl uppercase leading-[0.85] tracking-[-0.03em] text-white mix-blend-difference">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Hover border */}
                <div className={`absolute inset-0 border transition-all duration-300 pointer-events-none ${
                  hoveredIdx === i ? 'border-[#f46830]/60' : 'border-white/10'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
