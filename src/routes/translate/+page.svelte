<svelte:head>
	<title>Translate | Generic Express</title>
	<meta name="description" content="Translate and summarize with ease." />
</svelte:head>
<script>
	import logo from '$lib/images/generic-logo.png';
	let inputText = '';
	let selectedLanguage = 'English';
	let selectedType = 'Translate';
	let translation = '';
	let loading = false;

	const translateText = async (text) => {
		if (!loading && text !== '') {
			loading = true;
			const { VITE_OPENAI_API_KEY: apiKey } = import.meta.env;
			const OPENAI_API_KEY = apiKey;
			const model = 'text-davinci-003';
			const buildType = selectedType === 'Translate' ? "Translate the following text without changing the meaning" : selectedType === 'Summarize' ? 'Summarize the following text' : 'Can you proofread the following text and suggest a better way to write it';
			const prompt = `${buildType}, please respond in the ${selectedLanguage === '' ? 'English' : selectedLanguage} language:\n\n${text}\n\n`;
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
				const response = await fetch('/api', requestOptions);
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

	const handleSelectChange = (event) => {
		selectedType = event.target.value;
	};
</script>

<div class="text-column">
	<h1>Translate, summarize, and proofread text to any language - the only translation tool you need.</h1>
	<h2>Paste or type the text you want to translate, type the language you want to translate to and click "Generate".</h2>
	<div class="flex">
		<label for="type">Select Action</label>
		<select id="type" on:change={handleSelectChange}>
			<option value="Translate" selected>Translate (Default)</option>
			<option value="Summarize">Summarize</option>
			<option value="Proofread">Proofread</option>
		</select>
	</div>
	<label for="prompt">Text to {selectedType}</label>
	<textarea id="prompt" aria-multiline='true' maxlength="3000" placeholder="Enter text here..." on:input={handleInputTextChange}>{inputText}</textarea>
	<div id="bottom-bar flex">
		<div class="flex">
			<label for="language">Desired Language</label>
			<select id="language" on:change={handleSelectedLanguageChange}>
				<option value="Afrikaans">Afrikaans</option>
				<option value="Albanian">Albanian</option>
				<option value="Amharic">Amharic</option>
				<option value="Arabic">Arabic</option>
				<option value="Armenian">Armenian</option>
				<option value="Azerbaijani">Azerbaijani</option>
				<option value="Basque">Basque</option>
				<option value="Belarusian">Belarusian</option>
				<option value="Bengali">Bengali</option>
				<option value="Bosnian">Bosnian</option>
				<option value="Bulgarian">Bulgarian</option>
				<option value="Catalan">Catalan</option>
				<option value="Cebuano">Cebuano</option>
				<option value="Chichewa">Chichewa</option>
				<option value="Chinese (Simplified)">Chinese (Simplified)</option>
				<option value="Chinese (Traditional)">Chinese (Traditional)</option>
				<option value="Corsican">Corsican</option>
				<option value="Croatian">Croatian</option>
				<option value="Czech">Czech</option>
				<option value="Danish">Danish</option>
				<option value="Dutch">Dutch</option>
				<option value="English" selected>English (Default)</option>
				<option value="Esperanto">Esperanto</option>
				<option value="Estonian">Estonian</option>
				<option value="Filipino">Filipino</option>
				<option value="Finnish">Finnish</option>
				<option value="French">French</option>
				<option value="Frisian">Frisian</option>
				<option value="Galician">Galician</option>
				<option value="Georgian">Georgian</option>
				<option value="German">German</option>
				<option value="Greek">Greek</option>
				<option value="Gujarati">Gujarati</option>
				<option value="Haitian Creole">Haitian Creole</option>
				<option value="Hausa">Hausa</option>
				<option value="Hawaiian">Hawaiian</option>
				<option value="Hebrew">Hebrew</option>
				<option value="Hindi">Hindi</option>
				<option value="Hmong">Hmong</option>
				<option value="Hungarian">Hungarian</option>
				<option value="Icelandic">Icelandic</option>
				<option value="Igbo">Igbo</option>
				<option value="Indonesian">Indonesian</option>
				<option value="Irish">Irish</option>
				<option value="Italian">Italian</option>
				<option value="Japanese">Japanese</option>
				<option value="Javanese">Javanese</option>
				<option value="Kannada">Kannada</option>
				<option value="Kazakh">Kazakh</option>
				<option value="Khmer">Khmer</option>
				<option value="Kinyarwanda">Kinyarwanda</option>
				<option value="Korean">Korean</option>
				<option value="Kurdish (Kurmanji)">Kurdish (Kurmanji)</option>
				<option value="Kyrgyz">Kyrgyz</option>
				<option value="Lao">Lao</option>
				<option value="Latin">Latin</option>
				<option value="Latvian">Latvian</option>
				<option value="Lithuanian">Lithuanian</option>
				<option value="Luxembourgish">Luxembourgish</option>
				<option value="Macedonian">Macedonian</option>
				<option value="Malagasy">Malagasy</option>
				<option value="Malay">Malay</option>
				<option value="Malayalam">Malayalam</option>
				<option value="Maltese">Maltese</option>
				<option value="Maori">Maori</option>
				<option value="Marathi">Marathi</option>
				<option value="Mongolian">Mongolian</option>
				<option value="Myanmar (Burmese)">Myanmar (Burmese)</option>
				<option value="Nepali">Nepali</option>
				<option value="Norwegian">Norwegian</option>
				<option value="Odia (Oriya)">Odia (Oriya)</option>
				<option value="Pashto">Pashto</option>
				<option value="Persian">Persian</option>
				<option value="Polish">Polish</option>
				<option value="Portuguese">Portuguese</option>
				<option value="Punjabi">Punjabi</option>
				<option value="Romanian">Romanian</option>
				<option value="Russian">Russian</option>
				<option value="Samoan">Samoan</option>
				<option value="Scots Gaelic">Scots Gaelic</option>
				<option value="Serbian">Serbian</option>
				<option value="Sesotho">Sesotho</option>
				<option value="Shona">Shona</option>
				<option value="Sindhi">Sindhi</option>
				<option value="Sinhala">Sinhala</option>
				<option value="Slovak">Slovak</option>
				<option value="Slovenian">Slovenian</option>
				<option value="Somali">Somali</option>
				<option value="Spanish">Spanish</option>
				<option value="Sundanese">Sundanese</option>
				<option value="Swahili">Swahili</option>
				<option value="Swedish">Swedish</option>
				<option value="Tajik">Tajik</option>
				<option value="Tamil">Tamil</option>
				<option value="Tatar">Tatar</option>
				<option value="Telugu">Telugu</option>
				<option value="Thai">Thai</option>
				<option value="Turkish">Turkish</option>
				<option value="Turkmen">Turkmen</option>
				<option value="Ukrainian">Ukrainian</option>
				<option value="Urdu">Urdu</option>
				<option value="Uyghur">Uyghur</option>
				<option value="Uzbek">Uzbek</option>
				<option value="Vietnamese">Vietnamese</option>
				<option value="Welsh">Welsh</option>
				<option value="Xhosa">Xhosa</option>
				<option value="Yiddish">Yiddish</option>
				<option value="Yoruba">Yoruba</option>
				<option value="Zulu">Zulu</option>
			</select>
		</div>
		<div class="flex">
			<button on:click={() => translateText(inputText)}>Generate</button>
		</div>
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
	textarea, input, button, select {
			font-family: inherit;
			padding: 1rem;
			margin: 1rem;
			outline: none;
			border-radius: 1rem;
			font-size: 1.2rem;
			font-weight: 600;
			width: 100%;
	}
	select {
      -webkit-appearance: none; /* remove default arrow icon for certain browsers */
      -moz-appearance: none;
      appearance: none;
      background-image: url('https://cdn-icons-png.flaticon.com/512/60/60995.png'); /* add your custom icon */
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 16px 16px;
	}
	.flex {
			display: flex;
			flex-wrap: wrap;
	}
	input {
			width: 100%;
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
      align-items: center;
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
