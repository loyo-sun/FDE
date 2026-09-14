"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchDoc = {
  title: string;
  description: string;
  content: string;
  url: string;
  category: string;
  tags: string[];
};

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/content.json").then((response) => response.json()).then(setDocs).catch(() => setDocs([]));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        rootRef.current?.querySelector("input")?.focus();
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return docs
      .map((doc) => {
        const title = doc.title.toLowerCase();
        const haystack = `${doc.title} ${doc.description} ${doc.tags.join(" ")} ${doc.content}`.toLowerCase();
        const score = terms.reduce((total, term) => total + (title.includes(term) ? 5 : 0) + (haystack.includes(term) ? 1 : 0), 0);
        return { doc, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [docs, query]);

  return (
    <div className={`search-root ${compact ? "search-compact" : ""}`} ref={rootRef}>
      <Search aria-hidden="true" size={compact ? 18 : 21} />
      <input
        aria-label="搜索知识库"
        value={query}
        onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="搜索故障、交付流程、RAG、验收标准…"
      />
      {query ? (
        <button className="search-clear" aria-label="清除搜索" onClick={() => setQuery("")}><X size={17} /></button>
      ) : <kbd>⌘K</kbd>}
      {open && query && (
        <div className="search-results">
          <div className="search-results-label">{results.length ? `找到 ${results.length} 条相关内容` : "没有匹配内容"}</div>
          {results.map(({ doc }) => (
            <a href={doc.url} key={doc.url} onClick={() => setOpen(false)}>
              <strong>{doc.title}</strong>
              <span>{doc.description}</span>
            </a>
          ))}
          {!results.length && <p>尝试产品名称、错误码或更短的关键词。</p>}
        </div>
      )}
    </div>
  );
}
