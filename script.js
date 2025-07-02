document.addEventListener("DOMContentLoaded", function () {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        updateTaskList();
        updatestates();
    }
});

let tasks = [];

const saveTasks = () => {
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
const addtask = () => {
    const taskInput = document.getElementById("taskinput");
    const text = taskInput.value.trim();
    if (text) {
        // Set a flag to indicate this task is new
        tasks.push({ text: text, completed: false, isNew: true });
        taskInput.value = "";
    }
    updateTaskList();
    updatestates();
    saveTasks();
};

const ToggleTaskComplete = (index) => {
    const wasIncomplete = !tasks[index].completed;
    tasks[index].completed = !tasks[index].completed;
    
    updateTaskList();
    updatestates();
    saveTasks();
};
const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
    updatestates();
    saveTasks();
};
const editTask = (index) => {
    const taskInput = document.getElementById("taskinput");
    taskInput.value = tasks[index].text;
    deleteTask(index);
    updatestates();
    saveTasks();
};

const updatestates = () => {   
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = completedTasks / totalTasks * 100;
    
    const progressBar = document.getElementById("profill");
    progressBar.style.width = `${progress}%`;

    document.getElementById("tskcont").innerText = `${completedTasks} / ${totalTasks}`;
    
    // Update the motivational text based on completion status
    const motivationText = document.querySelector(".headercard p");
    if (totalTasks > 0 && completedTasks === totalTasks) {
        motivationText.textContent = "Well done!";
        
        // Show celebration on main container when all tasks completed
        const mainCard = document.querySelector(".maincard");
        const celebration = document.createElement('div');
        celebration.className = 'celebrate';
        mainCard.appendChild(celebration);
        setTimeout(() => {
            celebration.remove();
        }, 2000);
    } else {
        motivationText.textContent = "Keep it up!";
    }
}


const updateTaskList = () => {
    const taskList = document.getElementById("tasklist");
    taskList.innerHTML = "";

    const sortedTasks = tasks.slice().sort((a, b) => a.completed - b.completed);

    sortedTasks.forEach(task => {
        const index = tasks.indexOf(task);
        const listItemId = `task-${index}`;
        const newClass = task.isNew ? " new" : "";
        const completeClass = task.completed ? " completed" : "";

        const listitem = document.createElement("li");
        listitem.id = listItemId; 
        listitem.innerHTML = `
            <div class="taskitem${newClass}${completeClass}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} onchange="ToggleTaskComplete(${index})">
                <p class="tasktext ${task.completed ? "completed" : ""}">${task.text}</p>
                <div class="icons">
                    <img src="edit.png" alt="edit" class="edit" onclick="editTask(${index})">
                    <img src="delete.png" alt="delete" class="delete" onclick="deleteTask(${index})">
                </div>
            </div>
        `;
        taskList.appendChild(listitem);

        if (task.isNew) task.isNew = false;
    });
};

document.getElementById("addtaskbtn").addEventListener("click", function (e) {
    e.preventDefault();
    addtask();
});

document.getElementById('taskinput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    document.getElementById('addtaskbtn').click();
  }
});

document.getElementById('clearallbtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        updateTaskList();
        updatestates();
        saveTasks();
    }
});