import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content?: string | null;
};

type MarkdownNode = {
  type?: string;
  tagName?: string;
  children?: MarkdownNode[];
};

function containsImageNode(node: unknown): boolean {
  const currentNode = node as MarkdownNode | undefined;

  if (!currentNode?.children) {
    return false;
  }

  return currentNode.children.some((child) => {
    if (child.type === "element" && child.tagName === "img") {
      return true;
    }

    return containsImageNode(child);
  });
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) {
    return null;
  }

  return (
    <div className="space-y-4 text-[0.98rem] leading-8 text-[#556274]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="pt-2 text-2xl font-bold text-[#31425a]">{children}</h1>
          ),

          h2: ({ children }) => (
            <h2 className="pt-4 text-xl font-bold text-[#31425a]">{children}</h2>
          ),

          h3: ({ children }) => (
            <h3 className="pt-3 text-lg font-bold text-[#31425a]">{children}</h3>
          ),

          p: ({ node, children }) => {
            if (containsImageNode(node)) {
              return <div className="my-6">{children}</div>;
            }

            return <p className="text-[0.98rem] leading-8 text-[#556274]">{children}</p>;
          },

          ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,

          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,

          blockquote: ({ children }) => (
            <blockquote className="rounded-2xl border-l-4 border-[#31425a] bg-[#f8fafc] px-4 py-3 italic text-[#31425a]">
              {children}
            </blockquote>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-[#31425a]">{children}</strong>
          ),

          img: ({ src, alt }) => {
            const imageSrc = typeof src === "string" ? src : "";

            if (!imageSrc) {
              return null;
            }

            return (
              <figure className="my-8">
                <div className="relative mx-auto h-128 max-h-[70vh] w-full overflow-hidden rounded-2xl border border-[#e8edf3] bg-white shadow-sm">
                  <Image
                    src={imageSrc}
                    alt={alt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 896px, 100vw"
                    className="object-contain"
                  />
                </div>

                {alt ? (
                  <figcaption className="mt-2 text-center text-xs italic text-[#8a97a6]">
                    {alt}
                  </figcaption>
                ) : null}
              </figure>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
