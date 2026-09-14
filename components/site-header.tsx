import Link from "next/link";
import { BookOpenText, Github } from "lucide-react";
import { SearchBox } from "./search-box";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark"><BookOpenText size={20} /></span>
          <span><strong>FDE</strong><small>Knowledge Base</small></span>
        </Link>
        <div className="header-search"><SearchBox compact /></div>
        <nav aria-label="主导航">
          <Link href="/docs/knowledge-map/">知识地图</Link>
          <a href="https://github.com/loyo-sun/FDE" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a>
        </nav>
      </div>
    </header>
  );
}
