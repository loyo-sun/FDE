import Link from "next/link";
import { BookOpenText, Github } from "lucide-react";
import { SearchBox } from "./search-box";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">跳转到正文</a>
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="FDE 从入门到精通首页"><span className="brand-mark"><BookOpenText size={20} /></span><span><strong>FDE</strong><small>从入门到精通</small></span></Link>
        <div className="header-search"><SearchBox /></div>
        <nav aria-label="主导航"><Link href="/docs/knowledge-map/">知识地图</Link><a href="https://github.com/loyo-sun/FDE" target="_blank" rel="noreferrer" aria-label="GitHub 仓库（新窗口）"><Github size={17} /><span>GitHub</span></a></nav>
      </div>
    </header>
  );
}
