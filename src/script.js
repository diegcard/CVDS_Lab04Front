const mainView = document.getElementById("main-view");
const createView = document.getElementById("create-view");
const createBtn = document.getElementById("create-btn");
const createForm = document.getElementById("create-form");
const taskList = document.getElementById("task-list");

const generatedIds = new Set();

let tasks = [];

function generateId() {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let id;
	do {
		id = "";
		for (let i = 0; i < 5; i++) {
			id += characters.charAt(Math.floor(Math.random() * characters.length));
		}
	} while (generatedIds.has(id));
	generatedIds.add(id);
	return id;
}

async function deleteTask(id) {
	const response = await fetch(
		`${"http://localhost:8080/api/tasks/delete"}/${id}`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	tasks = tasks.filter((task) => String(task.id) !== String(id));
	renderTasks();
	generatedIds.delete(id);
}

async function completeTask(id) {
	const response = await fetch(
		`${"http://localhost:8080/api/tasks/done"}/${id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	getTasks();
}

function renderTasks() {
	console.log("Rendering tasks: ", tasks);

	taskList.innerHTML = "";
	let task;
	for (task of tasks) {
		const row = document.createElement("tr");

		row.innerHTML = `
			<td>${task.id}</td>
			<td>${task.nameTask}</td>
			<td class="limited-width">${task.descriptionTask}</td>
			<td class="limited-width">
			<form onClick="completeTask('${task.id}')" class="horizontal-form" action="http://localhost:8080/api/tasks/done/${task.id}">
			<button class="complete-btn" type="button">✓</button>
			</form>
			|
			<form onClick="deleteTask('${task.id}')" class="horizontal-form" action="http://localhost:8080/api/tasks/delete/${task.id}">
			<button type="button" class="delete-btn">✗</button>
			</form>
			</td>
		`;
		taskList.appendChild(row);
	}
}

async function getTasks() {
	tasks = [];
	try {
		const task = await fetch("http://localhost:8080/api/tasks/all");
		const ts = await task.json();
		let tas;
		for (tas of ts) {
			tasks.push(tas);
		}
		renderTasks();
	} catch (error) {
		console.log("Error fetching tasks", error);
	}
}

createBtn.addEventListener("click", () => {
	mainView.style.display = "none";
	createView.style.display = "block";
});

createForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const taskName = document.getElementById("task-name").value;
	const Description = document.getElementById("description").value;
	const newTask = {
		id: generateId(),
		nameTask: taskName,
		descriptionTask: Description,
	};

	fetch("http://localhost:8080/api/tasks/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newTask),
	});

	createView.style.display = "none";
	mainView.style.display = "block";
	createForm.reset();
	tasks.push(newTask);
	renderTasks();
});

getTasks();
renderTasks();
