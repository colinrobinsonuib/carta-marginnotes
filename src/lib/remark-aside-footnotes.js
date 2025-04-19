import { visit } from 'unist-util-visit';
import { remove } from 'unist-util-remove';
import { findAfter } from 'unist-util-find-after';
import { toString } from 'mdast-util-to-string';

const C_PERCENT = 37; // '%'
const C_BRACKET_OPEN = 91; // '['
const C_BRACKET_CLOSE = 93; // ']'
const C_COLON = 58; // ':'

// Simple identifier check (adjust regex as needed for complexity)
const identifierRegex = /^[a-zA-Z0-9_-]+$/;
const referenceRegex = /\[%(.*?)\]/g; // Non-greedy match inside [%...]

function remarkAsideFootnotes() {
  return (tree, file) => {
    const definitions = {}; // Store definition nodes { identifier: { node, identifier, children } }
    const referenceOrder = []; // Keep track of the order identifiers are first referenced
    const references = []; // Store reference nodes { node, identifier, parent, startIndex, endIndex }

    // --- Pass 1: Find Definitions ---
    visit(tree, 'paragraph', (node, index, parent) => {
      if (
        !parent ||
        index === null ||
        node.children.length < 1 ||
        node.children[0].type !== 'text'
      ) {
        return;
      }

      const firstChild = node.children[0];
      const text = firstChild.value;

      // Check for [%identifier]: structure
      if (
        text.charCodeAt(0) === C_BRACKET_OPEN &&
        text.charCodeAt(1) === C_PERCENT
      ) {
        const closeBracketIndex = text.indexOf(']');
        if (closeBracketIndex > 2 && text.charCodeAt(closeBracketIndex + 1) === C_COLON) {
          const identifier = text.slice(2, closeBracketIndex);

          if (identifierRegex.test(identifier) && !definitions[identifier]) {
            // Valid definition found
            const definitionContentPrefix = text.slice(closeBracketIndex + 2).trimStart();
            const definitionChildren = node.children.slice(1); // Rest of the children in the paragraph

            // Update or replace the first child's text node
            if (definitionContentPrefix) {
              firstChild.value = definitionContentPrefix;
            } else {
              // If the definition starts on the next node, remove the now empty first child
              node.children.shift();
            }

            definitions[identifier] = {
              identifier: identifier,
              children: node.children, // The content nodes
              // Store original node temporarily if needed, but we'll build a new one later
            };

            // Mark the node for removal after collection
            node._asideFootnoteDefinitionMarker = true; // Custom flag
            return visit.SKIP; // Don't visit children of this definition paragraph
          }
        }
      }
    });

     // Remove original definition paragraphs after collecting content
     remove(tree, node => node._asideFootnoteDefinitionMarker === true);


    // --- Pass 2: Find References ---
    visit(tree, 'text', (node, index, parent) => {
        if (!parent || index === null) return;

        referenceRegex.lastIndex = 0; // Reset regex state
        let match;
        let lastIndex = 0;
        const newChildren = [];

        while ((match = referenceRegex.exec(node.value)) !== null) {
            const identifier = match[1];

            if (definitions[identifier]) { // Only create references for defined footnotes
                // Add text before the match
                if (match.index > lastIndex) {
                    newChildren.push({
                        type: 'text',
                        value: node.value.slice(lastIndex, match.index),
                    });
                }

                // Create the custom reference node
                const referenceNode = {
                    type: 'asideFootnoteReference', // Custom node type
                    identifier: identifier,
                    // We'll add label/number later
                };
                newChildren.push(referenceNode);
                references.push({ node: referenceNode, identifier: identifier });

                 // Track first appearance order
                 if (!referenceOrder.includes(identifier)) {
                    referenceOrder.push(identifier);
                }

                lastIndex = match.index + match[0].length;
            }
            // If not a valid definition, the regex continues searching
        }

        // If references were found, replace the original text node
        if (newChildren.length > 0) {
             // Add any remaining text after the last match
             if (lastIndex < node.value.length) {
                newChildren.push({ type: 'text', value: node.value.slice(lastIndex) });
             }
             // Replace the current text node with the new nodes (text and references)
             parent.children.splice(index, 1, ...newChildren);
             return index + newChildren.length; // Adjust index for visit
        }

        return visit.CONTINUE;
    });


    // --- Pass 3: Assign Numbers and Create Final Nodes ---
    if (referenceOrder.length > 0) {
        const definitionNodes = [];
        const identifierToNumber = {};

        // Assign numbers based on reference order
        referenceOrder.forEach((identifier, index) => {
            const number = index + 1;
            identifierToNumber[identifier] = number;

            // Create the final definition node
            const definitionData = definitions[identifier];
            if (definitionData) {
                const definitionNode = {
                    type: 'asideFootnoteDefinition', // Custom node type
                    identifier: identifier,
                    number: number, // Assign the number
                    children: definitionData.children, // Content goes here
                };
                definitionNodes.push(definitionNode);
            }
        });

        // Update reference nodes with numbers
        references.forEach(ref => {
            const number = identifierToNumber[ref.identifier];
            if (number !== undefined) {
                ref.node.number = number; // Add number to reference node
            } else {
                // This case shouldn't happen if logic is correct, but handle defensively
                // Maybe revert ref.node back to text? For now, it will just lack a number.
                 console.warn(`Aside footnote reference '[%${ref.identifier}]' found but corresponding definition missing or not referenced.`);
            }
        });

        // Append all definition nodes to the end of the document body
        tree.children.push(...definitionNodes);
    }

    // Clean up temporary flag if any definition wasn't removed (shouldn't happen)
     visit(tree, (node) => {
        delete node._asideFootnoteDefinitionMarker;
    });
  };
}

export default remarkAsideFootnotes;