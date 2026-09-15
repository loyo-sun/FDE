"use client";

import { Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { statusLabels } from "@/lib/content-status";

type SearchDoc = {
  title: string; description: string; content: string; url: string;
  tags: string[]; status: keyof typeof statusLabels;
};

let indexPromise: Promise<SearchDoc[]> | undefined;
function loadIndex() {
  indexPromise ??= fetch("/content.json")
    .then((response) => { if (!response.ok) throw new Error("Search unavailable"); return response.json(); })
    .catch((error) => { indexPromise = undefined; throw error; });
  return indexPromise;
}

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [shortcut, setShortcut] = useState("Ctrl K");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const trimmed = query.trim();

  function retry() {
    setState("loading");
    loadIndex().then((data) => { setDocs(data); setState("ready"); }).catch(() => setState("error"));
  }

  useEffect(() => {
    let mounted = true;
    loadIndex().then((data) => { if (mounted) { setDocs(data); setState("ready"); } }).catch(() => { if (mounted) setState("error"); });
    setShortcut(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ K" : "Ctrl K");
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); inputRef.current?.focus(); setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { mounted = false; window.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, []);

  useEffect(() => { setOpen(false); setQuery(""); setActive(-1); }, [pathname]);

  const matches = useMemo(() => {
    const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return docs.map((doc) => {
      const title = doc.title.toLowerCase();
      const haystack = `${title} ${doc.description} ${doc.tags.join(" ")} ${doc.content}`.toLowerCase();
      const score = terms.every((term) => haystack.includes(term))
        ? terms.reduce((total, term) => total + (title.includes(term) ? 5 : 1), 0) : 0;
      return { doc, score };
    }).filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || Number(a.doc.status === "outline") - Number(b.doc.status === "outline"));
  }, [docs, trimmed]);
  const results = matches.slice(0, 8);
  const visible = open && Boolean(trimmed);
  useEffect(() => {
    if (active >= 0) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div className="search-root search-compact" ref={rootRef} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
      <Search aria-hidden="true" size={18} />
      <input ref={inputRef} role="combobox" aria-label="搜索知识库" aria-autocomplete="list" aria-expanded={visible}
        aria-controls={visible && state === "ready" ? `${id}-list` : undefined}
        aria-activedescendant={visible && active >= 0 && results[active] ? `${id}-${active}` : undefined}
        value={query} placeholder="搜索主题、问题或方法…"
        onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) return;
          if (event.key === "Escape") { event.preventDefault(); setOpen(false); setActive(-1); }
          if ((event.key === "ArrowDown" || event.key === "ArrowUp") && results.length) {
            event.preventDefault(); setOpen(true);
            setActive((current) => event.key === "ArrowDown" ? (current + 1) % results.length : (current <= 0 ? results.length - 1 : current - 1));
          }
          if (event.key === "Enter" && visible && results.length) {
            event.preventDefault(); setOpen(false); router.push(results[Math.max(0, active)].doc.url);
          }
        }} />
      {query ? <button type="button" className="search-clear" aria-label="清除搜索" onClick={() => { setQuery(""); setActive(-1); inputRef.current?.focus(); }}><X size={17} /></button> : <kbd aria-hidden="true">{shortcut}</kbd>}
      {visible && <div className="search-results">
        <div className="search-results-label" role="status">{state === "loading" ? "正在加载搜索索引…" : state === "error" ? "搜索暂时不可用" : matches.length ? `找到 ${matches.length} 条相关内容${matches.length > 8 ? "，显示前 8 条" : ""}` : "没有匹配内容"}</div>
        {state === "error" && <p>请检查网络后<button type="button" onClick={retry}>重试</button>，或<LinkFallback /></p>}
        {state === "ready" && <div className="search-result-list" id={`${id}-list`} role="listbox" aria-label="搜索结果" ref={listRef}>
          {results.map(({ doc }, index) => <a role="option" aria-selected={active === index} id={`${id}-${index}`} href={doc.url} key={doc.url} className={active === index ? "selected" : ""} onClick={() => setOpen(false)}>
            <strong>{doc.title}<span className={`status-badge ${doc.status}`}>{statusLabels[doc.status]}</span></strong><span>{doc.description}</span>
          </a>)}
        </div>}
        {state === "ready" && !results.length && <p>尝试“客户访谈”“RAG”或更短的关键词。</p>}
      </div>}
    </div>
  );
}

function LinkFallback() { return <a href="/docs/knowledge-map/">浏览知识地图</a>; }
