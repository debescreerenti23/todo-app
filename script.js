// -----------------------------
// FASE 3 & 4: Lógica To-Do App con localStorage
// -----------------------------

// 1️⃣ Array donde guardaremos todas las tareas
// Cada tarea es un objeto: { text: "tarea", completed: false }
let tasks = [];

// 2️⃣ Función para guardar las tareas en el navegador
function saveTasks() {
    // Convierte el array tasks a JSON y lo guarda en localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 3️⃣ Función para cargar tareas desde localStorage al iniciar la app
function loadTasks() {
    // Recupera el string JSON
    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks) {
        // Convierte JSON a array de objetos
        tasks = JSON.parse(storedTasks);

        // Recorre cada tarea y la dibuja en la lista
        tasks.forEach(task => {
            createTaskElement(task);
        });
    }
}

// 4️⃣ Función para crear los elementos HTML de cada tarea
function createTaskElement(task) {
    // Creamos un <li> que contendrá el texto y el botón
    const li = document.createElement("li");

    // Creamos un <span> para el texto de la tarea
    const span = document.createElement("span");
    span.textContent = task.text;

    // Si la tarea ya está completada, aplicamos la clase CSS
    if (task.completed) {
        span.classList.add("completed");
    }

    // Evento para marcar como completada o desmarcar
    span.addEventListener("click", () => {
        task.completed = !task.completed;  // Cambia el estado en el array
        span.classList.toggle("completed"); // Cambia el estilo en el DOM
        saveTasks(); // Guarda el cambio en localStorage
        updateCounter();             // Actualizamos el contador de tareas
    });

    // Creamos el botón de eliminar
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";

    // Evento para eliminar la tarea
    
    deleteBtn.addEventListener("click", () => {
        const ok = confirm("¿Deseas eliminar esta tarea?");

        if (ok) {
        // Filtra la tarea del array
        tasks = tasks.filter(t => t !== task);

        li.remove();   // La elimina del DOM
        saveTasks();   // Guarda los cambios en localStorage
        updateCounter();             // Actualizamos el contador de tareas
        }
    });


    // Añadimos el texto y el botón dentro del <li>
    li.appendChild(span);
    li.appendChild(deleteBtn);

    // Añadimos el <li> a la lista visible en la app
    taskList.appendChild(li);
}

// -----------------------------
// 5️⃣ Capturamos los elementos del HTML
// -----------------------------
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// -----------------------------
// 6️⃣ Evento: añadir tarea al hacer click en el botón
// -----------------------------
addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim(); // Quita espacios al principio y final

    // Si el input está vacío, no hacemos nada
    if (taskText === "") {
        alert("Añade una tarea, por favor");
        return;
    } 
    

    // Creamos el objeto tarea
    const newTask = {
        text: taskText,
        completed: false
    };

    tasks.push(newTask);         // Añadimos la tarea al array
    createTaskElement(newTask);   // La mostramos en pantalla
    saveTasks();                  // Guardamos el array actualizado
    taskInput.value = "";         // Limpiamos el input
    updateCounter();             // Actualizamos el contador de tareas
});

    // Evento para crear tarea al presionar Enter

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTaskBtn.click(); // Simula click en el botón "Añadir"
    }
});

// -----------------------------
// 7️⃣ Cargar las tareas guardadas al iniciar la app
// -----------------------------
const deleteallbtn = document.querySelector(".deleteAll button");
deleteallbtn.addEventListener("click", deleteAll);  


function deleteAll() {
    const ok = confirm("¿Deseas eliminar todas las tareas?");           
    if (!ok) return;

    tasks = [];                // Vacía el array de tareas
    taskList.innerHTML = "";   // Vacía la lista en el DOM
    saveTasks();               // Guarda el array vacío en localStorage
    updateCounter();             // Actualizamos el contador de tareas
}

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

function updateCounter() {
    const total = tasks.length;     
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}

loadTasks();
updateCounter();             // Actualizamos el contador de tareas

// Reloj

const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

function updateClock() {
    const now = new Date();

    // Hora
    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");

    timeEl.innerHTML = `${hours}:${minutes}:${seconds}`;

    // Fecha
    const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const dayOfWeek = weekdays[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];

    dateEl.textContent = `${dayOfWeek}, ${day} ${month}`;
}

// Actualiza inmediatamente
updateClock();

// Y luego cada segundo
setInterval(updateClock, 1000);
