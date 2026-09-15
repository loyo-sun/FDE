export type Heading = { id: string; title: string; level: number };
type Node = { type: string; tagName?: string; value?: string; properties?: { id?: unknown }; children?: Node[] };

// Runs after rehype-slug so the table of contents uses exactly the rendered IDs,
// including duplicate titles, punctuation, Chinese text and inline formatting.
export function collectHeadings({ headings }: { headings: Heading[] }) {
  function text(node: Node): string {
    return node.value ?? node.children?.map(text).join("") ?? "";
  }
  return (tree: Node) => {
    function visit(node: Node) {
      if ((node.tagName === "h2" || node.tagName === "h3") && typeof node.properties?.id === "string") {
        headings.push({ id: node.properties.id, title: text(node), level: Number(node.tagName[1]) });
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
