export function splitMarkdownIntoPages(content: string | null | undefined): string[] {
  if (!content?.trim()) {
    return [];
  }

  return content
    .split(/<!--\s*page\s*-->/i)
    .map((page) => page.trim())
    .filter(Boolean);
}
