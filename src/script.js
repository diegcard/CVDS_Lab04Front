
const mainView = document.getElementById("main-view");
const createView = document.getElementById("create-view");
const createBtn = document.getElementById("create-btn");
const taskList = document.getElementById("task-list");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const pageInfo = document.getElementById("page-info");
const searchBar = document.getElementById("search");
const deletealltasks = document.getElementById("delete-all-tasks");
const createaleatorytasks = document.getElementById("create-aleatory-task");

const tasksPerPage = 7;

let currentPage = 1;
let tasks = [];
let filteredTasks = [];

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
	getTasks();
}

/**
 * Marks a task as complete by sending a PUT request to the server.
 *
 * @param {number} id - The ID of the task to be marked as complete.
 * @returns {Promise<void>} A promise that resolves when the task is marked as complete.
 */
async function completeTask(id) {
	const response = await fetch(
		`${"http://localhost:8080/api/tasks/changeIsCompleted"}/${id}`,
		{
			method: "PATCH",
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
	console.log("Rendering tasks: ", filteredTasks);

	taskList.innerHTML = "";
	const start = (currentPage - 1) * tasksPerPage;
	const end = start + tasksPerPage;
	const paginatedTasks = filteredTasks.slice(start, end);

	let task;
	for (task of paginatedTasks) {
		const row = document.createElement("tr");
		const buttondone = task.isCompleted ? "done" : "undone";
		row.innerHTML = `
			<td class="limited-width">${task.nameTask}</td>
			<td class="limited-width">${task.descriptionTask}</td>
			<td class="limited-width">${task.estimatedTime}</td>
            <td class="limited-width">${task.difficultyLevel}</td>
			<td class="limited-width">${task.priority}</td>
			<td class="limited-width">
			<button class="complete-btn ${task.isCompleted ? "done-button" : ""}"
			type="button" data-task-id="${task.id}">${buttondone}</button>
            |
            <button type="button" class="delete-btn" data-task-id="${task.id}">Delete</button>
			|
			<button type="button" class="update-btn" data-task-id="${task.id}">Update</button>
            </td>
			</td>
		`;
		taskList.appendChild(row);
	}

	const totalPages = Math.ceil(tasks.length / tasksPerPage);
	pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
	prevBtn.disabled = currentPage === 1;
	nextBtn.disabled = currentPage >= totalPages;
	updateToTask();
	completeToTask();
	deleteToTask();
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
		filteredTasks = tasks;
		renderTasks();

	} catch (error) {
		console.log("Error fetching tasks", error);
	}
}

function deleteToTask() {
	const deleteButtons = document.getElementsByClassName("delete-btn");
	for (const button of deleteButtons) {
		button.addEventListener("click", (event) => {
			const taskId = event.target.getAttribute("data-task-id");
			deleteTask(taskId);
		});
	}
}


function completeToTask() {
	const completeButtons = document.getElementsByClassName("complete-btn");
	for (const button of completeButtons) {
		button.addEventListener("click", (event) => {
			const taskId = event.target.getAttribute("data-task-id");
			completeTask(taskId);
		});
	}
}


function updateToTask() {
	const updateButtons = document.getElementsByClassName("update-btn");
	for (const button of updateButtons) {
		button.addEventListener("click", (event) => {
			const taskId = event.target.getAttribute("data-task-id");
			const taskToUpdate = tasks.find((task) => task.id === taskId);
			localStorage.setItem("taskToUpdate", JSON.stringify(taskToUpdate));
			window.location.href = "/routes/update/index.html";
		});
	}
}


function searchTasks() {
	const query = searchBar.value.toLowerCase();
	filteredTasks = tasks.filter((task) => {
		return (
			task.nameTask.toLowerCase().includes(query) ||
			task.descriptionTask.toLowerCase().includes(query) ||
			task.estimatedTime.toLowerCase().includes(query) ||
			task.difficultyLevel.toLowerCase().includes(query) ||
			task.priority.toString().includes(query)
		);
	});
	currentPage = 1;
	renderTasks();
}

async function deleteAllTasks() {
	const response = await fetch("http://localhost:8080/api/tasks/deleteAll", {
		method: "DELETE",
	});
	getTasks();
}


async function createAleatoryTasks() {
	const response = await fetch("http://localhost:8080/api/tasks/generateRandomTasks", {
		method: "POST"
	});
	getTasks();
}

createBtn.addEventListener("click", () => {
	mainView.style.display = "none";
	createView.style.display = "block";
});


deletealltasks.addEventListener("click", deleteAllTasks);

createaleatorytasks.addEventListener("click", createAleatoryTasks);

searchBar.addEventListener("input", searchTasks);

prevBtn.addEventListener("click", () => {
	if (currentPage > 1) {
		currentPage -= 1;
		renderTasks();
	}
});

nextBtn.addEventListener("click", () => {
	const totalPages = Math.ceil(tasks.length / tasksPerPage);
	if (currentPage < totalPages) {
		currentPage++;
		renderTasks();
	}
});
getTasks();
renderTasks();
