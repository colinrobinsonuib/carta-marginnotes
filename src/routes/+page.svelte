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

	/*const value = `
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
`;*/

	const value = `
Lorem ipsum dolor sit amet, consectetur[+a] adipiscing elit. Vestibulum maximus, metus non laoreet egestas, augue ex interdum leo, vel vulputate ipsum[+b] lorem placerat enim. Suspendisse iaculis dapibus lorem. Cras tempor quis orci eu iaculis. Aliquam lobortis purus risus, in vulputate risus laoreet non. Suspendisse fringilla tristique condimentum. Fusce felis erat, commodo sit amet lectus ut, faucibus laoreet turpis. Nam leo eros, consectetur quis vulputate in, dictum ac ligula. Sed urna odio, viverra vitae nibh id, rhoncus fermentum ex.

Cras porta enim vitae neque[+c] suscipit tincidunt. Integer rhoncus malesuada risus a elementum. Nunc in arcu tincidunt[+d], suscipit lorem sit amet, consequat augue. Etiam semper[+e] suscipit diam vitae laoreet. Nam tincidunt, nulla nec pulvinar pretium, ante diam elementum sapien, volutpat molestie ligula odio sit amet nisl. Mauris in lectus id ante viverra feugiat. Donec vitae magna quis ligula ornare aliquam vel et justo. Duis convallis vestibulum nisi et rhoncus. Quisque nec purus quis metus facilisis fringilla.

Nullam dictum viverra vehicula[+a]. Curabitur dolor turpis, mollis ut arcu sit amet, feugiat dapibus ligula[+f]. Curabitur erat elit, blandit nec mattis vitae, malesuada eget orci. Morbi pellentesque diam at risus eleifend, eget varius justo vehicula. Vestibulum mattis, odio et faucibus volutpat, ipsum ligula vulputate mauris, ut convallis urna augue ut magna. Curabitur et lorem tortor. Nullam efficitur dui nulla, nec interdum magna accumsan sit amet. Morbi vel mattis lacus, in lacinia dolor. In dictum fringilla nibh eu fermentum. Cras fermentum eget mi ac porttitor. Aenean sed velit consequat sapien aliquam hendrerit. Quisque ut erat varius, malesuada lacus ac, feugiat urna. Aliquam mauris eros, pulvinar vitae vestibulum ut, tempor sit amet turpis.

Integer finibus ullamcorper tempor. Nam scelerisque orci quis sem accumsan, vel ullamcorper ipsum malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras eu massa quis massa pulvinar pharetra. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur tristique turpis quis enim suscipit, sit amet scelerisque ante feugiat. Sed mollis mauris at nisl sollicitudin consectetur in eget urna. In dapibus purus in elementum imperdiet. Etiam malesuada purus dolor, in sagittis massa egestas eu. Aliquam nec dignissim nunc, sit amet condimentum mauris.

Cras suscipit enim a tempor blandit. Aenean viverra neque ac quam eleifend, in egestas metus tempor. Maecenas et lacus at quam cursus fringilla. Etiam ligula erat, facilisis aliquam blandit nec, blandit eget urna. Nunc sit amet dignissim eros. Sed gravida massa ac ex volutpat, lobortis fermentum dui elementum. Ut feugiat metus libero, porttitor volutpat elit volutpat ac. Nam venenatis ante id elit finibus varius. Mauris cursus justo ut blandit scelerisque. Proin vestibulum fringilla turpis sit amet congue. Vestibulum non auctor ligula.

Nam vulputate congue velit, nec faucibus leo porta vel. Phasellus ut laoreet nunc. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras a vestibulum nulla. Aenean vitae faucibus odio. Phasellus laoreet, diam et eleifend aliquam, lorem ligula porttitor massa, ut interdum nisl lectus id elit. Vestibulum sit amet nibh maximus libero viverra egestas a ac arcu.

Mauris id libero non mauris varius pellentesque nec nec lectus. Etiam urna tellus, gravida vitae erat sed, auctor vulputate justo. Sed nisl sem, cursus id ex a, iaculis luctus justo. Vivamus justo enim, pretium quis turpis ut, luctus interdum ante. Mauris ut tempus quam. Vivamus faucibus maximus eleifend. Nulla pretium feugiat tellus, non tincidunt massa. Praesent erat quam, aliquam nec lobortis eu, scelerisque eu nisl. Suspendisse elementum odio sem, ac luctus dolor tempor eu. Maecenas libero nisl, elementum in tempus pretium, pharetra sed nulla. Cras a lectus eget nunc iaculis sollicitudin. Nullam maximus felis non mauris porta pellentesque. Cras venenatis eros metus, a semper arcu rutrum non. Donec ac leo rutrum, consequat urna vitae, vestibulum odio. Pellentesque leo enim, gravida vel tempus ut, rutrum sed ex. Sed eu nisi vel massa suscipit imperdiet at at purus.

Maecenas vulputate nisi vel urna bibendum euismod. Maecenas pretium justo nec faucibus ultricies. Nunc quis nibh non nisi semper cursus et vel orci. Integer ultricies et magna ac aliquam. Pellentesque tristique euismod felis vitae laoreet. Aenean ornare placerat augue, a condimentum ipsum tempor at. Donec dapibus libero sit amet metus mollis porta. Donec sed accumsan erat. Donec lacinia eros in nisl aliquam egestas. Fusce rutrum ante quis finibus commodo.

Praesent sollicitudin, dui eu faucibus faucibus, velit ex elementum purus, vel viverra nisi metus ut est. Duis interdum nec est id cursus. Mauris semper tempus semper. Morbi egestas in orci vitae hendrerit. Suspendisse a facilisis sapien. In non erat ut augue fringilla hendrerit. Pellentesque mauris urna, efficitur a sagittis a, mollis vel erat. In convallis dapibus neque. Donec tellus quam, consequat at nunc quis, dignissim consequat mauris. Vivamus condimentum et arcu at aliquet. Nam eleifend tempus est, ut semper nibh feugiat nec.

[+a]: This is the content for the first note. It appears inline after the first ref.

[+b]: This is the content for the second note. It appears inline after the second ref.

[+c]: This is the content for the third note. It appears inline after the third ref.

[+d]: DDD

[+e]: This is the content for the fifth note. It appears inline after the fifth ref.

[+f]: This is the content for the sixth note. It appears inline after the sixth ref.
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
