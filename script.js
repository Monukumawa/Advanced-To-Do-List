let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function calculateProgress(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  if (today < start) return 0;
  if (today > end) return 100;

  return Math.floor(((today - start) / (end - start)) * 100);
}

function getStatus(task) {
  const today = new Date();
  const end = new Date(task.endDate);

  if (task.completed) return "completed";
  if (today > end) return "remaining";
  return "active";
}

function addTask() {
  const title = document.getElementById("title").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!title || !startDate || !endDate) {
    alert("Fill all fields");
    return;
  }

  tasks.push({
    id: Date.now(),
    title,
    startDate,
    endDate,
    completed: false
  });

  saveTasks();
  renderTasks();
}

function markCompleted(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: true } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  
  if (!confirmDelete) return;

  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}


function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt("Edit Task", task.title);
  if (newTitle) {
    task.title = newTitle;
    saveTasks();
    renderTasks();
  }
}

function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

function isToday(date) {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

function isThisWeek(date) {
  const d = new Date(date);
  const today = new Date();
  const weekEnd = new Date();
  weekEnd.setDate(today.getDate() + 7);
  return d >= today && d <= weekEnd;
}

function renderTasks() {
  activeTasks.innerHTML = "";
  remainingTasks.innerHTML = "";
  completedTasks.innerHTML = "";

  tasks.forEach(task => {
    const status = getStatus(task);

    if (
      currentFilter === "today" && !isToday(task.startDate) ||
      currentFilter === "week" && !isThisWeek(task.startDate)
    ) return;

    const progress = calculateProgress(task.startDate, task.endDate);
    const barColor = status === "remaining" ? "red" : "green";

    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      <strong>${task.title}</strong>
      <p>${task.startDate} ➡ ${task.endDate}</p>

      <div class="progress-container">
        <div class="progress-bar ${barColor}" style="width:${progress}%"></div>
      </div>

      <div class="task-buttons">
        ${!task.completed ? `<button onclick="markCompleted(${task.id})">✔ Complete</button>` : ""}
        <button onclick="editTask(${task.id})">✏ Edit</button>
        <button onclick="deleteTask(${task.id})">🗑 Delete</button>
      </div>
    `;

    if (status === "active") activeTasks.appendChild(div);
    else if (status === "remaining") remainingTasks.appendChild(div);
    else completedTasks.appendChild(div);
  });
}

renderTasks();