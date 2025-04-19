import type { Root, FootnoteReference, FootnoteDefinition, Paragraph } from 'mdast'
import type { Node, Parent } from 'unist'
import getSlug from 'speakingurl'
import {visit} from 'unist-util-visit'
import {select} from 'unist-util-select'
import {toHast} from 'mdast-util-to-hast'
import {toHtml} from 'hast-util-to-html'

const MARGINNOTE_SYMBOL = '{-}'

function sidenotes() {
  return transformer
}

const generateInputId = (isMarginNote: boolean, title: string) =>
  `${isMarginNote ? 'md' : 'sd'}-${getSlug(title, { truncate: 20 })}`

const getReplacement = ({ isMarginNote, noteHTML }: { isMarginNote: boolean; noteHTML: string }) => {
  const inputId = generateInputId(isMarginNote, noteHTML)
  const labelCls = `margin-toggle ${isMarginNote ? '' : 'sidenote-number'}`
  const labelSymbol = isMarginNote ? '&#8853;' : ''
  const noteTypeCls = isMarginNote ? 'marginnote' : 'sidenote'

  return [
    {
      type: 'html',
      value: `<label for="${inputId}" class="${labelCls}">${
        labelSymbol
      }</label>`,
    },
    {
      type: 'html',
      value: `<input type="checkbox" id="${inputId}" class="margin-toggle" />`,
    },
    {
      type: 'html',
      value: `<span class="${noteTypeCls}">`,
    },
    {
      type: 'html',
      value: noteHTML,
    },
    {
      type: 'html',
      value: '</span>',
    },
  ]
}

const coerceToHtml = (nodeArray: Node[]) =>
  nodeArray.map((node: Node) => toHtml(toHast(node))).join('') || ''

const extractNoteFromHtml = (note: string) => {
  const matches = note.match(/(\s+)*({-})*\s*((.|\n)+)/)

  return {
    isMarginNote: matches[2] === MARGINNOTE_SYMBOL,
    noteHTML: matches[3],
  }
}

export function transformer(tree: Root) {
  // "Regular" Sidenotes/Marginnotes consisting of a reference and a definition
  // Syntax for Sidenotes [^<number>] and somewhere else [^<number]: <markdown>
  // Syntax for Marginnotes [^<descriptor>] and somewhere else [^<descriptor]: {-}
  visit(tree, 'footnoteReference', (node: FootnoteReference, index: number | undefined, parent: Parent | undefined) => {
    if (!parent) return; // Handle undefined parent
    // Updated: Pass selector first, then tree
    const target = select(
      `footnoteDefinition[identifier="${node.identifier}"]`,
      tree
    ) as FootnoteDefinition | null // Added type assertion

    // Updated: select returns a single node or null, not an array
    if (!target) throw new Error('No corresponding note found')

    // Added type check for children
    const notesAst: Node[] =
      target.children.length && target.children[0].type === 'paragraph'
        ? (target.children[0] as Paragraph).children
        : target.children

    const nodeDetail = extractNoteFromHtml(coerceToHtml(notesAst))

    parent.children.splice(index, 1, ...getReplacement(nodeDetail))
  })

  visit(tree, 'footnoteDefinition', (node: FootnoteDefinition, index: number, parent: Parent) => {
    parent.children.splice(index, 1)
  })

  // "Inline" Sidenotes which do not have two parts
  // Syntax: [^{-} <markdown>]
  // Assuming 'footnote' corresponds to InlineFootnote or similar if defined, using Node for now
  visit(tree, 'footnote', (node: Parent, index: number, parent: Parent) => {
    const notesAst = node.children
    const nodeDetail = extractNoteFromHtml(coerceToHtml(notesAst))

    parent.children.splice(index, 1, ...getReplacement(nodeDetail))
  })

  // Only for testing
  return tree
}

export default sidenotes