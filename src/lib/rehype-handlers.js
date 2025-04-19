// rehype-handlers.js (or inline in your processor setup)

import { h } from 'hastscript'; // Helper for creating HAST (HTML AST) nodes

export const inlineAsideFootnoteHandlers = {
  // Handler for the reference: [%note] -> <sup><a href="#aside-fn-def-1" id="aside-fn-ref-1-1">[1]</a></sup>
  // (No changes needed for the reference handler)
  asideFootnoteReference: (state, node) => {
    const number = node.number ?? 'ERR';
    const identifier = node.identifier;
    const referenceInstance = node.referenceInstance ?? 1;

    const defId = `aside-fn-def-${number}`; // Use span ID now
    const refId = `aside-fn-ref-${number}-${referenceInstance}`;

    // Optional: Add a class to the sup wrapper if needed for styling interactions
    return h('sup', { className: 'aside-footnote-ref-wrapper' }, [
      h('a', {
        href: `#${defId}`, // Points to the definition span ID
        id: refId,
        className: ['aside-footnote-ref'],
        role: 'doc-noteref',
        'aria-describedby': 'aside-footnote-label-' + number, // Points to label within the definition span
        'data-footnote-identifier': identifier,
        'data-footnote-instance': referenceInstance,
      }, `[${number}]`)
    ]);
  },

  // Handler for the definition: (inserted inline) -> <span id="aside-fn-def-1" class="aside-footnote-def">...</span>
  asideFootnoteDefinition: (state, node) => {
    const number = node.number ?? 'ERR';
    const identifier = node.identifier;
    const defId = `aside-fn-def-${number}`; // ID for this definition span
    const firstRefId = `aside-fn-ref-${number}-1`; // ID of the first reference

    // Process the content of the footnote definition
    const content = state.all(node);

    // Create the visually hidden label for aria-describedby
    // Note: Putting block-like content inside this label might be problematic depending on CSS. Keep it simple.
    const label = h('span', { id: `aside-footnote-label-${number}`, className: 'visually-hidden' }, `Footnote ${number}`);

    // Back-reference link
    const backReference = h('a', {
        href: `#${firstRefId}`,
        className: ['aside-footnote-backref'],
        role: 'doc-backlink',
        'aria-label': `Back to first reference for footnote ${number}`,
    }, '↩');

    // Assemble children for the span
    // We include the hidden label first for accessibility hookup.
    const childrenToRender = [
        label, // Important for aria-describedby on the link
        h('span', {className: 'aside-footnote-number'}, `${number}. `),
        ...content, // The main definition content
        ' ',
        backReference
    ];

    // *** Use span instead of aside ***
    return h('span', { // <--- Changed from 'aside' to 'span'
      id: defId,
      className: ['aside-footnote-def', 'inline-aside-footnote'], // Keep classes for styling
      // Use role="note" to add semantics back for assistive tech
      role: 'note',
      'data-footnote-identifier': identifier,
    }, childrenToRender);
  },
};
