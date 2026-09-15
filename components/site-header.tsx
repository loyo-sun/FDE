import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { SearchBox } from "./search-box";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">跳转到正文</a>
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="FDE 从入门到精通首页"><span className="brand-mark"><BookOpenText size={20} /></span><span><strong>FDE</strong><small>从入门到精通</small></span></Link>
        <div className="header-search"><SearchBox /></div>
        <nav aria-label="主导航"><Link href="/docs/knowledge-map/">知识地图</Link><Link href="/#learning-paths">学习路线</Link></nav>
      </div>
    </header>
  );
}
