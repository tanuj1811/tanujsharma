import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/ProjectsPrinciples.css";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { text: "Logic Behind Every Pixel",      num: "01" },
  { text: "Simplicity Behind Every Flow",  num: "02" },
  { text: "Purpose Behind Every Feature",  num: "03" },
];

export default function ProjectsPrinciples() {
  const wrapRef    = useRef<HTMLElement>(null);
  const eyeRef     = useRef<HTMLParagraphElement>(null);
  const textRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const numRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const rulerRef   = useRef<HTMLDivElement>(null);
  const footRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const eye   = eyeRef.current;
    const texts = textRefs.current.filter(Boolean) as HTMLSpanElement[];
    const nums  = numRefs.current.filter(Boolean) as HTMLSpanElement[];
    const ruler = rulerRef.current;
    const foot  = footRef.current;
    if (!wrap || !texts.length) return;

    // ── Initial states ──────────────────────────────────────────────
    if (eye)  gsap.set(eye,  { y: 20, autoAlpha: 0 });
    // Text reveal: each span starts translated below its clip container
    gsap.set(texts, { y: "110%", autoAlpha: 1 });
    // Numbers start at "00" opacity — we swap content in onStart
    gsap.set(nums,  { autoAlpha: 0, y: 8 });
    if (ruler) gsap.set(ruler, { scaleX: 0, transformOrigin: "left center" });
    if (foot)  gsap.set(foot,  { y: 20, autoAlpha: 0 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrap, start: "top 72%", once: true },
    });

    // Eyebrow
    if (eye) {
      tl.to(eye, { y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" });
    }

    // Lines — each text reveals upward out of its clip container
    tl.to(
      texts,
      {
        y: "0%",
        duration: 0.85,
        ease: "power4.out",
        stagger: 0.16,
        onStart: function () {
          // Animate the line numbers in parallel
          gsap.to(nums, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.16,
            ease: "power3.out",
          });
        },
      },
      eye ? "-=0.2" : "0",
    );

    // Ruler draws in
    if (ruler) {
      tl.to(ruler, { scaleX: 1, duration: 0.8, ease: "power3.inOut" }, "-=0.35");
    }

    // Footer
    if (foot) {
      tl.to(foot, { y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" }, "-=0.4");
    }

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  return (
    <section className="pp-wrap" ref={wrapRef} aria-label="Design principles">
      <div className="pp-inner">

        <p className="pp-eyebrow" ref={eyeRef}>What drives my work</p>

        <ul className="pp-lines" role="list">
          {lines.map(({ text, num }, i) => (
            <li className="pp-line" key={text}>
              {/* Number — revealed in parallel */}
              <span
                className="pp-num"
                ref={(el) => { numRefs.current[i] = el; }}
                aria-hidden="true"
              >
                {num}
              </span>

              {/* Clip container — overflow:hidden hides the upward-traveling text */}
              <div className="pp-clip">
                <span
                  className="pp-text"
                  ref={(el) => { textRefs.current[i] = el; }}
                >
                  {text}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Ruler line that draws in left → right */}
        <div className="pp-ruler" ref={rulerRef} aria-hidden="true" />

        {/* Footer metadata row */}
        <div className="pp-foot" ref={footRef}>
          {/* <span className="pp-foot-tag">
            Design&nbsp;<span className="pp-foot-arrow">→</span>&nbsp;Development
          </span> */}
          <span className="pp-foot-copy">Clean code. Polished experiences.</span>
        </div>

      </div>
    </section>
  );
}
