<script>
	import { onMount, onDestroy } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	let instanceId = '';
	let userId = '';
	let latitude = '';
	let longitude = '';
	let accuracy = '';
	let buttonText = 'Copy Link';

	const centerPoint = {
		latitude: null,
		longitude: null
	};

	let otherInstances = [];

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					accuracy = position.coords.accuracy;
					updateUrl();
					updateCenterPoint();
					connectToOtherInstances();
				},
				(error) => {
					console.error(error);
				}
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
		}
	}

	function updateUrl(removeUserId = false) {
		const url = new URL(window.location);
		const existingInstanceId = url.searchParams.get('id');
		const existingUserId = url.searchParams.get('user');
		if (existingInstanceId) {
			instanceId = existingInstanceId;
		} else {
			instanceId = uuidv4();
			url.searchParams.set('id', instanceId);
			history.pushState(null, '', url);
		}
		if (existingUserId) {
			userId = existingUserId;
		} else {
			userId = uuidv4();
			url.searchParams.set('user', userId);
			history.pushState(null, '', url);
		}
		if (removeUserId) {
			url.searchParams.delete('user');
			history.pushState(null, '', url);
		}
	}

	function connectToOtherInstances() {
		const ws = new WebSocket('ws://localhost:8080');

		ws.onopen = function() {
			console.log('WebSocket connected');
			ws.send(JSON.stringify({
				type: 'hello',
				id: instanceId,
				latitude,
				longitude
			}));
		};

		ws.onmessage = function(event) {
			const message = JSON.parse(event.data);
			switch (message.type) {
				case 'hello':
					console.log(`Received hello from instance ${message.id}`);
					otherInstances.push({
						id: message.id,
						latitude: message.latitude,
						longitude: message.longitude
					});
					break;
				case 'goodbye':
					console.log(`Received goodbye from instance ${message.id}`);
					otherInstances = otherInstances.filter(instance => instance.id !== message.id);
					break;
				case 'update':
					console.log(`Received update from instance ${message.id}`);
					const index = otherInstances.findIndex(instance => instance.id === message.id);
					if (index !== -1) {
						otherInstances[index].latitude = message.latitude;
						otherInstances[index].longitude = message.longitude;
					}
					break;
				default:
					console.warn(`Received unknown message type: ${message.type}`);
			}
			updateCenterPoint();
		};

		ws.onclose = function() {
			console.log('WebSocket disconnected');
			otherInstances.length = 0;
			updateCenterPoint();
			setTimeout(connectToOtherInstances, 5000);
		};
	}

	function copyLink() {
		const url = new URL(window.location);
		url.searchParams.delete('user');
		navigator.clipboard.writeText(url.toString());
		buttonText = 'Link Copied';
		setTimeout(() => {
			buttonText = 'Copy Link';
		}, 3000);
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

	onMount(() => {
		updateUrl();
		getLocation();
		if (instanceId) {
			document.getElementById('instance-id').innerText = instanceId;
		}
		if (userId) {
			document.getElementById('user-id').innerText = userId;
		}
	});

	onDestroy(() => {
		// Notify other instances that this instance is leaving
		otherInstances.forEach(instance => {
			const ws = new WebSocket(`ws://localhost:8080?id=${instance.id}`);
			ws.onopen = function() {
				console.log(`WebSocket connected to instance ${instance.id}`);
				ws.send(JSON.stringify({
					type: 'goodbye',
					id: instanceId
				}));
				ws.close();
			};
		});
	});

	$: {
		updateUrl(true);
	}
</script>
<div>
	<p>Instance ID: <span id="instance-id"></span></p>
	<p>User ID: <span id="user-id"></span></p>
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