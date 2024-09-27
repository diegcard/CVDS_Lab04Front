document.addEventListener("DOMContentLoaded", () => {
	const mainView = document.getElementById("main-view");
	const createView = document.getElementById("create-view");
	const createBtn = document.getElementById("create-btn");
	const createForm = document.getElementById("create-form");
	const taskList = document.getElementById("task-list");

	const tasks = [];

	function renderTasks() {
		taskList.innerHTML = "";
		let task;
		for (task of tasks) {
			const row = document.createElement("tr");
			row.innerHTML = `
				<td>${task.id}</td>
				<td>${task.nameTask}</td>
				<td>${task.descriptionTask}</td>
				<td>
					<button class="complete-btn">✓</button>
					<button class="delete-btn">✗</button>
				</td>
				`;
			taskList.appendChild(row);
		}
	}

	async function getTasks() {
		try {
			const task = await fetch("http://localhost:8080/api/tasks/all");
			const ts = await task.json();
			let tas;
			for (tas of ts) {
				tasks.push(tas);
			}
			renderTasks();
			console.log("ts", tasks);
		} catch (error) {
			console.log("Error fetching tasks", error);
		}
	}

	function completeTask(id) {
		console.log("complete", id);
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
			id: tasks.length + 1,
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

		renderTasks();
		createView.style.display = "none";
		mainView.style.display = "block";
		createForm.reset();
	});
	getTasks();
	renderTasks();
});
