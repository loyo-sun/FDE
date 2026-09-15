import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="not-found"><span>404</span><h1>这篇文档不存在</h1><p>它可能已更名、移动或尚未发布。</p><Link href="/">返回知识库</Link></main>;
}
