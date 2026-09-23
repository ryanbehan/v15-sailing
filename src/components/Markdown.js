import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const ALERTS = { NOTE: 'Note', TIP: 'Tip', IMPORTANT: 'Important', WARNING: 'Warning', CAUTION: 'Caution' };

function normalizeAlerts(markdown) {
  return markdown.replace(/^> \[!(\w+)\]\s*/gm, (_, kind) => `> **${ALERTS[kind.toUpperCase()] || kind}:** `);
}

export default function Markdown({ content, components }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
      {normalizeAlerts(content)}
    </ReactMarkdown>
  );
}
