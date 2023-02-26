<svelte:head>
	<title>About</title>
	<meta name="description" content="A personal AI chatbot app with voice" />
</svelte:head>

<script>
	import { onMount } from 'svelte';

	let summaryToggle = true;
	let selectedLanguage = '';
	let supportedLanguages = [];

	onMount(async () => {
		const { VITE_OPENAI_API_KEY: apiKey } = import.meta.env;
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			}
		};

		const response = await fetch('https://api.openai.com/v1/engines', requestOptions);
		const data = await response.json();
		const engine = data.data.find(engine => engine.id === 'text-davinci-002');
		const response2 = await fetch(`https://api.openai.com/v1/engines/${engine.id}/completions`, requestOptions);
		const data2 = await response2.json();
		const languages = data2.choices[0].text.split('Supported languages: ')[1].split('\n')[0];
		supportedLanguages = languages.split(',').map(language => language.trim());
	});

	function translateText(text) {
		const { VITE_OPENAI_API_KEY: apiKey } = import.meta.env;
		const OPENAI_API_KEY = apiKey;
		const model = 'text-davinci-003';
		const prompt = `Translate ${summaryToggle && "and summarize"} this into ${selectedLanguage}:\n\n${text}\n\n`;
		const temperature = 0.3;
		const max_tokens = 200;
		const top_p = 1;
		const frequency_penalty = 0;
		const presence_penalty = 0;

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model,
				prompt,
				temperature,
				max_tokens,
				top_p,
				frequency_penalty,
				presence_penalty
			})
		};

		fetch('https://api.openai.com/v1/completions', requestOptions)
			.then(response => response.json())
			.then(data => {
				const translation = data.choices[0].text.trim();
				document.getElementById("output").value = translation;
			});
	}
</script>
<div class="text-column">
	<h1>Translate and summarize text into any language, powered by Generic Express - the ultimate translator.</h1>
	<h2>Paste or type the text you want to translate, select the language you want to translate to, and click "Generate".</h2>
	<label for="prompt">Text to Translate</label>
	<textarea id="prompt" aria-multiline='true' maxlength="1500" placeholder="Enter text here..."></textarea>
	<div id="bottom-bar">
		<div>
			<label for="language">Desired Language</label>
			<select id="language" on:change={e => selectedLanguage = e.target.value}>
				{#each supportedLanguages as language}
					<option value={language}>{language}</option>
				{/each}
			</select>
			<label for="summarize">Summarize</label>
			<input type="checkbox" id="summarize" bind:checked={summaryToggle} />
		</div>
		<button on:click={() => translateText(document.getElementById("prompt").value)}>Generate</button>
	</div>
	<label for="output">Output</label>
	<textarea id="output" placeholder="Output will load here..."></textarea>
</div>
<style>
    textarea, input, select, button {
        font-family: inherit;
        padding: 1rem;
        margin: 1rem;
        outline: none;
        border-radius: 1rem;
    }
    input[type=checkbox] {
        height: 1.5rem;
        width: 1.5rem;
    }
    textarea {
        min-height: 350px;
    }
    h1 {
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(45deg, #1E8BFF, white);
    }
    h2 {
        margin: 1rem 1rem 2rem 1rem;
        line-height: 2rem;
        text-align: center;
    }
    button {
        cursor: pointer;
        margin: 1rem auto;
        min-width: revert;
        width: 10rem;
        height: 3rem;
        border-radius: 1rem;
        outline: none;
        border: none;
        font-size: 1rem;
        font-weight: 700;
    }
    label {
        padding-left: 1rem;
    }
    #bottom-bar {
        width: 100%;
        display: flex;
        justify-content: center;
        align-content: center;
    }
    </style>