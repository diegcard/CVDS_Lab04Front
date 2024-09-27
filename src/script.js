document.addEventListener("DOMContentLoaded", () => {
	const mainView = document.getElementById("main-view");
	const createView = document.getElementById("create-view");
	const createBtn = document.getElementById("create-btn");
	const createForm = document.getElementById("create-form");
	const taskList = document.getElementById("task-list");

	const tasks = [
		{ id: 1, name: "Task 1", description: "Description 1", date: "2021-10-10" },
	];

	function renderTasks() {
		taskList.innerHTML = "";
		let task;
		for (task of tasks) {
			const row = document.createElement("tr");
			row.innerHTML = `
				<td>${task.id}</td>
				<td>${task.name}</td>
				<td>${task.description}</td>
				<td>${task.date}</td>
				<td>
					<button class="complete-btn">✓</button>
					<button class="delete-btn">✗</button>
				</td>
			`;
			taskList.appendChild(row);
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
		const finalDate = document.getElementById("final-date").value;
		const newTask = {
			id: tasks.length + 1,
			name: taskName,
			description: Description,
			date: finalDate,
		};

		/* 
		fetch("http://localhost:8080/api/tasks/all", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newTask),
		}); */

		const Tasks = await fetch("http://localhost:8080/api/tasks/all");
		const ts = await Tasks.json();
		console.log(ts);
		tasks.push(newTask);

		/**
		 * const tasks = await fetch("http://localhost:8080/tasks")
		 */

		renderTasks();
		createView.style.display = "none";
		mainView.style.display = "block";
		createForm.reset();
	});

	renderTasks();
});
