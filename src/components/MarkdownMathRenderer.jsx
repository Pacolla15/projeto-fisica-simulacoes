import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * Renderizador de Markdown enriquecido com fórmulas KaTeX (em bloco $$...$$ e em linha $...$)
 */
export function renderMarkdownWithMath(rawText) {
  if (!rawText) return '';

  const mathBlocks = [];
  const mathInlines = [];

  // 1. Extrair e pré-renderizar blocos matemáticos KaTeX: $$...$$
  let text = rawText.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    let rendered;
    try {
      rendered = katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false
      });
    } catch {
      rendered = `<div class="math-error">${math}</div>`;
    }
    const placeholder = `__MATH_BLOCK_${mathBlocks.length}__`;
    mathBlocks.push(`<div class="math-display">${rendered}</div>`);
    return `\n\n${placeholder}\n\n`;
  });

  // 2. Extrair e pré-renderizar matemática KaTeX em linha: $...$
  text = text.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    let rendered;
    try {
      rendered = katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false
      });
    } catch {
      rendered = `<span class="math-error">${math}</span>`;
    }
    const placeholder = `__MATH_INLINE_${mathInlines.length}__`;
    mathInlines.push(rendered);
    return placeholder;
  });

  // Função auxiliar para formatar texto em linha (negrito, itálico e restauração do KaTeX inline)
  const formatInlineText = (str) => {
    return str
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^\*]+?)\*/g, '<em>$1</em>')
      .replace(/__MATH_INLINE_(\d+)__/g, (_, idx) => mathInlines[Number(idx)] || '');
  };

  // 3. Processar blocos de linhas
  const lines = text.split('\n');
  const htmlParts = [];
  let inList = false;
  let listType = null; // 'ul' | 'ol'
  let listLevel = 0; // 0 ou 1 para sublistas
  let paragraphBuffer = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      const pText = paragraphBuffer.join(' ').trim();
      if (pText) {
        htmlParts.push(`<p class="theory-paragraph">${formatInlineText(pText)}</p>`);
      }
      paragraphBuffer = [];
    }
  };

  const closeList = () => {
    if (inList) {
      if (listLevel > 0) {
        htmlParts.push(`</ul></li>`);
        listLevel = 0;
      }
      htmlParts.push(`</${listType}>`);
      inList = false;
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Linha vazia
    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    // Bloco de equação KaTeX independente
    const blockMatch = trimmed.match(/^__MATH_BLOCK_(\d+)__$/);
    if (blockMatch) {
      flushParagraph();
      closeList();
      const idx = Number(blockMatch[1]);
      htmlParts.push(mathBlocks[idx] || '');
      continue;
    }

    // Título H3: ### ...
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      closeList();
      const headingText = trimmed.replace(/^###\s+/, '');
      htmlParts.push(`<h3 class="theory-subheading">${formatInlineText(headingText)}</h3>`);
      continue;
    }

    // Subitem de Lista Não-Ordenada com indentação: "  - "
    const isSubBullet = rawLine.startsWith('  - ') || rawLine.startsWith('    - ');
    const isMainBullet = trimmed.startsWith('- ') && !isSubBullet;

    if (isSubBullet || isMainBullet) {
      flushParagraph();
      if (!inList || listType !== 'ul') {
        closeList();
        inList = true;
        listType = 'ul';
        htmlParts.push(`<ul class="theory-list">`);
      }

      if (isSubBullet) {
        const itemText = trimmed.replace(/^-\s+/, '');
        if (listLevel === 0) {
          listLevel = 1;
          htmlParts.push(`<li style="list-style: none;"><ul class="theory-sublist">`);
        }
        htmlParts.push(`<li>${formatInlineText(itemText)}</li>`);
      } else {
        if (listLevel > 0) {
          htmlParts.push(`</ul></li>`);
          listLevel = 0;
        }
        const itemText = trimmed.replace(/^-\s+/, '');
        htmlParts.push(`<li>${formatInlineText(itemText)}</li>`);
      }
      continue;
    }

    // Item de Lista Numerada: "1. ", "2. ", etc.
    const isNumbered = /^\d+\.\s+/.test(trimmed);
    if (isNumbered) {
      flushParagraph();
      if (!inList || listType !== 'ol') {
        closeList();
        inList = true;
        listType = 'ol';
        htmlParts.push(`<ol class="theory-ordered-list">`);
      }
      const itemText = trimmed.replace(/^\d+\.\s+/, '');
      htmlParts.push(`<li>${formatInlineText(itemText)}</li>`);
      continue;
    }

    // Linha de texto comum (acumula no parágrafo corrente)
    closeList();
    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  closeList();

  return htmlParts.join('\n');
}

export default function MarkdownMathRenderer({ content }) {
  const htmlContent = useMemo(() => {
    return renderMarkdownWithMath(content);
  }, [content]);

  return (
    <div
      className="theory-rich-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
