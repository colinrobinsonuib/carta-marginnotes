import type { Plugin as CartaPlugin } from 'carta-md';
import remarkSupersub from 'remark-supersub';

import SubscriptIcon from './icons/SubscriptIcon.svelte';
import SupscriptIcon from './icons/SupscriptIcon.svelte';
import sidenotes from './remark-sidenotes-transformer';
import gloss from './remark-gloss';

import remarkInlineAsideFootnotes  from './remark-aside-footnotes.js';
import remarkRehype from 'remark-rehype';
import { inlineAsideFootnoteHandlers  } from './rehype-handlers.js';

export const subscript = (): CartaPlugin => {
	return {
		transformers: [
			{
				execution: 'sync',
				type: 'remark',
				transform: ({ processor }) => {
					processor.use(remarkInlineAsideFootnotes )
					.use(remarkRehype, {
						allowDangerousHtml: true,
						handlers: inlineAsideFootnoteHandlers
					})
				},
			},
		],
		grammarRules: [
			{
				name: 'sub',
				type: 'inline',
				definition: {
					match: '(?<!~)~[^~ ]+~(?!~)',
					name: 'markup.sub.markdown',
				},
			},
			{
				name: 'sup',
				type: 'inline',
				definition: {
					match: '(?<!\\^)\\^[^\\^ ]+\\^(?!\\^)',
					name: 'markup.sup.markdown',
				},
			},
			{
				name: 'gloss',
				type: 'inline',
				definition: {
					match: '(?<!%)%[^% ]+%(?!%)',
					name: 'markup.gloss.markdown',
				},
			},
		],
		highlightingRules: [
			{
				light: {
					scope: 'markup.sub',
					settings: {
						foreground: '#1565C0',
					},
				},
				dark: {
					scope: 'markup.sub',
					settings: {
						foreground: '#42A5F5',
					},
				},
			},
			{
				light: {
					scope: 'markup.sup',
					settings: {
						foreground: '#1565C0',
					},
				},
				dark: {
					scope: 'markup.sup',
					settings: {
						foreground: '#42A5F5',
					},
				},
			},
		],
		icons: [
			{
				id: 'subscript',
				label: 'Subscript',
				action: (input) => input.toggleSelectionSurrounding('~'),
				component: SubscriptIcon,
			},
			{
				id: 'supscript',
				label: 'Supscript',
				action: (input) => input.toggleSelectionSurrounding('^'),
				component: SupscriptIcon,
			},
		],
	};
};
