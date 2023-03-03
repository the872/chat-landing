<svelte:head>
	<title>Meet | Generic Express</title>
	<meta name="description" content="Find places to meet." />
	<script async defer src={`https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`}></script>

	<style>
      #map {
          width: 100%;
          height: 400px;
					border-radius: 1rem;
      }
	</style>
</svelte:head>

<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
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

	let instanceId = '';
	let userId = '';

	const dispatch = createEventDispatcher();

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					accuracy = position.coords.accuracy;
					updateMap();
				},
				(error) => {
					console.error(error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}

	function updateUrl() {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			userId = uuidv4(); // Generate a new user ID
			url.searchParams.set('user', userId);
			const instanceIdParam = url.searchParams.get('id');
			if (!instanceIdParam) {
				instanceId = uuidv4();
				url.searchParams.set('id', instanceId);
				window.history.pushState(null, '', url);
			} else {
				instanceId = instanceIdParam;
			}
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
			initMap({ lat: centerPoint.latitude, lng: centerPoint.longitude });
		}
	}


	function copyLink() {
		if (typeof navigator !== 'undefined' && navigator.share) {
			const url = new URL(window.location.href);
			navigator.share({
				title: 'Meet | Generic Express',
				url: url.toString()
			}).then(() => {
				buttonText = 'Link shared';
				dispatch('buttonTextUpdated', buttonText);
				setTimeout(() => {
					buttonText = 'Copy Link';
					dispatch('buttonTextUpdated', buttonText);
				}, 3000);
			}).catch(err => {
				console.error('Failed to share link: ', err);
			});
		} else if (typeof navigator !== 'undefined' && navigator.clipboard) {
			const url = new URL(window.location.href);
			navigator.clipboard.writeText(url.toString())
				.then(() => {
					buttonText = 'Link Copied';
					dispatch('buttonTextUpdated', buttonText);
					setTimeout(() => {
						buttonText = 'Copy Link';
						dispatch('buttonTextUpdated', buttonText);
					}, 3000);
				})
				.catch(err => {
					console.error('Failed to copy link: ', err);
				});
		} else {
			console.error('Neither Web Share API nor clipboard API is supported.');
		}
	}

	onMount(() => {
		getLocation();
		const url = new URL(window.location.href);
		const existingSessionId = url.searchParams.get('id');
		if (existingSessionId) {
			instanceId = existingSessionId;
			url.searchParams.set('id', instanceId);
			window.history.replaceState(null, '', url);
		} else {
			instanceId = uuidv4();
			url.searchParams.set('id', instanceId);
			window.history.pushState(null, '', url);
		}
		updateUrl();
		initMap();
	});



	onDestroy(() => {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.delete('id');
			url.searchParams.delete('user');
			window.history.pushState(null, '', url);
		}
	});

	let map;

	function initMap() {
		const myLatLng = { lat: 0, lng: 0 };
		map = new google.maps.Map(document.getElementById("map"), {
			center: myLatLng,
			zoom: 2,
		});
		// marker = new google.maps.Marker({
		// 	position: myLatLng,
		// 	map,
		// 	title: "Your location",
		// });
	}

	onMount(() => {
		if (typeof google !== "undefined") {
			initMap();
		} else {
			window.initMap = initMap;
		}
	});

	function updateMap() {
		const myLatLng = { lat: latitude, lng: longitude };
		map.panTo(myLatLng);
		map.setZoom(15);
		// map.setOptions({animation: google.maps.Animation.BOUNCE});
		// marker.setPosition(myLatLng);
	}

	onMount(() => {
		setTimeout(() => {
			if (typeof google !== "undefined") {
				initMap();
			} else {
				window.initMap = initMap;
			}
		}, 500);
	});

</script>
<div class="text-column">
	<h1>Meet halfway without the hassle - share a link, view the map, and meet your friends.</h1>
	<h2>Copy and send the link to your friends, once you and you friends are on the page at the same time, the map will show you the halfway point.</h2>
	<div id="map"></div>
	<div class="flex">
		<button on:click={copyLink}>{buttonText}</button>
	</div>
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
</div>

<style>
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
        margin: 2rem;
        width: 10rem;
        height: 3rem;
        border-radius: 1rem;
        outline: none;
        border: none;
        font-size: 1rem;
        font-weight: 700;
    }
    .flex {
        display: flex;
        align-content: center;
        justify-content: center;
    }
		p {
				color: transparent;
		}
</style>