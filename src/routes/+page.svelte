<script>
	import logo from '$lib/images/generic-logo.png';

	const launchDate = new Date(2023, 2, 1); // March 1, 2023
	let countdownInterval = null;
	let countdownTime = null;


	const handleClick = () => {
		const allDayStart = new Date(launchDate.getFullYear(), launchDate.getMonth(), launchDate.getDate(), 0, 0, 0);
		const allDayEnd = new Date(launchDate.getFullYear(), launchDate.getMonth(), launchDate.getDate() + 1, 0, 0, 0);
		const calendarUrl = encodeURI(`BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//Generic Express//EN
    BEGIN:VEVENT
    SUMMARY:Generic Express Launches on iMessage
    DESCRIPTION:Generic Express launches on iMessage bringing a state of the art AI chatbot to the convenience of your native messages app
    DTSTART;VALUE=DATE:${allDayStart.toISOString().substring(0, 10).replace(/-/g, '')}
    DTEND;VALUE=DATE:${allDayEnd.toISOString().substring(0, 10).replace(/-/g, '')}
    LOCATION:https://generic.express
    END:VEVENT
    END:VCALENDAR`);
		const downloadLink = document.createElement('a');
		downloadLink.href = `data:text/calendar;charset=utf-8,${calendarUrl}`;
		downloadLink.download = 'Generic Express Launches.ics';
		downloadLink.click();
	};

	const startCountdown = () => {
		countdownInterval = setInterval(() => {
			const now = new Date();
			const difference = launchDate - now;
			if (difference > 0) {
				const days = Math.floor(difference / (1000 * 60 * 60 * 24));
				const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
				const minutes = Math.floor((difference / (1000 * 60)) % 60);
				const seconds = Math.floor((difference / 1000) % 60);
				if (days > 0) {
					countdownTime = `${days} days ${hours > 0 ? `${hours} hours` : ''} ${minutes > 0 ? `${minutes} minutes` : ''} ${seconds > 0 ? `${seconds} seconds` : ''}`;
				} else if (hours > 0) {
					countdownTime = `${hours > 0 ? `${hours} hours` : ''} ${minutes > 0 ? `${minutes} minutes` : ''} ${seconds > 0 ? `${seconds} seconds` : ''}`;
				} else if (minutes > 0) {
					countdownTime = `${minutes > 0 ? `${minutes} minutes` : ''} ${seconds > 0 ? `${seconds} seconds` : ''}`;
				} else {
					countdownTime = `${seconds} 'seconds'`;
				}
			} else {
				clearInterval(countdownInterval);
				countdownTime = 'Launch time!';
			}
		}, 1000);
	};

	startCountdown();
</script>

<svelte:head>
	<title>Generic Express</title>
	<meta name="description" content="Streamline your messaging experience with Generic Express for iMessage" />
</svelte:head>

<section>
	<div class="welcome">
		<img src={logo} alt="generic express" />
		<img src={logo} alt="generic express" />
		<img src={logo} alt="generic express" />
	</div>
	<h1>
		COMING SOON
	</h1>
	<h2>
		Get the answers you need at your fingertips with Generic Express, the AI assistant available on iMessage.
	</h2>
	<button on:click={handleClick}>
		{#if countdownTime}
			{countdownTime}
		{:else}
			Add to Calendar
		{/if}
	</button>
</section>


<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    h1,
    h2 {
        text-align: center;
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

    button {
        margin-top: 2em;
        padding: 1em;
        font-size: 1.25em;
        border-radius: 0.5em;
        border: none;
        background-color: #1E8BFF;
        color: #fff;
        cursor: pointer;
        transition: background-color 0.3s ease;
        box-shadow: 0 0.5em 1em rgba(30, 139, 255, 0.2);
    }

    button:hover,
    button:focus {
        background-color: #0077CC;
        outline: none;
    }

    button:active {
        transform: translateY(0.2em);
        box-shadow: none;
    }

    .countdown span {
        display: inline-block;
        margin: 0.5em;
        padding: 0.25em;
        background-color: #1E8BFF;
        color: #fff;
        border-radius: 0.25em;
        box-shadow: 0 0.25em 0.5em rgba(30, 139, 255, 0.2);
    }
</style>
