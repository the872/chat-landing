<svelte:head>
	<title>About</title>
	<meta name="description" content="A personal AI chatbot app with voice" />
</svelte:head>

<script>
	let summaryToggle = true;
	let inputText = '';
	let selectedLanguage = '';
	let translation = '';

	const translateText = (text) => {
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
				translation = data.choices[0].text.trim();
			});
	};
</script>

<div class="text-column">
	<h1>Translate and summarize text into any language, powered by Generic Express - the ultimate translator.</h1>
	<h2>Paste or type the text you want to translate, type the language you to translate to and click "Generate".</h2>
	<label for="prompt">Text to Translate</label>
	<textarea id="prompt" aria-multiline='true' maxlength="1500" placeholder="Enter text here...">{inputText}</textarea>
	<div id="bottom-bar">
		<div>
			<label for="language">Desired Language</label>
			<input id="language" placeholder="Enter language here..." />
			<label for="summarize">Summarize</label>
			<input type="checkbox" id="summarize" checked={summaryToggle} />
		</div>
		<button on:click={() => translateText(inputText)}>Generate</button>
	</div>
	{#if translation !== ''}
	<label for="output">Output</label>
	<textarea id="output" placeholder="Output will load here...">{translation}</textarea>
		{/if}
</div>

<style>
	textarea, input, button {
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

	#bottom-bar > div {

	}
</style>
