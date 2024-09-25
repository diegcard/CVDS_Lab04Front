document.addEventListener("DOMContentLoaded", () => {
	const mainView = document.getElementById("main-view");
	const createView = document.getElementById("create-view");
	const createBtn = document.getElementById("create-btn");
	const createForm = document.getElementById("create-form");
	const taskList = document.getElementById("task-list");

	const tasks = [];

	function renderTasks() {
		taskList.innerHTML = "";
		tasks.forEach((task) => {
			const row = document.createElement("tr");
			row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.name}</td>
                <td>${task.date}</td>
                <td>
                    <button class="complete-btn">✓</button>
                    <button class="delete-btn">✗</button>
                </td>
            `;
			taskList.appendChild(row);
		});
	}

	createBtn.addEventListener("click", () => {
		mainView.style.display = "none";
		createView.style.display = "block";
	});

	createForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const taskName = document.getElementById("task-name").value;
		const finalDate = document.getElementById("final-date").value;
		const newTask = {
			id: tasks.length + 1,
			name: taskName,
			date: finalDate,
		};
		tasks.push(newTask);
		renderTasks();
		createView.style.display = "none";
		mainView.style.display = "block";
		createForm.reset();
	});

	renderTasks();
});
