import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface WorkProps {
  isActive: boolean;
}

const projects = [
  { id: 1, title: "LUMEN", category: "AUTOMOTIVE", year: "2026", code: "PRJ-01", img: "/work1.png" },
  { id: 2, title: "VELOCITY", category: "COMMERCIAL", year: "2025", code: "PRJ-02", img: "/work2.png" },
  { id: 3, title: "NIGHT RUN", category: "SHORT FILM", year: "2026", code: "PRJ-03", img: "/work3.png" },
  { id: 4, title: "APEX", category: "DOCUMENTARY", year: "2024", code: "PRJ-04", img: "/work4.png" },
  { id: 5, title: "NEON DRIFT", category: "MUSIC VIDEO", year: "2025", code: "PRJ-05", img: "/work5.png" },
  { id: 6, title: "SHIFT", category: "AUTOMOTIVE", year: "2026", code: "PRJ-06", img: "/work6.png" },
];

const scrambleChars = "XO>_-\\/[]{}—=+*^?#0123456789";

function ScrambleTitle({ title, isHovered }: { title: string, isHovered: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isScrambling = useRef(false);

  useEffect(() => {
    if (isHovered && !isScrambling.current && ref.current) {
      isScrambling.current = true;
      const obj = { progress: 0 };
      gsap.to(obj, {
        progress: 1,
        duration: 0.5,
        ease: "none",
        onUpdate: () => {
          if (!ref.current) return;
          const p = obj.progress;
          let result = "";
          for (let i = 0; i < title.length; i++) {
            if (p >= i / title.length) result += title[i];
            else if (title[i] === " ") result += " ";
            else result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
          ref.current.textContent = result;
        },
        onComplete: () => {
          if (ref.current) ref.current.textContent = title;
          isScrambling.current = false;
        }
      });
    } else if (!isHovered && ref.current && !isScrambling.current) {
      ref.current.textContent = title;
    }
  }, [isHovered, title]);

  return (
    <h3 ref={ref} className="font-display font-bold text-xl md:text-3xl uppercase leading-[0.9] tracking-normal">
      {title}
    </h3>
  );
}

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
      <div className="w-full md:w-[40%] h-[25%] md:h-full flex items-center justify-center md:justify-start px-6 md:px-10 pt-20 md:pt-0 pointer-events-none">
        <div className="font-display font-black text-[22vw] md:text-[12vw] uppercase leading-[0.8] tracking-normal select-none mix-blend-difference text-white whitespace-nowrap">
          {"WORK".split('').map((letter, i) => (
            <span key={i} ref={el => titleLettersRef.current[i] = el} className="inline-block opacity-0 translate-y-[50px]">
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Right 60% - Grid content */}
      <div className="relative w-full md:w-[60%] h-[75%] md:h-full">
        <div className="relative w-full h-full px-4 md:px-12 pt-6 md:pt-32 pb-20 md:pb-10 overflow-hidden flex flex-col">
          <div className="grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2 gap-2 md:gap-4 w-full h-full max-w-[1000px] mx-auto">
            {projects.map((project, i) => (
              <div
                key={project.id}
                ref={el => itemsRef.current[i] = el}
                className="relative group overflow-hidden cursor-pointer w-full h-full"
                data-clickable
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Image */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={project.img}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-all duration-500 ${hoveredIdx === i ? 'grayscale-0 scale-105' : 'grayscale'
                      }`}
                  />
                </div>

                {/* Overlay info */}
                <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-6 pointer-events-none text-white drop-shadow-md">
                  <div className="flex justify-between items-start">
                    <span className="font-sans text-[10px] md:text-xs font-semibold tracking-widest uppercase">
                      {project.code}
                    </span>
                    <span className="font-sans text-[10px] md:text-xs font-semibold tracking-widest uppercase">
                      {project.year}
                    </span>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-1 md:mb-2">
                      {project.category}
                    </p>
                    <ScrambleTitle title={project.title} isHovered={hoveredIdx === i} />
                  </div>
                </div>

                {/* Hover border */}
                <div className={`absolute inset-0 border transition-all duration-300 pointer-events-none ${hoveredIdx === i ? 'border-[#f46830]/60' : 'border-white/10'
                  }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

