import type { ArticleBlock } from '@/lib/articles';

export default function ContentBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <h2 key={i} className="text-xl md:text-2xl font-bold text-primary-dark pt-4">
              {block.text}
            </h2>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="list-disc pe-5 space-y-2 text-[#555]">
              {block.items.map((item, j) => (
                <li key={j} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-base text-[#555] leading-loose">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
