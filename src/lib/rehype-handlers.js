// rehype-handlers.js (or inline in your processor setup)

import { h } from 'hastscript'; // Helper for creating HAST (HTML AST) nodes

export const asideFootnoteHandlers = {
  // Handler for the reference: [%note] -> <sup><a href="#aside-fn-def-1" id="aside-fn-ref-1">[1]</a></sup>
  asideFootnoteReference: (state, node) => {
    const number = node.number ?? 'ERR'; // Use number assigned by remark plugin
    const identifier = node.identifier; // Keep identifier if needed, maybe for data attributes
    const defId = `aside-fn-def-${number}`; // ID of the definition it points to
    const refId = `aside-fn-ref-${number}`; // ID of this reference itself

    return h('sup', [ // Wrap in superscript
        h('a', {
            href: `#${defId}`,
            id: refId,
            className: ['aside-footnote-ref'], // Optional class for styling
            role: 'doc-noteref',
            'aria-describedby': defId, // Link description for accessibility
            'data-footnote-identifier': identifier, // Optional data attribute
        }, `[${number}]`) // Displayed text like [1]
    ]);
  },

  // Handler for the definition: [%note]: ... -> <aside id="aside-fn-def-1">...</aside>
  asideFootnoteDefinition: (state, node) => {
    const number = node.number ?? 'ERR';
    const identifier = node.identifier;
    const defId = `aside-fn-def-${number}`; // ID for this definition
    const refId = `aside-fn-ref-${number}`; // ID of the corresponding reference

    // Create the back-reference link (optional but good practice)
    const backReference = h('a', {
        href: `#${refId}`,
        className: ['aside-footnote-backref'], // Optional class
        role: 'doc-backlink',
        'aria-label': `Back to reference ${number}`,
    }, '↩'); // Use an arrow or similar symbol

    // Process the content of the footnote definition
    const content = state.all(node); // Convert child mdast nodes to hast

    // Optional: Add the number and backlink *inside* the aside
    // Adjust structure as needed (e.g., wrap content in a div)
    const children = [
        h('span', { className: 'aside-footnote-number'}, `${number}. `), // Display number
        ...content, // The main content
        ' ', // Space before backlink
        backReference
    ];


    return h('aside', {
        id: defId,
        className: ['aside-footnote-def'], // Optional class
        role: 'doc-endnote', // Appropriate ARIA role
        'data-footnote-identifier': identifier, // Optional data attribute
    }, children); // Place content and backlink inside the aside
  },
};