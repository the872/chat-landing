module.exports = (req, res) => {
	const { method, query } = req;
	const { id } = query;
	console.log(id)

	switch (method) {
		case 'GET':
			// Return a list of instances with the same ID
			res.send('ok')
			const instances = getInstances(id);
			res.status(200).json(instances);
			break;
		case 'POST':
			// Add a new instance to the list
			const { latitude, longitude } = req.body;
			addInstance({ id, latitude, longitude });
			res.status(201).end();
			break;
		case 'DELETE':
			// Remove an instance from the list
			removeInstance({ id });
			res.status(204).end();
			break;
		default:
			res.status(405).end();
			break;
	}
};

const instances = {};

function getInstances(id) {
	return instances[id] || [];
}

function addInstance({ id, latitude, longitude }) {
	if (!instances[id]) {
		instances[id] = [];
	}
	instances[id].push({ latitude, longitude });
}

function removeInstance({ id }) {
	delete instances[id];
}
