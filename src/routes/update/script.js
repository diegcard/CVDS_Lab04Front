const taskNameInput = document.getElementById("task-name");
const difficultySelect = document.getElementById("difficulty");
const prioritySelect = document.getElementById("priority");
const estimatedTimeInput = document.getElementById("est-time");
const descriptionTextarea = document.getElementById("description");
const updateForm = document.getElementById("update-form");

// Cargar la tarea desde localStorage
const task = JSON.parse(localStorage.getItem("taskToUpdate"));
console.log(task);



if (task) {
  taskNameInput.value = task.nameTask;
  difficultySelect.value = task.difficultyLevel;
  prioritySelect.value = task.priority;
  estimatedTimeInput.value = task.estimatedTime;
  descriptionTextarea.value = task.descriptionTask;
}

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


updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const creationDate = task.creationDate;
    const Description = descriptionTextarea.value;
    const Difficulty = difficultySelect.value;
    const EstimatedTime = estimatedTimeInput.value;
    const finishDate = null;
    const id = task.id;
    const isCompleted = task.isCompleted;
    const Priority = Number.parseInt(prioritySelect.value, 10);
    const taskName = taskNameInput.value;
    
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

    const updatedTask = {
        id: id,
        isCompleted: isCompleted,
        finishDate: finishDate,
        creationDate: creationDate,
        nameTask: taskName,
        descriptionTask: Description,
        difficultyLevel: Difficulty,
        priority: Priority,
        estimatedTime: EstimatedTime,
    };

    console.log(updatedTask);
    
    
    const response = await fetch(
        `http://localhost:8080/api/tasks/update`,
        {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
        }
    );
    
    if (response.ok) {
        window.location.href = "../../index.html";
    } else {
        console.error("Failed to update the task.");
    }
    });