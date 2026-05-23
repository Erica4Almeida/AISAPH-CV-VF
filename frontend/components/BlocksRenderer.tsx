type TextNode = {
  type: 'text'
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

type LinkNode = {
  type: 'link'
  url: string
  children: TextNode[]
}

type InlineNode = TextNode | LinkNode

type Block =
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; children: InlineNode[] }
  | { type: 'list'; format: 'ordered' | 'unordered'; children: { type: 'list-item'; children: InlineNode[] }[] }
  | { type: 'quote'; children: InlineNode[] }
  | { type: 'code'; children: InlineNode[] }
  | { type: 'image'; image: { url: string; alternativeText?: string }; children: InlineNode[] }

function renderInline(node: InlineNode, idx: number): React.ReactNode {
  if (node.type === 'link') {
    return (
      <a key={idx} href={node.url} target="_blank" rel="noopener noreferrer" className="blocks-link">
        {node.children.map((c, i) => renderInline(c, i))}
      </a>
    )
  }
  let el: React.ReactNode = node.text
  if (node.bold)          el = <strong key={idx}>{el}</strong>
  if (node.italic)        el = <em key={idx}>{el}</em>
  if (node.underline)     el = <u key={idx}>{el}</u>
  if (node.strikethrough) el = <s key={idx}>{el}</s>
  if (node.code)          el = <code key={idx} className="blocks-inline-code">{el}</code>
  return <span key={idx}>{el}</span>
}

export default function BlocksRenderer({ content }: { content: unknown }) {
  if (!content) return null

  let blocks: Block[]
  if (typeof content === 'string') {
    try { blocks = JSON.parse(content) } catch { return <div dangerouslySetInnerHTML={{ __html: content }} /> }
  } else if (Array.isArray(content)) {
    blocks = content as Block[]
  } else {
    return null
  }

  return (
    <div className="blocks-wrapper legal-content">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={idx} className="blocks-p">
                {block.children.map((c, i) => renderInline(c, i))}
              </p>
            )
          case 'heading': {
            const Tag = `h${block.level}` as keyof React.JSX.IntrinsicElements
            return (
              <Tag key={idx} className={`blocks-h${block.level}`}>
                {block.children.map((c, i) => renderInline(c, i))}
              </Tag>
            )
          }
          case 'list': {
            const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
            return (
              <ListTag key={idx} className="blocks-list">
                {block.children.map((item, i) => (
                  <li key={i} className="blocks-li">
                    {item.children.map((c, j) => renderInline(c, j))}
                  </li>
                ))}
              </ListTag>
            )
          }
          case 'quote':
            return (
              <blockquote key={idx} className="blocks-blockquote">
                {block.children.map((c, i) => renderInline(c, i))}
              </blockquote>
            )
          case 'code':
            return (
              <pre key={idx} className="blocks-pre">
                <code className="blocks-code">
                  {block.children.map((c, i) => renderInline(c, i))}
                </code>
              </pre>
            )
          case 'image':
            return (
              <img key={idx} src={block.image.url} alt={block.image.alternativeText ?? ''} className="blocks-img" />
            )
          default:
            return null
        }
      })}
    </div>
  )
}
