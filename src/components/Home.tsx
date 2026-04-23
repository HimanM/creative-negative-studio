import React, { useState, useEffect, useRef } from 'react';
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

interface HomeProps {
  isActive: boolean;
}

export default function Home({ isActive }: HomeProps) {
  const [scrambledText, setScrambledText] = useState("MEETSPCed ");

  const engineLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const descWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleLabelRef = useRef<HTMLParagraphElement>(null);
  const meetSpeedRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  descWordsRef.current = [];

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial resets for other elements
    gsap.set(descWordsRef.current.filter(Boolean), { opacity: 0 });
    gsap.set(meetSpeedRef.current, { opacity: 0 });
    gsap.set(subtitleLabelRef.current, { opacity: 0 });

    // Animation 1: ENGINE pop up letter by letter
    tl.to(engineLettersRef.current.filter(Boolean), {
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
      tl.to(descWordsRef.current.filter(Boolean), {
        opacity: 1,
        duration: 0.1,
        stagger: 0.08,
      }, 1.0);

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      {/* Layer 1: GSAP Engine Title (Negative Effect) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[38%] md:top-1/2 -translate-y-1/2 right-[2%] md:right-[5%] font-display font-black text-[22vw] md:text-[12vw] uppercase leading-[0.8] tracking-normal pointer-events-auto whitespace-nowrap mix-blend-difference text-white">
          {"ENGINE".split('').map((letter, i) => (
            <span key={i} ref={el => engineLettersRef.current[i] = el} className="inline-block opacity-0 translate-y-[50px]">
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Layer 2: Normal White UI Elements */}
      <div className="absolute inset-0 pointer-events-none text-white">
        {/* Small Data Blocks on the left */}
        <div className="absolute bottom-[10%] md:bottom-auto md:top-[35%] w-full md:w-auto px-6 md:px-0 left-0 md:left-10 flex flex-col md:flex-row gap-6 md:gap-24 font-sans text-[10px] md:text-xs font-semibold tracking-widest uppercase justify-center md:justify-start items-center md:items-start pointer-events-none">
           <div className="hidden md:block">00</div>
           <div className="flex flex-col gap-4 md:gap-12 w-[85vw] md:max-w-[250px] text-center md:text-left">
             <div className="hidden md:block">
               <p className="opacity-50">code/num</p>
               <p className="opacity-80">GTR-W108/109</p>
             </div>
             <p className="font-sans text-xs md:text-sm font-medium tracking-wide uppercase leading-relaxed opacity-80">
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
          <p ref={subtitleLabelRef} className="font-sans text-[10px] md:text-xs font-semibold tracking-widest uppercase opacity-70">1300 HP - GTR</p>
          <div 
            ref={meetSpeedRef} 
            className="font-sans font-black text-4xl md:text-7xl lg:text-8xl leading-none uppercase flex tracking-normal whitespace-pre"
          >
            <span className="italic pr-1">
              {scrambledText.substring(0, 4)}
            </span>
            <span className="italic font-light opacity-90">
              {scrambledText.substring(4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
