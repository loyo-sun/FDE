"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/headings";

export function DocToc({ headings, mobile = false }: { headings: Heading[]; mobile?: boolean }) {
  const [active, setActive] = useState("");
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    let frame = 0;
    const elements = headings.map((heading) => document.getElementById(heading.id)).filter((element) => element !== null);
    const update = () => {
      frame = 0;
      const offset = (document.querySelector(".site-header")?.getBoundingClientRect().height ?? 68) + 40;
      let current = "";
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= offset) current = element.id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); cancelAnimationFrame(frame); };
  }, [headings]);
  if (!headings.length) return null;
  const list = <nav aria-label="本页目录"><ol>{headings.map((heading) => <li className={heading.level === 3 ? "toc-subheading" : ""} key={heading.id}><a href={`#${heading.id}`} aria-current={active === heading.id ? "location" : undefined} onClick={() => { if (disclosure.current) disclosure.current.open = false; }}>{heading.title}</a></li>)}</ol></nav>;
  return mobile ? <details className="mobile-toc" ref={disclosure}><summary>本页目录</summary>{list}</details> : <aside className="doc-aside"><h2>本页目录</h2>{list}<a className="toc-top" href="#main-content">回到文章顶部 ↑</a></aside>;
}
