"use client";

import { useEffect, useId, useRef, useState } from "react";

export type DiagramStep = { id: string; title: string; summary: string };

export function ArticleDiagram({ title, slug, steps }: { title: string; slug: string; steps: DiagramStep[] }) {
  const [active, setActive] = useState(steps[0]?.id ?? "");
  const panel = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const index = Math.max(0, steps.findIndex(step => step.id === active));

  useEffect(() => {
    let frame = 0;
    const header = document.querySelector<HTMLElement>(".site-header");
    const article = panel.current?.closest<HTMLElement>(".doc-article");
    const update = () => {
      frame = 0;
      const headerHeight = header?.getBoundingClientRect().height ?? 68;
      const offset = headerHeight + (panel.current?.getBoundingClientRect().height ?? 160) + 24;
      article?.style.setProperty("--reading-offset", `${offset}px`);
      article?.style.setProperty("--header-height", `${headerHeight}px`);
      let current = steps[0]?.id ?? "";
      for (const step of steps) {
        const element = document.getElementById(step.id);
        if (element && element.getBoundingClientRect().top <= offset + 4) current = step.id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    if (header) observer.observe(header);
    if (panel.current) observer.observe(panel.current);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      article?.style.removeProperty("--reading-offset");
      article?.style.removeProperty("--header-height");
    };
  }, [steps]);

  useEffect(() => {
    const element = strip.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollTo({ left: Math.max(0, index * 220 - (element.clientWidth - 210) / 2), behavior: reduced ? "instant" : "smooth" });
  }, [index]);

  if (!steps.length) return null;
  return (
    <nav className="reading-map" ref={panel} aria-label="随阅读高亮的章节图解" data-active-section={active}>
      <div className="reading-map-header"><span>章节图解 <strong>{String(index + 1).padStart(2, "0")} / {steps.length}</strong></span><a href={`/diagrams/articles/${slug}.svg`} target="_blank" rel="noreferrer">查看全图 ↗</a></div>
      <div className="reading-strip" ref={strip}>
        <svg width={steps.length * 220} height="140" viewBox={`0 0 ${steps.length * 220} 140`} role="img" aria-labelledby={titleId}>
          <title id={titleId}>{title}章节图解；当前：{steps[index].title}。点击板块跳转对应章节。</title>
          {steps.map((step, i) => {
            const selected = active === step.id;
            const x = i * 220 + 6;
            return <g key={step.id} data-step={step.id} data-active={selected ? "true" : "false"}>
              <a href={`#${step.id}`} aria-label={`跳转至${step.title}`} aria-current={selected ? "location" : undefined} onClick={() => setActive(step.id)}>
                <title>{step.title}：{step.summary}</title>
                <rect className="diagram-node" x={x} y="5" width="200" height="108" rx="10" />
                <text className="diagram-step-number" x={x + 14} y="27">PART {String(i + 1).padStart(2, "0")}</text>
                <text className="diagram-step-title" x={x + 14} y="50">{step.title.slice(0, 11)}</text>
                <text className="diagram-step-title" x={x + 14} y="70">{step.title.slice(11, 22)}</text>
                <text className="diagram-step-summary" x={x + 14} y="94">{step.summary.slice(0, 15)}{step.summary.length > 15 ? "…" : ""}</text>
              </a>
              {i < steps.length - 1 && <path d={`M${x + 204} 57 h12 m-5 -5 5 5 -5 5`} fill="none" stroke="#83afb2" strokeWidth="1.5" aria-hidden="true" />}
            </g>;
          })}
          <text x={index * 220 + 20} y="132" fill="#637e84" fontSize="10">来源：FDE 原创 · Codex 绘制</text>
        </svg>
      </div>
    </nav>
  );
}
