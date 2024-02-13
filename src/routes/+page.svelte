<script lang="ts">
	import { page } from '$app/stores';
	import normsPro from '$lib/fonts/TTNormsPro-ExtraBlack.woff';
	import circles from '$lib/images/circles_white.svg';
	import { calc } from '$lib/scripts/path.math';
	import opentype, { Font } from 'opentype.js';
	import { onMount } from 'svelte';
	import quotes from './quotes.json';
	import { base } from '$app/paths';

	const selectedIndex = Math.floor(Math.random() * quotes.length);

	let value = $page.url.searchParams.get('quote') || quotes[selectedIndex].quote;
	let author = $page.url.searchParams.get('quote') ? '' : quotes[selectedIndex].author;
	$: calculatedSvgs = font ? calc(value.toLocaleUpperCase().split('\n'), font) : [];
	$: urlValue = `${base}?quote=${encodeURIComponent(value)}`;

	let font: Font | null = null;
	let loading = true;
	let disabled = false;
	
	function toggleDisabled() {
		disabled = !disabled;
		const a = document.getElementsByTagName('textarea')[0];
		a.setSelectionRange(a.value.length, a.value.length);
	}

	function removeAuthor() {
		author = '';
	}

	onMount(() => {
		opentype.load(normsPro).then((f) => {
			font = f;
			loading = false;
		});
	});
</script>

<svelte:window on:dblclick={toggleDisabled} />

<section>
	{#if !loading}
		<a href={urlValue} target="_blank">🔗</a>
		<!-- <img id="circles" src={circles} alt="background"/> -->
		<svg viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient
					id="gradient"
					x1="-73083.9"
					y1="7005.99"
					x2="-96884"
					y2="92747"
					gradientUnits="userSpaceOnUse"
				>
					<stop stop-color="#7D36CF" stop-opacity="0.15"></stop><stop
						offset="1"
						stop-color="#4F36CF"
						stop-opacity="0"
					></stop></linearGradient
				>
				<linearGradient
					id="linearGradient"
					x1="-730"
					y1="700"
					x2="-968"
					y2="927"
					gradientUnits="userSpaceOnUse"
				>
					<stop style="stop-color:#372C43;stop-opacity:1;" offset="0" />
					<stop style="stop-color:#292929;stop-opacity:1;" offset="1" />
				</linearGradient>

				<mask id="test">
					<use href="{circles}#circles" transform=" rotate(-28)"></use>
				</mask>
			</defs>

			<g transform="translate(0,44) rotate(18)" style="fill:url(#linearGradient)">
				{#each calculatedSvgs as path}
					{#each path.shadow as d}
						<path class="shadow" {d} />
						<path class="gradient" mask="url(#test)" {d} />
					{/each}
				{/each}
			</g>

			<g transform="translate(0,44) rotate(18)">
				{#each calculatedSvgs as path}
					<path class="text" d={path.d} />
				{/each}
			</g>
		</svg>
		<textarea
			class="text"
			bind:value
			spellcheck="false"
			{disabled}
			title={author}
			on:change={removeAuthor}
		/>
	{/if}
</section>

<style>
	@font-face {
		font-family: 'TTNormsPro';
		src: url('$lib/fonts/TTNormsPro-ExtraBlack.woff');
	}
	textarea {
		position: absolute;
		text-align: left;
		border: none;
		background: none;
		outline: none;
		resize: none;
		color: white;
		width: 100%;
		height: 100%;
	}
	section {
		width: 100%;
		height: 100%;
		background: linear-gradient(248deg, #5335d7 0%, #b3a1ff 100%);
		position: relative;
		overflow: hidden;
	}

	textarea,
	svg {
		font-family: 'TTNormsPro', sans-serif;
		font-size: 52px;
		line-height: 50px;
		padding: 0 0 0 10vw;
		margin: 0;
		word-break: break-all;
		text-transform: uppercase;
		font-variant-ligatures: none;
		-webkit-font-smoothing: antialiased;
		text-rendering: geometricPrecision;
		text-align: left;
		position: absolute;
		width: 1000px;
		letter-spacing: -0.004ex;
		word-spacing: -0.005ex;
	}

	textarea {
		border-top: 30vh solid transparent;
		color: #f000;
		caret-color: white;
		overflow: hidden;
		overflow-wrap: break-word;
	}
	svg {
		width: 1600px;
		height: 1000px;
		top: 30vh;
		overflow: visible;
	}

	svg .text {
		fill: white;
	}
	.shadow {
		fill: #292929;
	}
	.gradient {
		fill: url(#linearGradient);
	}

	a {
		text-decoration: none;
		position: fixed;
		bottom: 1em;
		right: 1em;
		z-index: 1;
	}
</style>
