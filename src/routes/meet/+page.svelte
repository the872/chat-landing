<script>
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	let latitude = '';
	let longitude = '';
	let accuracy = '';
	let buttonText = 'Copy Link';

	const centerPoint = {
		latitude: null,
		longitude: null
	};

	let otherInstances = [];

	const instanceId = uuidv4();
	const userId = uuidv4();

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					accuracy = position.coords.accuracy;
					updateCenterPoint();
				},
				(error) => {
					console.error(error);
				}
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
		}
	}

	function updateCenterPoint() {
		const locations = otherInstances.concat({
			id: instanceId,
			latitude,
			longitude
		}).map(instance => ({
			latitude: instance.latitude,
			longitude: instance.longitude
		}));
		if (locations.length > 1) {
			centerPoint.latitude = locations.reduce((total, loc) => total + loc.latitude, 0) / locations.length;
			centerPoint.longitude = locations.reduce((total, loc) => total + loc.longitude, 0) / locations.length;
			console.log('Center point:', centerPoint);
		}
	}

	function copyLink() {
		const url = new URL(window.location);
		navigator.clipboard.writeText(url.toString());
		buttonText = 'Link Copied';
		setTimeout(() => {
			buttonText = 'Copy Link';
		}, 3000);
	}

	onMount(() => {
		getLocation();
	});

</script>

<div>
	<p>Instance ID: {instanceId}</p>
	<p>User ID: {userId}</p>
	<p>Latitude: {latitude}</p>
	<p>Longitude: {longitude}</p>
	<p>Accuracy: {accuracy}</p>
	{#if centerPoint.latitude && centerPoint.longitude}
		<p>Center Point:</p>
		<p>Latitude: {centerPoint.latitude}</p>
		<p>Longitude: {centerPoint.longitude}</p>
	{/if}
	<button on:click={copyLink}>{buttonText}</button>
</div>

<style>
    h1 {
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(45deg, #1E8BFF, white);
    }
</style>

