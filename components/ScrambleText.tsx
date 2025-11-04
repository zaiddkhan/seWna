"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ScrambleText = () => {
  const titleRef1 = useRef<HTMLSpanElement>(null);
  const titleRef2 = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const titlePhrases = [
    ["Your style,", "crafted."],
    ["Your vision,", "realized."],
    ["Your design,", "perfected."],
    ["Your fashion,", "personalized."],
  ];

  const phrases = [
    "Connect with independent designers.",
    "Create your custom outfit.",
    "Express your unique style.",
    "Fashion tailored to you.",
  ];

  useEffect(() => {
    if (!titleRef1.current || !titleRef2.current || !textRef.current || !cursorRef.current) return;

    const chars = "abcdefghijklmnopqrstuvwxyz";
    let currentPhraseIndex = 0;
    let currentTitleIndex = 0;

    // Cursor blinking animation
    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "none",
    });

    const scrambleElement = (
      element: HTMLElement,
      targetPhrase: string,
      duration: number,
      onComplete?: () => void
    ) => {
      const steps = 20;
      const stepDuration = duration / steps;
      let step = 0;

      const interval = setInterval(() => {
        if (!element) {
          clearInterval(interval);
          return;
        }

        if (step >= steps) {
          element.textContent = targetPhrase;
          clearInterval(interval);
          if (onComplete) onComplete();
          return;
        }

        const progress = step / steps;
        let scrambled = "";

        for (let i = 0; i < targetPhrase.length; i++) {
          if (targetPhrase[i] === " ") {
            scrambled += " ";
          } else if (i < targetPhrase.length * progress) {
            scrambled += targetPhrase[i];
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        element.textContent = scrambled;
        step++;
      }, stepDuration);

      return interval;
    };

    const animateTitles = () => {
      if (!titleRef1.current || !titleRef2.current) return;

      const [title1, title2] = titlePhrases[currentTitleIndex];

      scrambleElement(titleRef1.current, title1, 1500, () => {
        if (titleRef2.current) {
          scrambleElement(titleRef2.current, title2, 1500);
        }
      });
    };

    const scrambleDescription = () => {
      if (!textRef.current) return;

      scrambleElement(textRef.current, phrases[currentPhraseIndex], 2000, () => {
        setTimeout(() => {
          currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
          scrambleDescription();
        }, 3000);
      });
    };

    const cycleTitles = () => {
      animateTitles();

      const titleInterval = setInterval(() => {
        currentTitleIndex = (currentTitleIndex + 1) % titlePhrases.length;
        animateTitles();
      }, 12000); // Change title every 12 seconds

      return titleInterval;
    };

    // Start animations
    animateTitles();
    setTimeout(() => {
      scrambleDescription();
    }, 500);

    const titleInterval = cycleTitles();

    return () => {
      clearInterval(titleInterval);
    };
  }, []);

  return (
    <div className="absolute bottom-8 left-6 md:bottom-12 md:left-8 z-50 max-w-3xl">
      <div className="space-y-4 p-8 rounded-3xl">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-gray-900 tracking-tight leading-tight">
          <span ref={titleRef1}>Your style,</span>
          <br />
          <span ref={titleRef2} className="text-[#00b67f]">crafted.</span>
        </h1>
        <div className="flex items-center gap-1 text-2xl md:text-3xl lg:text-4xl text-gray-700">
          <span ref={textRef} className="font-light">
            Connect with independent designers.
          </span>
          <span ref={cursorRef} className="text-[#00b67f] font-bold">
            |
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScrambleText;
