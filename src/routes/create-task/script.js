const createForm = document.getElementById("create-form");

/**
 * Gets the current date in the format yyyy-MM-dd.
 *
 * @returns {string} The current date in the format yyyy-MM-dd.
 */
function getCurrentDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}


/**
 * Converts a date string in the format "dd/MM/yyyy" to "yyyy-MM-dd'T'HH:mm:ss.SSS".
 *
 * @param {string} dateStr - The date string in the format "dd/MM/yyyy".
 * @returns {string} The date string in the format "yyyy-MM-dd'T'HH:mm:ss.SSS".
 */
function convertToISOFormat(dateStr) {
	const [day, month, year] = dateStr.split("/");
	const date = `${year}-${month}-${day}`;
	return date;
}

createForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const taskName = document.getElementById("task-name").value;
	const Description = document.getElementById("description").value;
	const Difficulty = document.getElementById("difficulty").value;
	const Priority = Number.parseInt(
		document.getElementById("priority").value,
		10,
	);
	const EstimatedTime = document.getElementById("est-time").value;

	const time = getCurrentDate();
	console.log(time);

	const errorMessage = document.getElementById("error-msg");

	if (EstimatedTime < time) {
		errorMessage.textContent =
			"The estimated time must be greater than or equal to the current date.";
		errorMessage.style.display = "block";
		return;
	}

	errorMessage.style.display = "none";
	const newTask = {
		nameTask: taskName,
		descriptionTask: Description,
		difficultyLevel: Difficulty,
		priority: Priority,
		estimatedTime: EstimatedTime,
	};
	console.log(newTask);

	fetch("http://localhost:8080/api/tasks/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newTask),
	});
	const successMessage = document.getElementById("success-msg");
	successMessage.style.display = "block";
	setTimeout(() => {
		successMessage.style.display = "none";
		window.location.href = "../../index.html";
	});

	createForm.reset();
});
