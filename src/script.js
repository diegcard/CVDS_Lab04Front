const mainView = document.getElementById("main-view");
const createView = document.getElementById("create-view");
const createBtn = document.getElementById("create-btn");
const createForm = document.getElementById("create-form");
const taskList = document.getElementById("task-list");

const generatedIds = new Set();

let tasks = [];

/**
 * Generates a unique 5-character alphanumeric ID.
 * The ID is composed of uppercase letters, lowercase letters, and digits.
 * Ensures that the generated ID is unique by checking against a set of previously generated IDs.
 *
 * @returns {string} A unique 5-character alphanumeric ID.
 */
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

/**
 * Deletes a task by its ID.
 *
 * This function sends a DELETE request to the server to remove the task with the specified ID.
 * After the task is successfully deleted, it updates the local tasks list, re-renders the tasks,
 * and removes the ID from the generatedIds set.
 *
 * @async
 * @function deleteTask
 * @param {string} id - The ID of the task to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the task is deleted and the UI is updated.
 */
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

/**
 * Marks a task as complete by sending a PUT request to the server.
 *
 * @param {number} id - The ID of the task to be marked as complete.
 * @returns {Promise<void>} A promise that resolves when the task is marked as complete.
 */
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

/**
 * Renders the list of tasks into the task list element.
 * Clears the current content of the task list and populates it with rows representing each task.
 * Each row contains the task ID, task name, task description, and action buttons for completing and deleting the task.
 *
 * @function renderTasks
 * @example
 * // Assuming `tasks` is an array of task objects and `taskList` is a DOM element:
 * renderTasks();
 */
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

/**
 * Fetches tasks from the server and renders them.
 *
 * This function makes an asynchronous request to the server to retrieve all tasks.
 * If the request is successful, it populates the `tasks` array with the fetched tasks
 * and calls the `renderTasks` function to display them. If an error occurs during the
 * fetch operation, it logs an error message to the console.
 *
 *
 * @async
 * @function getTasks
 * @returns {Promise<void>} A promise that resolves when the tasks have been fetched and rendered.
 */
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
