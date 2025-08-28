// Minimal client-side Markdown → HTML preview (no extra deps)
// Supports headings, bold, italic, links, images, code blocks (very basic).
export default function MarkdownPreview({ text }: { text: string }) {
  const html = render(text || '');
  return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}

function esc(s: string){ return s.replace(/[&<>"]/g, (c)=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c] as string)); }
function render(md: string){
  let t = md;
  // images ![alt](url)
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url)=> `<figure><img src="${esc(url)}" alt="${esc(alt)}"/><figcaption>${esc(alt||'')}</figcaption></figure>`);
  // links [text](url)
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, txt, url)=> `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(txt)}</a>`);
  // bold **text**
  t = t.replace(/\*\*([^*]+)\*\*/g, (_m, x)=> `<strong>${esc(x)}</strong>`);
  // italic *text*
  t = t.replace(/\*([^*]+)\*/g, (_m, x)=> `<em>${esc(x)}</em>`);
  // headings
  t = t.replace(/^\s*######\s+(.+)$/gm, '<h6>$1</h6>');
  t = t.replace(/^\s*#####\s+(.+)$/gm, '<h5>$1</h5>');
  t = t.replace(/^\s*####\s+(.+)$/gm, '<h4>$1</h4>');
  t = t.replace(/^\s*###\s+(.+)$/gm, '<h3>$1</h3>');
  t = t.replace(/^\s*##\s+(.+)$/gm, '<h2>$1</h2>');
  t = t.replace(/^\s*#\s+(.+)$/gm, '<h1>$1</h1>');
  // blockquote
  t = t.replace(/^\s*>\s?(.+)$/gm, '<blockquote>$1</blockquote>');
  // code blocks (fenced)
  t = t.replace(/```([\s\S]*?)```/g, (_m, code)=> `<pre><code>${esc(code)}</code></pre>`);
  // paragraphs
  t = t.split(/\n{2,}/).map(p=>{
    if (/^<(h\d|blockquote|pre|figure)/.test(p.trim())) return p;
    return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
  }).join('\n');
  return t;
}

