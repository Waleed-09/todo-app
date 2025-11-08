document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const input = document.getElementById("taskInput");
  const priority = document.getElementById("priority").value;
  const task = input.value.trim();

  if (task === "") return alert("Please enter a task!");

  const taskData = {
    text: task,
    completed: false,
    priority,
    time: new Date().toLocaleString(),
  };

  saveTaskToLocal(taskData);
  displayTask(taskData);

  input.value = "";
}

function displayTask(taskData) {
  const list = document.getElementById("taskList");
  const li = document.createElement("li");

  // Top Row
  const top = document.createElement("div");
  top.className = "task-top";

  const span = document.createElement("span");
  span.textContent = taskData.text;
  span.className = "task-text";
  span.onclick = () => {
    li.classList.toggle("completed");
    updateLocalStorage();
  };

  const priorityTag = document.createElement("span");
  priorityTag.className = `priority ${taskData.priority}`;
  priorityTag.textContent = taskData.priority;

  top.appendChild(span);
  top.appendChild(priorityTag);

  // Time
  const time = document.createElement("div");
  time.className = "task-time";
  time.textContent = taskData.time;

  // Buttons
  const actions = document.createElement("div");
  actions.className = "actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit";
  editBtn.onclick = () => editTask(li, span, editBtn);

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete";
  delBtn.onclick = () => {
    li.remove();
    updateLocalStorage();
  };

  actions.append(editBtn, delBtn);

  li.append(top, time, actions);
  if (taskData.completed) li.classList.add("completed");
  list.appendChild(li);
}

function editTask(li, span, editBtn) {
  if (editBtn.textContent === "Edit") {
    const inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.value = span.textContent;
    li.querySelector(".task-top").replaceChild(inputBox, span);

    editBtn.textContent = "Save";
    editBtn.classList.replace("edit", "save");
    inputBox.focus();
  } else {
    const inputBox = li.querySelector("input");
    const newText = inputBox.value.trim() || "Untitled Task";
    const newSpan = document.createElement("span");
    newSpan.textContent = newText;
    newSpan.className = "task-text";
    newSpan.onclick = () => li.classList.toggle("completed");

    li.querySelector(".task-top").replaceChild(newSpan, inputBox);

    editBtn.textContent = "Edit";
    editBtn.classList.replace("save", "edit");
    updateLocalStorage();
  }
}

function saveTaskToLocal(taskData) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskData);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => displayTask(task));
}

function updateLocalStorage() {
  const list = document.querySelectorAll("#taskList li");
  let updatedTasks = [];
  list.forEach(li => {
    const text = li.querySelector(".task-text").textContent;
    const priority = li.querySelector(".priority").textContent;
    const completed = li.classList.contains("completed");
    const time = li.querySelector(".task-time").textContent;
    updatedTasks.push({ text, completed, priority, time });
  });
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function searchTask() {
  const searchValue = document.getElementById("searchBox").value.toLowerCase();
  const tasks = document.querySelectorAll("#taskList li");
  tasks.forEach(li => {
    const text = li.querySelector(".task-text").textContent.toLowerCase();
    li.style.display = text.includes(searchValue) ? "block" : "none";
  });
}

function toggleMode() {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("toggleMode");
  btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}
