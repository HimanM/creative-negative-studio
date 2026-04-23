import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

interface StudioProps {
  isActive: boolean;
}

const scrambleChars = "XO>_-\\/[]{}—=+*^?#0123456789";

const teamMembers = [
  { name: "ALEX MERCER", role: "CREATIVE DIRECTOR" },
  { name: "NINA VOLKOV", role: "LEAD CINEMATOGRAPHER" },
  { name: "RAJ PATEL", role: "POST-PRODUCTION" },
  { name: "ELENA ROSS", role: "ART DIRECTOR" },
];

const specs = [
  { label: "EST //", value: "2026" },
  { label: "COORD //", value: "34.0522° N, 118.2437° W" },
  { label: "STATUS //", value: "OPERATIONAL" },
  { label: "SECTOR //", value: "AUTOMOTIVE / CINEMATIC" },
  { label: "CLIENTS //", value: "147" },
  { label: "PROJECTS //", value: "312" },
];

const manifesto = [
  "WE DON'T SHOOT CARS.",
  "WE ENGINEER VISUAL",
  "VELOCITY. EVERY FRAME",
  "IS A CALCULATED ACT",
  "OF CONTROLLED CHAOS."
];

function scrambleText(element: HTMLElement, finalText: string, duration = 0.8) {
  const obj = { progress: 0 };
  return gsap.to(obj, {
    progress: 1,
    duration,
    ease: "none",
    onUpdate: () => {
      const p = obj.progress;
      const length = finalText.length;
      let result = "";
      for (let i = 0; i < length; i++) {
        if (p >= i / length) {
          result += finalText[i];
        } else {
          if (finalText[i] === " ") {
            result += " ";
          } else {
            result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
        }
      }
      element.textContent = result;
    },
  });
}

export default function Studio({ isActive }: StudioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const specItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const teamNamesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const teamRolesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const manifestoRef = useRef<(HTMLSpanElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // BG title reveal character by character
    tl.to(titleLettersRef.current.filter(Boolean), {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "back.out(2)",
    }, 0);

      // Image reveal
      if (imageRef.current) {
        gsap.set(imageRef.current, { clipPath: "inset(0 100% 0 0)" });
        tl.to(imageRef.current, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut" }, 0.2);
      }

      // Spec items stagger
      specItemsRef.current.filter(Boolean).forEach((el, i) => {
        gsap.set(el!, { opacity: 0, x: 30 });
        tl.to(el!, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, 0.4 + i * 0.08);
      });

      // Scramble team names
      teamNamesRef.current.filter(Boolean).forEach((el, i) => {
        const finalText = teamMembers[i].name;
        el!.textContent = scrambleChars.substring(0, finalText.length);
        tl.add(scrambleText(el!, finalText, 0.6), 0.8 + i * 0.15);
      });

      // Scramble team roles
      teamRolesRef.current.filter(Boolean).forEach((el, i) => {
        const finalText = teamMembers[i].role;
        el!.textContent = scrambleChars.substring(0, finalText.length);
        tl.add(scrambleText(el!, finalText, 0.5), 1.0 + i * 0.15);
      });

      // Scramble manifesto lines
      manifestoRef.current.filter(Boolean).forEach((el, i) => {
        const finalText = manifesto[i];
        el!.textContent = scrambleChars.substring(0, finalText.length);
        tl.add(scrambleText(el!, finalText, 0.7), 1.2 + i * 0.12);
      });

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full flex flex-col md:flex-row">
      
      {/* Left 65% - Content */}
      <div className="relative w-full md:w-[65%] h-[70%] md:h-full">
        <div className="relative w-full h-full flex flex-col pt-28 md:pt-40 pb-6 md:pb-8 px-6 md:px-16 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-8 h-full">
            {/* Image */}
            <div className="md:w-[45%] h-[35vh] md:h-full flex-shrink-0">
              <div ref={imageRef} className="w-full h-full overflow-hidden">
                <img
                  src="/studio.png"
                  alt="Studio atmosphere"
                  className="w-full h-full object-cover grayscale opacity-80"
                />
              </div>
            </div>

            {/* Spec Sheet (Glassmorphism) */}
            <div className="md:w-[55%] flex flex-col justify-between backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    ref={el => specItemsRef.current[i] = el}
                    className="border-b border-white/15 pb-2"
                  >
                    <p className="text-[8px] md:text-[9px] font-light tracking-widest uppercase text-white/40">{spec.label}</p>
                    <p className="text-[10px] md:text-[12px] font-semibold tracking-wider uppercase text-white/90 mt-0.5">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="my-6 md:my-0">
                <p className="text-[8px] md:text-[9px] font-light tracking-widest uppercase text-white/30 mb-2">MANIFESTO //</p>
                <div className="font-display text-lg md:text-2xl uppercase leading-[1] tracking-[-0.02em] text-white/80">
                  {manifesto.map((line, i) => (
                    <span key={i} ref={el => manifestoRef.current[i] = el} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[8px] md:text-[9px] font-light tracking-widest uppercase text-white/30 mb-3">TEAM //</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {teamMembers.map((member, i) => (
                    <div key={i} className="border-l border-white/15 pl-3">
                      <span
                        ref={el => teamNamesRef.current[i] = el}
                        className="block text-[11px] md:text-[12px] font-semibold tracking-wider uppercase text-white/90"
                      >
                        {member.name}
                      </span>
                      <span
                        ref={el => teamRolesRef.current[i] = el}
                        className="block text-[8px] md:text-[9px] font-light tracking-widest uppercase text-white/40 mt-0.5"
                      >
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right 35% - Title (Negative effect) */}
      <div className="w-full md:w-[35%] h-[30%] md:h-full flex items-center justify-center pointer-events-none">
        <div className="font-display text-[22vw] md:text-[12vw] uppercase leading-[0.8] tracking-[-0.05em] select-none text-right mix-blend-difference text-white whitespace-nowrap">
          {"STUDIO".split('').map((letter, i) => (
            <span key={i} ref={el => titleLettersRef.current[i] = el} className="inline-block opacity-0 translate-y-[50px]">
              {letter}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
