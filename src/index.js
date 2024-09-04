import { v4 as uuidv4 } from 'uuid';

function handleCors(request) {
	const headers = request.headers;
	if(
		headers.get('Origin') !== null &&
		headers.get('Access-Control-Request-Method') !== null &&
		headers.get('Access-Control-Request-Headers') !== null
	) {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		});
	} else {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			}
		});
	}
}

addEventListener('fetch', (event) => {
	if(event.request.method === 'OPTIONS') {
		event.responsWith(handleCors(event.request));
	}else{
		event.responsWith(handleRequest(event.request));
	}
});

async function handleRequest(request) {
	const url = new URL(request.url);
	const path = url.pathname;

	let response;

	if(path === '/api/tasks' && request.method === 'GET'){
		response = await getTasks();
	}else if (path === '/api/tasks' && request.method === 'POST'){
		response = await addTasks();
	}else if (path.startsWith === '/api/tasks' && request.method === 'PUT'){
		const taskId = path.split('/')[3];
		response = await updateTask(taskId, request);
	}else{
		response = new Response('Not Found', {status: 401});
	}

	response = new Response(response.body, response);
	response.headers.set('Access-Control-Allow-Origin','*');
	return response;
}

async function getTasks(){
	const tasks = await task.list();
	const taskData = await Promise.all(
		tasks.key.map(async (key) => {
			const value = await task.get(key.name);
			return JSON.parse(value);
		})
	);
	return new Response(JSON.stringify(taskData), {
		headers: { 'Content-type': 'application/json' },
	});
}

async function addTasks(request){
	const task = await request.json();
	const taskId = uuidv4();
	task.id = taskId;
	await task.put(taskId, JSON.stringify(task));
	return new Response(JSON.stringify(task), {
		headers: { 'Content-type': 'application/json' },
	});
}

async function updateTasks(taskId, request){
	const updateTask = await request.json();
	await task.put(taskId, JSON.stringify(updateTask));
	return new Response(JSON.stringify(updateTask), {
		headers: { 'Content-type': 'application/json' },
	});
}


