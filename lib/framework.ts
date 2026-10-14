import definition from "@/content/framework.json";
export type FrameworkPhase = { id: string; title: string; intent: string; gate: string };
export type FrameworkLane = { id: string; title: string; color: string };
export type FrameworkProcess = { id: string; phase: string; lane: string; label: string; slug: string; output: string; requires: string[] };
export type FrameworkDefinition = { title: string; description: string; phases: FrameworkPhase[]; lanes: FrameworkLane[]; processes: FrameworkProcess[]; foundations: { id: string; label: string; slug: string; output: string }[]; focus: Record<string, string> };
export const framework = definition as FrameworkDefinition;
