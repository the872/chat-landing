<svelte:head>
	<title>Ask | Generic Express</title>
	<meta name="description" content="the effortless AI assistant." />
</svelte:head>
<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import logo from '$lib/images/generic-logo.png';

	let listening = false;
	let transcript = '';
	let loading = false;
	let error = null;
	let response = null;

	let audioCtx = null;
	let analyser = null;
	let dataArray = null;
	let bufferLength = null;
	let canvas = null;
	let canvasCtx = null;

	const toggleListening = () => {
		if (listening) {
			stopListening();
		} else {
			startListening();
		}
	};

	let recognition = null;
	let localStream = null;

	const startListening = () => {
		recognition = new window.SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.onresult = handleResult;
		recognition.onerror = handleError;
		recognition.start();
		listening = true;

		// initialize Web Audio API
		audioCtx = new AudioContext();
		analyser = audioCtx.createAnalyser();
		analyser.fftSize = 2048;
		bufferLength = analyser.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);

		// connect user's microphone to analyser
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			localStream = stream;
			const source = audioCtx.createMediaStreamSource(stream);
			source.connect(analyser);
			drawVisualizer();
		});
	};

	const stopListening = () => {
		const tracks = localStream.getTracks();
		tracks.forEach(track => track.stop());
		recognition.stop();
		recognition = null;
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
		const { VITE_OPENAI_API_KEY: apiKey } = import.meta.env;
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
					'Authorization': `Bearer ${apiKey}`,
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

	const drawVisualizer = () => {
		canvas = document.getElementById('visualizer');
		canvasCtx = canvas.getContext('2d');

		const WIDTH = canvas.width;
		const HEIGHT = canvas.height;

		canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
		const draw = () => {
			requestAnimationFrame(draw);
			analyser.getByteTimeDomainData(dataArray);

			canvasCtx.fillStyle = 'rgb(255, 255, 255)';
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

			canvasCtx.beginPath();

			const sliceWidth = WIDTH * 1.0 / bufferLength;
			let x = 0;

			for(let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 128.0;
				const y = v * HEIGHT / 2;

				if(i === 0) {
					canvasCtx.moveTo(x, y);
				} else {
					canvasCtx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			canvasCtx.lineTo(canvas.width, canvas.height/2);
			canvasCtx.stroke();
		};

		draw();
	};

	onMount(() => {
		window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	});
</script>
<section>
	<h1>Get the answers you need with just your voice - the effortless AI assistant.</h1>
	<h2>Click "New Question" to ask your question or get a suggestion. Press "Stop Recording" when you are finished.</h2>
	{#if error}
		<p>{error}</p>
	{/if}
	<div class="flex response">
		{#if response && !loading && !listening}
			<p>{response}</p>
		{/if}
	</div>
	<div class="flex">
		{#if loading}
			<div class="welcome">
				<img src={logo} alt="generic express" />
				<img src={logo} alt="generic express" />
				<img src={logo} alt="generic express" />
			</div>
		{:else}
			<div class="flex visualizer-wrapper">
				{#if listening}
					<canvas id="visualizer"></canvas>
				{/if}
				<button on:click={toggleListening}>
					{#if listening}
						Stop Recording
					{:else}
						New Question
					{/if}
				</button>
			</div>
		{/if}
	</div>
</section>
<style>
    main {
        max-width: 48rem;
    }
    section {
        display: flex;
        align-content: center;
        flex-direction: column;
        justify-content: center;
        height: 100%;
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
    h1 {
        margin-top: 1.5rem;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(45deg, #1E8BFF, white);
    }
    h2 {
        display: flex;
        justify-content: center;
        text-align: center;
        line-height: 2rem;
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
    .visualizer-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    canvas {
        width: 300px;
        height: 100px;
        border: 1px solid black;
        margin-right: 1rem;
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