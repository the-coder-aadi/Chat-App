import React, { useEffect, useState, useRef } from "react";
 
/**
 * ChatCat — Loading Screen
 * -------------------------------------------------
 * Design tokens
 * Color   — cream bg #F6EFE3, card cream #FBF7EF, charcoal text #2E2A25,
 *           muted brown #8B7E6E, orange primary #E86A33, orange deep #C74E1F,
 *           orange soft glow #FBD9C2
 * Type    — Display: "Fredoka" (rounded, friendly — reads as "cat")
 *           Body/UI: "Inter" (quiet, legible, gets out of the way)
 * Layout  — full-bleed centered stage, single hero mark, paw-print progress rail
 * Signature — the chat-bubble's tail is folded into a cat ear: one shape
 *             does double duty as "chat" and "cat" at once.
 * -------------------------------------------------
 */
 
const FONT_IMPORT_ID = "chatcat-font-import";
 
function ensureFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_IMPORT_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_IMPORT_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Inter:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}
 
export default function LoadingScreen({ onComplete, loop = true, duration = 3400 }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading -> ready -> exiting -> (loop) loading
  const rafRef = useRef(null);
  const startRef = useRef(null);
 
  useEffect(() => {
    ensureFonts();
  }, []);
 
  useEffect(() => {
    if (phase !== "loading") return;
    startRef.current = null;
 
    const step = (ts) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      // ease-out-ish progress curve, never fully linear — feels alive
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 2.2);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setPhase("ready");
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, duration]);
 
  useEffect(() => {
    if (phase !== "ready") return;
    const t = setTimeout(() => setPhase("exiting"), 700);
    return () => clearTimeout(t);
  }, [phase]);
 
  useEffect(() => {
    if (phase !== "exiting") return;
    const t = setTimeout(() => {
      if (onComplete) onComplete();
      if (loop) {
        setProgress(0);
        setPhase("loading");
      }
    }, 650);
    return () => clearTimeout(t);
  }, [phase, loop, onComplete]);
 
  const pawCount = 5;
  const pawsFilled = Math.round((progress / 100) * pawCount);
 
  return (
    <div
      className={`cc-stage ${phase === "exiting" ? "cc-stage--exit" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={phase === "ready" ? "ChatCat is ready" : `Loading ChatCat, ${progress} percent`}
    >
      <style>{`
        .cc-stage {
          --cream: #F6EFE3;
          --cream-card: #FBF7EF;
          --ink: #2E2A25;
          --muted: #8B7E6E;
          --orange: #E86A33;
          --orange-deep: #C74E1F;
          --orange-glow: #FBD9C2;
          --ring: rgba(232, 106, 51, 0.16);
 
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cream);
          overflow: hidden;
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .cc-stage--exit {
          opacity: 0;
          transform: scale(1.03);
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-stage, .cc-stage * { animation-duration: 0.001ms !important; transition-duration: 0.2s !important; }
        }
 
        /* ambient background texture — quiet, not decorative-for-its-own-sake */
        .cc-field {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(600px 420px at 50% 38%, var(--orange-glow) 0%, rgba(251,217,194,0) 70%),
            radial-gradient(900px 600px at 85% 90%, rgba(232,106,51,0.06) 0%, rgba(232,106,51,0) 60%),
            radial-gradient(700px 500px at 8% 12%, rgba(232,106,51,0.05) 0%, rgba(232,106,51,0) 60%);
        }
 
        .cc-pawtrail {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .cc-paw {
          position: absolute;
          opacity: 0;
          color: var(--orange);
          animation: cc-float 5.4s ease-in-out infinite;
        }
        @keyframes cc-float {
          0%   { opacity: 0; transform: translateY(14px) rotate(var(--r, 0deg)) scale(0.9); }
          12%  { opacity: 0.16; }
          55%  { opacity: 0.1; }
          100% { opacity: 0; transform: translateY(-26px) rotate(var(--r, 0deg)) scale(1); }
        }
 
        .cc-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: 32px;
        }
 
        /* --- signature mark: chat bubble whose tail becomes a cat ear --- */
        .cc-mark-wrap {
          position: relative;
          width: 128px;
          height: 128px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cc-mark-halo {
          position: absolute;
          inset: -18px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--orange-glow) 0%, rgba(251,217,194,0) 72%);
          animation: cc-halo-pulse 2.6s ease-in-out infinite;
        }
        @keyframes cc-halo-pulse {
          0%, 100% { transform: scale(0.94); opacity: 0.75; }
          50%      { transform: scale(1.06); opacity: 1; }
        }
        .cc-mark {
          position: relative;
          width: 108px;
          height: 108px;
          filter: drop-shadow(0 10px 18px rgba(199, 78, 31, 0.28));
          animation: cc-mark-bob 2.6s ease-in-out infinite;
        }
        @keyframes cc-mark-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-5px) rotate(-1.5deg); }
        }
        .cc-ear-left  { transform-origin: 34px 30px; animation: cc-ear-twitch 3.8s ease-in-out infinite; }
        .cc-ear-right { transform-origin: 74px 26px; animation: cc-ear-twitch 3.8s ease-in-out infinite 1.9s; }
        @keyframes cc-ear-twitch {
          0%, 82%, 100% { transform: rotate(0deg); }
          88%            { transform: rotate(-7deg); }
          94%            { transform: rotate(3deg); }
        }
        .cc-eye {
          animation: cc-blink 3.6s ease-in-out infinite;
          transform-origin: center;
        }
        .cc-eye-r { animation-delay: 0.05s; }
        @keyframes cc-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95%            { transform: scaleY(0.08); }
        }
        .cc-whisker {
          stroke-dasharray: 26;
          stroke-dashoffset: 26;
          animation: cc-draw 1.1s ease forwards;
        }
        .cc-whisker--1 { animation-delay: 0.15s; }
        .cc-whisker--2 { animation-delay: 0.28s; }
        .cc-whisker--3 { animation-delay: 0.41s; }
        .cc-whisker--4 { animation-delay: 0.15s; }
        .cc-whisker--5 { animation-delay: 0.28s; }
        .cc-whisker--6 { animation-delay: 0.41s; }
        @keyframes cc-draw {
          to { stroke-dashoffset: 0; }
        }
        .cc-tailtick {
          animation: cc-tick-sway 2.6s ease-in-out infinite;
          transform-origin: 40px 96px;
        }
        @keyframes cc-tick-sway {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(6deg); }
        }
 
        /* wordmark */
        .cc-word {
          display: flex;
          font-family: "Fredoka", "Inter", sans-serif;
          font-weight: 600;
          font-size: clamp(28px, 5vw, 36px);
          color: var(--ink);
          letter-spacing: 0.01em;
        }
        .cc-word span {
          display: inline-block;
          opacity: 0;
          transform: translateY(10px);
          animation: cc-letter-in 0.5s ease forwards;
        }
        .cc-word .cc-cat { color: var(--orange-deep); }
        @keyframes cc-letter-in {
          to { opacity: 1; transform: translateY(0); }
        }
 
        .cc-tagline {
          margin-top: -14px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--muted);
          letter-spacing: 0.02em;
          min-height: 18px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cc-tagline-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--orange);
          animation: cc-dot-pulse 1.2s ease-in-out infinite;
        }
        .cc-tagline-dot:nth-child(2) { animation-delay: 0.15s; }
        .cc-tagline-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes cc-dot-pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50%      { opacity: 1; transform: scale(1); }
        }
 
        /* progress rail — paw prints fill in as steps, not a generic bar */
        .cc-rail {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cc-pawstep {
          color: var(--muted);
          opacity: 0.35;
          transition: color 0.35s ease, opacity 0.35s ease, transform 0.35s ease;
        }
        .cc-pawstep--filled {
          color: var(--orange);
          opacity: 1;
          transform: translateY(-2px) scale(1.08);
        }
        .cc-pct {
          font-variant-numeric: tabular-nums;
          font-size: 13px;
          font-weight: 600;
          color: var(--muted);
          width: 40px;
          text-align: right;
        }
        .cc-pct--ready { color: var(--orange-deep); }
 
        .cc-ready-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--orange-deep);
          opacity: 0;
          animation: cc-badge-in 0.4s ease forwards 0.1s;
        }
        @keyframes cc-badge-in {
          to { opacity: 1; }
        }
        .cc-check {
          width: 16px;
          height: 16px;
        }
        .cc-check circle {
          stroke: var(--orange);
          stroke-dasharray: 44;
          stroke-dashoffset: 44;
          animation: cc-draw-circle 0.45s ease forwards;
        }
        .cc-check path {
          stroke: var(--orange-deep);
          stroke-dasharray: 14;
          stroke-dashoffset: 14;
          animation: cc-draw-check 0.3s ease forwards 0.4s;
        }
        @keyframes cc-draw-circle { to { stroke-dashoffset: 0; } }
        @keyframes cc-draw-check  { to { stroke-dashoffset: 0; } }
      `}</style>
 
      <div className="cc-field" />
 
      <div className="cc-pawtrail" aria-hidden="true">
        {[
          { l: "18%", t: "72%", r: "-8deg", d: "0s" },
          { l: "82%", t: "66%", r: "10deg", d: "1.1s" },
          { l: "26%", t: "24%", r: "4deg", d: "2.2s" },
          { l: "74%", t: "20%", r: "-6deg", d: "0.6s" },
          { l: "50%", t: "82%", r: "2deg", d: "1.7s" },
        ].map((p, i) => (
          <svg
            key={i}
            className="cc-paw"
            style={{ left: p.l, top: p.t, "--r": p.r, animationDelay: p.d }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="15" r="5" />
            <circle cx="4.5" cy="9" r="2.2" />
            <circle cx="9.5" cy="4.5" r="2.2" />
            <circle cx="14.5" cy="4.5" r="2.2" />
            <circle cx="19.5" cy="9" r="2.2" />
          </svg>
        ))}
      </div>
 
      <div className="cc-content">
        <div className="cc-mark-wrap">
          <div className="cc-mark-halo" aria-hidden="true" />
          <svg className="cc-mark" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* ears (also read as the speech-bubble tail, split in two) */}
            <path className="cc-ear-left" d="M30 34 L20 10 L42 26 Z" fill="#E86A33" />
            <path className="cc-ear-right" d="M78 30 L90 8 L66 24 Z" fill="#E86A33" />
            {/* bubble / face body */}
            <rect x="14" y="24" width="80" height="60" rx="26" fill="#FBF7EF" stroke="#E86A33" strokeWidth="3" />
            {/* small chat-tail point at base, doubles as chin */}
            <path className="cc-tailtick" d="M38 82 Q40 96 50 90 Z" fill="#FBF7EF" stroke="#E86A33" strokeWidth="3" strokeLinejoin="round" />
            {/* whiskers */}
            <g stroke="#C74E1F" strokeWidth="2" strokeLinecap="round">
              <line className="cc-whisker cc-whisker--1" x1="16" y1="52" x2="-2" y2="47" />
              <line className="cc-whisker cc-whisker--2" x1="16" y1="58" x2="-2" y2="58" />
              <line className="cc-whisker cc-whisker--3" x1="16" y1="64" x2="-2" y2="69" />
              <line className="cc-whisker cc-whisker--4" x1="92" y1="52" x2="110" y2="47" />
              <line className="cc-whisker cc-whisker--5" x1="92" y1="58" x2="110" y2="58" />
              <line className="cc-whisker cc-whisker--6" x1="92" y1="64" x2="110" y2="69" />
            </g>
            {/* eyes */}
            <ellipse className="cc-eye cc-eye-l" cx="40" cy="54" rx="4.5" ry="6" fill="#2E2A25" />
            <ellipse className="cc-eye cc-eye-r" cx="68" cy="54" rx="4.5" ry="6" fill="#2E2A25" />
            {/* nose */}
            <path d="M52 62 L56 62 L54 65 Z" fill="#C74E1F" />
          </svg>
        </div>
 
        <div>
          <div className="cc-word" aria-hidden="true">
            {"Chat".split("").map((ch, i) => (
              <span key={`c-${i}`} style={{ animationDelay: `${0.12 + i * 0.045}s` }}>
                {ch}
              </span>
            ))}
            {"Cat".split("").map((ch, i) => (
              <span
                key={`t-${i}`}
                className="cc-cat"
                style={{ animationDelay: `${0.12 + (i + 4) * 0.045}s` }}
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
 
        {phase !== "ready" && phase !== "exiting" ? (
          <div className="cc-tagline">
            <span>Purring up your chats</span>
            <span className="cc-tagline-dot" />
            <span className="cc-tagline-dot" />
            <span className="cc-tagline-dot" />
          </div>
        ) : (
          <div className="cc-ready-badge">
            <svg className="cc-check" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <path d="M7.5 12.5L10.5 15.5L16.5 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>All set</span>
          </div>
        )}
 
        <div className="cc-rail" aria-hidden="true">
          {Array.from({ length: pawCount }).map((_, i) => (
            <svg
              key={i}
              className={`cc-pawstep ${i < pawsFilled ? "cc-pawstep--filled" : ""}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="15" r="5" />
              <circle cx="4.5" cy="9" r="2.2" />
              <circle cx="9.5" cy="4.5" r="2.2" />
              <circle cx="14.5" cy="4.5" r="2.2" />
              <circle cx="19.5" cy="9" r="2.2" />
            </svg>
          ))}
          <span className={`cc-pct ${phase === "ready" ? "cc-pct--ready" : ""}`}>
            {phase === "ready" ? "100%" : `${progress}%`}
          </span>
        </div>
      </div>
    </div>
  );
}