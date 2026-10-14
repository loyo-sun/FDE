import diagrams from "@/content/article-diagrams.json";
import processDiagrams from "@/content/process-diagrams.json";
import { framework } from "@/lib/framework";
import { FrameworkContextView, type FrameworkContextData } from "./framework-context-view";

type Definition = Omit<FrameworkContextData, "image">;

export function FrameworkContext({ slug }: { slug: string }) {
  const primary = (diagrams as Record<string, Definition>)[slug];
  if (!primary || primary.kind === "overview") return null;
  const alternatives = framework.processes.filter(item => item.slug === slug).map(item => ({ ...(processDiagrams as Record<string, Definition>)[item.id], image: `/diagrams/processes/${item.id}.svg` }));
  return <FrameworkContextView primary={{ ...primary, image: `/diagrams/articles/${slug}.svg` }} alternatives={alternatives} />;
}
