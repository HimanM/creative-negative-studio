import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Send } from 'lucide-react';

interface ContactProps {
  isActive: boolean;
}

const scrambleChars = "XO>_-\\/[]{}—=+*^?#0123456789";

function useButtonScramble(buttonRef: React.RefObject<HTMLSpanElement | null>, text: string) {
  const isScrambling = useRef(false);

  const onHover = useCallback(() => {
    if (isScrambling.current || !buttonRef.current) return;
    isScrambling.current = true;

    const obj = { progress: 0 };
    gsap.to(obj, {
      progress: 1,
      duration: 0.5,
      ease: "none",
      onUpdate: () => {
        if (!buttonRef.current) return;
        const p = obj.progress;
        let result = "";
        for (let i = 0; i < text.length; i++) {
          if (p >= i / text.length) {
            result += text[i];
          } else {
            if (text[i] === " ") {
              result += " ";
            } else {
              result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }
          }
        }
        buttonRef.current.textContent = result;
      },
      onComplete: () => {
        if (buttonRef.current) buttonRef.current.textContent = text;
        isScrambling.current = false;
      },
    });
  }, [buttonRef, text]);

  return onHover;
}

export default function Contact({ isActive }: ContactProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const inputsRef = useRef<(HTMLDivElement | null)[]>([]);
  const submitTextRef = useRef<HTMLSpanElement>(null);

  const onSubmitHover = useButtonScramble(submitTextRef, "SEND MESSAGE");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

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

      inputsRef.current.filter(Boolean).forEach((el, i) => {
        gsap.set(el!, { opacity: 0, y: 30 });
        tl.to(el!, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.3 + i * 0.1);
      });

    return () => { tl.kill(); };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full flex flex-col md:flex-row">
      
      {/* Left 40% - Title (Negative effect) */}
      <div className="w-full md:w-[40%] h-[30%] md:h-full flex items-center justify-center md:justify-start px-10 pointer-events-none">
        <div className="font-display text-[18vw] md:text-[12vw] uppercase leading-[0.8] tracking-normal select-none mix-blend-difference text-white whitespace-nowrap">
          {"CONTACT".split('').map((letter, i) => (
            <span key={i} ref={el => titleLettersRef.current[i] = el} className="inline-block opacity-0 translate-y-[50px]">
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Right 60% - Content */}
      <div className="relative w-full md:w-[60%] h-[70%] md:h-full">
        <div className="relative w-full h-full flex items-center justify-center px-6 md:px-16 pt-28 md:pt-40 pb-10 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[600px] flex flex-col gap-6 md:gap-8 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
          >
            {/* Header micro-text */}
            <div className="mb-2 md:mb-4">
              <p className="text-[8px] md:text-[9px] font-light tracking-widest uppercase text-white/30">
                INQUIRIES // COLLABORATIONS // COMMISSIONS
              </p>
            </div>

            {/* Name */}
            <div ref={el => inputsRef.current[0] = el}>
              <label className="text-[8px] md:text-[9px] font-semibold tracking-widest uppercase text-white/40 block mb-1.5">
                NAME
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-transparent border-b border-white/20 outline-none text-white text-[11px] md:text-[13px] font-light tracking-wider uppercase py-2 transition-colors duration-300 focus:border-[#f46830] placeholder:text-white/15"
                placeholder="YOUR FULL NAME"
              />
            </div>

            {/* Email */}
            <div ref={el => inputsRef.current[1] = el}>
              <label className="text-[8px] md:text-[9px] font-semibold tracking-widest uppercase text-white/40 block mb-1.5">
                EMAIL
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-transparent border-b border-white/20 outline-none text-white text-[11px] md:text-[13px] font-light tracking-wider uppercase py-2 transition-colors duration-300 focus:border-[#f46830] placeholder:text-white/15"
                placeholder="YOUR@EMAIL.COM"
              />
            </div>

            {/* Subject */}
            <div ref={el => inputsRef.current[2] = el}>
              <label className="text-[8px] md:text-[9px] font-semibold tracking-widest uppercase text-white/40 block mb-1.5">
                SUBJECT
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full bg-transparent border-b border-white/20 outline-none text-white text-[11px] md:text-[13px] font-light tracking-wider uppercase py-2 transition-colors duration-300 focus:border-[#f46830] placeholder:text-white/15"
                placeholder="PROJECT INQUIRY"
              />
            </div>

            {/* Message */}
            <div ref={el => inputsRef.current[3] = el}>
              <label className="text-[8px] md:text-[9px] font-semibold tracking-widest uppercase text-white/40 block mb-1.5">
                MESSAGE
              </label>
              <textarea
                value={formData.message}
                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
                className="w-full bg-transparent border-b border-white/20 outline-none text-white text-[11px] md:text-[13px] font-light tracking-wider uppercase py-2 resize-none transition-colors duration-300 focus:border-[#f46830] placeholder:text-white/15"
                placeholder="DESCRIBE YOUR PROJECT..."
              />
            </div>

            {/* Submit Button */}
            <div ref={el => inputsRef.current[4] = el} className="pt-4 md:pt-6">
              <button
                type="submit"
                onMouseEnter={onSubmitHover}
                className="group flex items-center gap-3 md:gap-4 text-white/80 hover:text-white transition-colors duration-300"
              >
                <span
                  ref={submitTextRef}
                  className="font-display text-3xl md:text-5xl uppercase tracking-[-0.02em] leading-none"
                >
                  SEND MESSAGE
                </span>
                <Send className="w-4 h-4 md:w-6 md:h-6 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </button>
              <div className="w-12 h-[2px] bg-[#f46830] mt-2 opacity-60" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
