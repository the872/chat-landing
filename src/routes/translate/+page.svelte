<svelte:head>
	<title>Translate | Generic Express</title>
	<meta name="description" content="Translate and summarize with ease." />
</svelte:head>
<script>
	import logo from '$lib/images/generic-logo.png';
	let summaryToggle = true;
	let inputText = '';
	let selectedLanguage = '';
	let translation = '';
	let loading = false;

	const translateText = async (text) => {
		if (!loading && text !== '') {
			loading = true;
			const { VITE_OPENAI_API_KEY: apiKey } = import.meta.env;
			const OPENAI_API_KEY = apiKey;
			const model = 'text-davinci-003';
			const prompt = `Translate ${summaryToggle ? "and summarize this" : "this word for word"} into ${selectedLanguage === '' ? 'English' : selectedLanguage} language:\n\n${text}\n\n`;
			const temperature = 0.3;
			const max_tokens = 175;
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

			try {
				const response = await fetch('https://api.openai.com/v1/completions', requestOptions);
				const data = await response.json();
				translation = data.choices[0].text.trim();
				loading = false;
			} catch {
				loading = false;
			}
		}
	};

	const handleInputTextChange = (event) => {
		inputText = event.target.value;
	};

	const handleSelectedLanguageChange = (event) => {
		selectedLanguage = event.target.value;
	};

	const handleSummaryChange = () => {
		summaryToggle = !summaryToggle;
	};
</script>

<div class="text-column">
	<h1>Translate and summarize text into any language, powered by Generic Express - the ultimate translator.</h1>
	<h2>Paste or type the text you want to translate, type the language you want to translate to and click "Generate".</h2>
	<label for="prompt">Text to Translate</label>
	<textarea id="prompt" aria-multiline='true' maxlength="1000" placeholder="Enter text here..." on:input={handleInputTextChange}>{inputText}</textarea>
	<div id="bottom-bar">
		<div>
			<label for="language">Desired Language</label>
			<input id="language" placeholder="Enter language here..." on:input={handleSelectedLanguageChange} />
			<label for="summarize">Summarize</label>
			<input type="checkbox" id="summarize" checked={summaryToggle} on:click={handleSummaryChange} />
		</div>
		<button on:click={() => translateText(inputText)}>Generate</button>
	</div>
	{#if loading}
		<div class="welcome">
			<img src={logo} alt="generic express" />
			<img src={logo} alt="generic express" />
			<img src={logo} alt="generic express" />
		</div>
		{/if}
	{#if translation !== '' && !loading}
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
      font-size: 1.15rem;
      line-height: 1.75rem;
			max-width: calc(100% - 4rem);
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

  .welcome {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 150px;
  }
  .welcome img {
      width: 50px;
      height: 50px;
      margin: 0 20px;
      opacity: 0.2;
      animation: pulse 1s infinite;
  }
  .welcome img:nth-child(1) {
      animation-delay: 0.2s;
  }
  .welcome img:nth-child(2) {
      animation-delay: 0.4s;
  }
  .welcome img:nth-child(3) {
      animation-delay: 0.6s;
  }
  @keyframes pulse {
      0% {
          transform: scale(1);
          opacity: 0.2;
      }
      50% {
          transform: scale(1.2);
          opacity: 1;
      }
      100% {
          transform: scale(1);
          opacity: 0.2;
      }
  }
</style>
