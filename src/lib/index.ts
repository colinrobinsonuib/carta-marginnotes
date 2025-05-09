import type { Plugin as CartaPlugin } from 'carta-md';
import remarkRehype from 'remark-rehype';

import { remarkMarginnotesPlugin, marginnoteHandlers } from 'remark-marginnotes';
import MarginNoteIcon from './icons/MarginNoteIcon.svelte';
import FootNoteIcon from './icons/FootNoteIcon.svelte';

export const marginnotes = ({useShapes=false, useNumbers=false }): CartaPlugin => {
	return {
		transformers: [
			{
				execution: 'async',
				type: 'remark',
				transform: ({ processor }) => {
					processor.use(remarkMarginnotesPlugin).use(remarkRehype, {
						handlers: marginnoteHandlers({
							useShapes: useShapes,
							useNumbers: useNumbers,
						}),
					});
				},
			},
		],
		grammarRules: [
			{
				name: 'ins',
				type: 'inline',
				definition: {
					match: '\\[\\+(.*?)\\]',
					name: 'markup.ins.markdown',
				},
			},
			// Carta already have highlight for del, so we don't need to add it here
		],
		highlightingRules: [
			{
				light: {
					scope: 'markup.ins',
					settings: {
						foreground: '#1fa81f',
					},
				},
				dark: {
					scope: 'markup.ins',
					settings: {
						foreground: '#1fa81f',
					},
				},
			},
		],
		icons: [
			{
				id: 'marginnotes',
				label: 'Margin Note',
				action: (input) => {
					const selection = input.getSelection();
					const startPos = selection.end;

					// Insert the reference, e.g., [+note]
					input.insertAt(startPos, '[+note]');

					// Get the full text content *after* inserting the reference
					const currentText = input.textarea.value;

					// Find the end of the line where the reference was inserted
					// We search from the original start position as the insertion happens there
					let endOfLinePos = currentText.indexOf('\n', startPos);

					// If \n is not found, it means the insertion was on the last line
					if (endOfLinePos === -1) {
						endOfLinePos = currentText.length; // Set position to the end of the text
						// Insert the definition with a preceding newline
						input.insertAt(endOfLinePos, '\n\n[+note]: the note');
					} else {
						// Insert the definition at the beginning of the next line, followed by a newline
						// The +1 moves to the character after the newline found
						input.insertAt(endOfLinePos + 1, '\n[+note]: the note\n');
					}

					// Optional: Adjust cursor position if needed after insertions
					// For example, place it after the inserted reference:
					// input.textarea.selectionStart = startPos + '[+note]'.length;
					// input.textarea.selectionEnd = startPos + '[+note]'.length;
					input.textarea.selectionStart = endOfLinePos + 1 + '\n[+note]: '.length;
					input.textarea.selectionEnd = endOfLinePos + 1 + '\n[+note]: the note'.length;
					// Or place it inside the definition text:
					// Find the position of ': ' in the inserted definition and place cursor after it.
				},
				component: MarginNoteIcon,
			},
			{
				id: 'footnotes',
				label: 'Footnote',
				action: (input) => {
					const selection = input.getSelection();
					const startPos = selection.end;

					input.insertAt(startPos, '[^note]');
					const currentText = input.textarea.value;
					let endOfLinePos = currentText.indexOf('\n', startPos);

					if (endOfLinePos === -1) {
						endOfLinePos = currentText.length;
						input.insertAt(endOfLinePos, '\n\n[^note]: the note');
					} else {
						input.insertAt(endOfLinePos + 1, '\n[^note]: the note\n');
					}

					input.textarea.selectionStart = endOfLinePos + 1 + '\n[^note]: '.length;
					input.textarea.selectionEnd = endOfLinePos + 1 + '\n[^note]: the note'.length;
				},
				component: FootNoteIcon,
			},
		],
	};
};
