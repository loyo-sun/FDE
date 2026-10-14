"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type FrameworkContextData = { focusColumn?: number; width: number; height: number; title: string; alt: string; processId: string | null; kind: string; phase?: string; lane?: string; output?: string; image: string };

export function FrameworkContextView({ primary, alternatives }: { primary: FrameworkContextData; alternatives: FrameworkContextData[] }) {
  const viewport = useRef<HTMLAnchorElement>(null);
  const [selected, setSelected] = useState<string | null>(primary.processId);
  useEffect(() => {
    const locate = () => {
      const hash = window.location.hash.slice(1);
      const id = hash.startsWith("context-") ? hash.slice(8) : null;
      if (hash.startsWith("context-")) setSelected(alternatives.some(item => item.processId === id) ? id : primary.processId);
      else if (!hash) setSelected(primary.processId);
    };
    locate(); window.addEventListener("hashchange", locate);
    return () => window.removeEventListener("hashchange", locate);
  }, [primary.processId, alternatives]);
  const context = alternatives.find(item => item.processId === selected) ?? primary;
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const image = element.querySelector("img");
    const center = () => {
      if (!image) return;
      const column = context.focusColumn ?? 0;
      const centerX = context.kind === "foundation" ? 24 + column * 292 + 135 : 132 + column * 374 + 187;
      element.scrollLeft = Math.max(0, image.clientWidth * centerX / context.width - element.clientWidth / 2);
    };
    const observer = new ResizeObserver(center); observer.observe(element);
    image?.addEventListener("load", center); center();
    return () => { observer.disconnect(); image?.removeEventListener("load", center); };
  }, [context]);
  const target = context.processId?.startsWith("foundation:") ? "framework-foundations" : `process-${context.processId}`;
  return <figure className="framework-context" aria-label="当前主题的局部知识框架" data-framework-process={context.processId}>
    <div className="framework-context-heading"><span>{context.kind === "foundation" ? "贯穿交付全程的基础能力" : `${context.phase} / ${context.lane}`}</span><Link href={`/docs/knowledge-map/#${target}`}>定位整体框架 ↗</Link></div>
    <a ref={viewport} href={context.image} target="_blank" rel="noreferrer" aria-label={`放大${context.title}的局部知识框架`}><img src={context.image} alt={context.alt} width={context.width} height={context.height} loading="eager" /></a>
  </figure>;
}
