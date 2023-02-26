<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import logo from '$lib/images/generic-logo.png';

	let listening = false;
	let transcript = '';
	let loading = false;
	let error = null;
	let response = null;
	const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

	const toggleListening = () => {
		if (listening) {
			stopListening();
		} else {
			startListening();
		}
	};

	let recognition = null;

	const startListening = () => {
		recognition = new window.SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.onresult = handleResult;
		recognition.onerror = handleError;
		recognition.start();
		listening = true;
	};

	const stopListening = () => {
		recognition.stop();
		listening = false;
		loading = true;
		setTimeout(() => {
			sendTranscript();
		}, 2000);
	};

	const handleResult = (event) => {
		for (let i = event.resultIndex; i < event.results.length; i++) {
			if (event.results[i].isFinal) {
				transcript += event.results[i][0].transcript;
			}
		}
	};

	const handleError = (event) => {
		error = event.error;
	};

	const sendTranscript = async () => {
		try {
			const { data } = await axios.post('https://api.openai.com/v1/completions', {
				model: 'text-davinci-003',
				prompt: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: ${transcript}\nAI:`,
				temperature: 0.9,
				max_tokens: 150,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0.6,
				stop: [' Human:', ' AI:'],
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${OPENAI_API_KEY}`,
				}
			});
			response = data.choices[0].text;
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
			transcript = '';
		}
	};

	onMount(() => {
		window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	});
</script>

<section>
	<h1>Generic Express</h1>
	<div class="welcome">
		<img src={logo} alt="generic express" />
		<img src={logo} alt="generic express" />
		<img src={logo} alt="generic express" />
	</div>
	<h2>Get the answers you need with just your voice, powered by Generic Express - the effortless AI assistant. Click below to ask your first question or get a suggestion.</h2>
	{#if error}
		<p>{error}</p>
	{/if}
	<div class="flex">
		<button on:click={toggleListening}>
			{#if loading}
				<span class="loader"></span>
			{:else}
				{#if listening}
					Stop Recording
				{:else}
					New Question
				{/if}
			{/if}
		</button>
	</div>
	<div class="flex response">
		{#if response}
			<p>{response}</p>
		{/if}
	</div>
</section>

<style>
	section {
			display: flex;
			align-content: center;
			flex-direction: column;
			justify-content: center;
	}
	.flex {
      display: flex;
      align-content: center;
      justify-content: center;
	}
	.response {
			background: white;
			border-radius: 1rem;
			margin: 1rem;
	}
	.response > p {
			color: black;
			padding: 1rem 2rem;
	}
	h2 {
			display: flex;
			justify-content: center;
			text-align: center;
	}
	button {
			cursor: pointer;
			margin: 1rem;
			width: 10rem;
			height: 3rem;
			border-radius: 1rem;
			outline: none;
			border: none;
			font-size: 1rem;
			font-weight: 700;
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