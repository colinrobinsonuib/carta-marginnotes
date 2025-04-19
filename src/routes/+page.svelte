<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css';

	import { marginnotes } from '$lib';

	const carta = new Carta({
		extensions: [marginnotes()],
		gfmOptions: {
			singleTilde: false,
		},
		sanitizer: false,
	});

	const value = `
Here is the first reference [+my-note]. It should be followed by the aside.

[+my-note]: This is the content for the first note. It appears inline after the first ref.

H~2~O, CO~2~ and CH~4~ are greenhouse gases

And here[^fn1] is a real footnote[^fn2]. No aside here.

[^fn1]: This is the first footnote. It appears at the bottom of the page.

[^fn2]: This is the second footnote. It appears at the bottom of the page.

This is a reference to a different note [+another-note]. Its aside follows.

Some more text.

[+another-note]: This is the second note's definition. It can span multiple lines.  
It appears inline after the second ref.
`;
</script>

<main>
	<MarkdownEditor {carta} {value} />
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter var', sans-serif;
		min-height: 100vh;
	}

	:global(.carta-font-code, code) {
		font-family: 'Fira Code', monospace;
		font-variant-ligatures: normal;
		font-size: 0.95rem;
	}

	:global(input, textarea, button) {
		font-family: inherit;
	}

	main {
		max-width: 1536px;
		margin: 0 auto 0 auto;
		padding: 2rem 0 2rem 0;
	}

	/* Responsive main */

	@media screen and (max-width: 640px) {
		main {
			width: 95%;
		}
	}

	@media screen and (min-width: 640px) and (max-width: 767px) {
		main {
			width: 640px;
		}
	}

	@media screen and (min-width: 767px) and (max-width: 1023px) {
		main {
			width: 768px;
		}
	}

	@media screen and (min-width: 1023px) and (max-width: 1279px) {
		main {
			width: 1024px;
		}
	}

	@media screen and (min-width: 1279px) and (max-width: 1535px) {
		main {
			width: 1280px;
		}
	}
</style>
