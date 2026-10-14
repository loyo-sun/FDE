"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { framework } from "@/lib/framework";

export function KnowledgeFramework() {
  const [phase, setPhase] = useState("all");
  const [lane, setLane] = useState("all");
  const [current, setCurrent] = useState("");
  const [showOutputs, setShowOutputs] = useState(false);
  useEffect(() => {
    const locate = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith("process-") && framework.processes.some(p => p.id === hash.slice(8))) {
        setCurrent(hash.slice(8)); setPhase("all"); setLane("all");
      }
    };
    locate(); window.addEventListener("hashchange", locate);
    return () => window.removeEventListener("hashchange", locate);
  }, []);
  const phases = framework.phases.filter(p => phase === "all" || p.id === phase);
  const lanes = framework.lanes.filter(l => lane === "all" || l.id === lane);
  const selected = framework.processes.find(p => p.id === current);
  const reset = () => { setPhase("all"); setLane("all"); setCurrent(""); window.history.replaceState(null, "", "#framework"); };
  return <section className="knowledge-framework" id="framework" aria-labelledby="framework-title">
    <header className="framework-intro"><div><span className="eyebrow">FDE DELIVERY PROCESS MAP</span><h2 id="framework-title">先看全局，再进入具体工作</h2><p>横向看能力领域，纵向看交付阶段。每张卡片是一项工作及其产出，点击进入对应内容。</p></div><a href="/diagrams/fde-framework.svg" target="_blank" rel="noreferrer">查看完整大图 ↗</a></header>
    <div className="framework-controls"><label>交付阶段<select aria-label="筛选框架阶段" value={phase} onChange={event => { setPhase(event.target.value); setCurrent(""); }}><option value="all">六个阶段 · 全景</option>{framework.phases.map(p => <option value={p.id} key={p.id}>{p.title}</option>)}</select></label><label>能力领域<select aria-label="筛选框架领域" value={lane} onChange={event => { setLane(event.target.value); setCurrent(""); }}><option value="all">七个领域 · 全景</option>{framework.lanes.map(l => <option value={l.id} key={l.id}>{l.title}</option>)}</select></label><button type="button" onClick={reset}>恢复全景</button><button type="button" aria-pressed={showOutputs} onClick={() => setShowOutputs(value => !value)}>{showOutputs ? "隐藏产出" : "显示产出"}</button><span role="status">{phases.length} 个阶段 × {lanes.length} 个领域 · {framework.processes.filter(p => phases.some(s => s.id === p.phase) && lanes.some(l => l.id === p.lane)).length} 项工作</span></div>
    {selected && <div className="framework-location" role="status"><strong>你在这里：{selected.label}</strong><span>产出：{selected.output}</span>{selected.requires.length > 0 && <span>前置：{selected.requires.map((id, i) => { const p = framework.processes.find(p => p.id === id)!; return <span key={id}>{i > 0 && " · "}<Link href={`/docs/${p.slug}/#context-${p.id}`}>{p.label}</Link></span>; })}</span>}<button type="button" aria-label="清除框架位置标记" onClick={() => setCurrent("")}>×</button></div>}
    <div className="framework-scroll" tabIndex={0} role="region" aria-label="FDE 阶段与能力矩阵，可横向和纵向滚动">
      <table className={`framework-matrix ${showOutputs ? "show-outputs" : "is-compact"}`} style={{ minWidth: `${160 + lanes.length * 146}px` }}><caption className="sr-only">FDE 知识框架：六个交付阶段、七个能力领域和每项工作的产出</caption><thead><tr><th scope="col" className="framework-axis">交付阶段 ↓<small>能力领域 →</small></th>{lanes.map(l => <th scope="col" key={l.id} style={{ "--lane-color": l.color } as CSSProperties}>{l.title}</th>)}</tr></thead><tbody>{phases.map(p => <tr key={p.id} data-phase={p.id}><th scope="row"><span>{String(framework.phases.findIndex(s => s.id === p.id) + 1).padStart(2, "0")}</span><strong>{p.title}</strong><small>{p.intent}</small><details><summary>阶段门禁</summary><p>{p.gate}</p></details></th>{lanes.map(l => <td key={l.id} data-lane={l.id} style={{ "--lane-color": l.color } as CSSProperties}>{framework.processes.filter(process => process.phase === p.id && process.lane === l.id).map(process => <Link id={`process-${process.id}`} key={process.id} href={`/docs/${process.slug}/#context-${process.id}`} className={`framework-process ${current === process.id ? "is-current" : ""}`} aria-current={current === process.id ? "location" : undefined} data-process={process.id}><strong>{process.label}</strong><span>{process.output}</span></Link>)}</td>)}</tr>)}</tbody></table>
    </div>
    <p className="framework-use-note">阶段可以往返迭代；同一能力会在多个阶段使用。按项目选择适用工作，AI 相关活动按需启用。</p>
    <div className="framework-foundations" id="framework-foundations"><div><span className="eyebrow">FOUNDATION</span><h3>支撑全程的基础能力</h3></div>{framework.foundations.map(base => <Link href={`/docs/${base.slug}/`} key={base.id}><strong>{base.label}</strong><span>{base.output}</span></Link>)}</div>
  </section>;
}
