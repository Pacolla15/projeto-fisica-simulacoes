import { describe, it, expect } from 'vitest';
import { renderMarkdownWithMath } from './MarkdownMathRenderer';

describe('MarkdownMathRenderer - Formatação e KaTeX', () => {
  it('deve converter negrito **texto** em <strong>texto</strong>', () => {
    const raw = 'A **distância percorrida** é escalar.';
    const html = renderMarkdownWithMath(raw);
    expect(html).toContain('<strong>distância percorrida</strong>');
    expect(html).not.toContain('**');
  });

  it('deve converter fórmula em linha $...$ em HTML KaTeX', () => {
    const raw = 'O símbolo ($d$) representa distância.';
    const html = renderMarkdownWithMath(raw);
    expect(html).toContain('class="katex"');
    expect(html).not.toContain('$d$');
  });

  it('deve converter bloco matemático $$...$$ em KaTeX display mode', () => {
    const raw = '$$\\Delta s = s_f - s_0$$';
    const html = renderMarkdownWithMath(raw);
    expect(html).toContain('class="math-display"');
    expect(html).toContain('class="katex-display"');
    expect(html).not.toContain('$$\\Delta s');
  });

  it('deve processar listas com marcadores e sublistas aninhadas', () => {
    const raw = `- Item Principal:
  - Subitem 1
  - Subitem 2`;
    const html = renderMarkdownWithMath(raw);
    expect(html).toContain('<ul class="theory-list">');
    expect(html).toContain('<li>Item Principal:</li>');
    expect(html).toContain('<ul class="theory-sublist">');
    expect(html).toContain('<li>Subitem 1</li>');
  });

  it('deve formatar perfeitamente o parágrafo reportado pelo usuário', () => {
    const raw = `A **distância percorrida** ($d$) é uma grandeza escalar sempre positiva (ou nula) que mede o comprimento total da trajetória efetivamente percorrida.
- Se um móvel sai de $s = 0\\text{ m}$, avança até $s = 80\\text{ m}$ e depois recua para $s = 30\\text{ m}$:
  - O deslocamento é: $\\Delta s = 30 - 0 = +30\\text{ m}$.
  - A distância total percorrida é: $d = 80 + |30 - 80| = 80 + 50 = 130\\text{ m}$.`;

    const html = renderMarkdownWithMath(raw);
    // Não deve conter asteriscos crus
    expect(html).not.toContain('**');
    // Não deve conter dólares crus
    expect(html).not.toContain('$d$');
    expect(html).not.toContain('$s = 0');
    // Deve conter tags semânticas
    expect(html).toContain('<strong>distância percorrida</strong>');
    expect(html).toContain('<ul class="theory-list">');
    expect(html).toContain('<ul class="theory-sublist">');
    expect(html).toContain('class="katex"');
  });
});
