// -----------------------------
// TO-DO APP con localStorage
// -----------------------------

let tasks = [];

// Guardar tareas
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Cargar tareas
function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        tasks.forEach(task => createTaskElement(task));
    }
}

// Crear tarea en el DOM
function createTaskElement(task) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
        span.classList.add("completed");
    }

    // Completar tarea
    span.addEventListener("click", () => {
        task.completed = !task.completed;
        span.classList.toggle("completed");
        saveTasks();
        updateCounter();
    });

    // Editar tarea
    span.addEventListener("dblclick", () => {
        startEditTask(span, task);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";

    deleteBtn.addEventListener("click", () => {
        if (!confirm("¿Eliminar tarea?")) return;
        tasks = tasks.filter(t => t !== task);
        li.remove();
        saveTasks();
        updateCounter();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Editar tarea
function startEditTask(span, task) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;

    span.replaceWith(input);
    input.focus();

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") finishEditTask(input, span, task);
    });

    input.addEventListener("blur", () => {
        finishEditTask(input, span, task);
    });
}

function finishEditTask(input, span, task) {
    const newText = input.value.trim();
    if (newText === "") return;

    task.text = newText;
    span.textContent = newText;
    input.replaceWith(span);
    saveTasks();
}

// -----------------------------
// Elementos HTML
// -----------------------------

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text === "") return alert("Añade una tarea");

    const newTask = { text, completed: false };
    tasks.push(newTask);
    createTaskElement(newTask);
    saveTasks();
    taskInput.value = "";
    updateCounter();
});

taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter") addTaskBtn.click();
});

// Eliminar todas
document.querySelector(".deleteAll button").addEventListener("click", () => {
    if (!confirm("¿Eliminar todas las tareas?")) return;
    tasks = [];
    taskList.innerHTML = "";
    saveTasks();
    updateCounter();
});

// Contador
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

function updateCounter() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = total - completed;
}

loadTasks();
updateCounter();

// -----------------------------
// RELOJ
// -----------------------------

const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

function updateClock() {
    const now = new Date();

    timeEl.textContent =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0") + ":" +
        String(now.getSeconds()).padStart(2, "0");

    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

updateClock();
setInterval(updateClock, 1000);

// -----------------------------
// WIDGET DEL TIEMPO
// -----------------------------

let weatherCity = document.getElementById("weatherCity");
const weatherTemp = document.getElementById("weatherTemp");
const weatherDesc = document.getElementById("weatherDesc");

const API_KEY = "53af2a587748aae5d8c43ffc0f6580e4";


// Función asíncrona para obtener el tiempo de una ciudad
async function getWeather(city) {

    try {
        // 1️⃣ Hacemos la petición a la API de OpenWeather
        // - q=${city} → ciudad que queremos consultar
        // - units=metric → grados en Celsius
        // - lang=es → descripciones en español
        // - appid=${API_KEY} → nuestra clave personal
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=${API_KEY}`
        );

        // 2️⃣ Si la respuesta no es correcta (ej: ciudad mal escrita)
        // response.ok es false si el status no es 200
        if (!response.ok) {
            throw new Error("Ciudad no encontrada");
        }

        // 3️⃣ Convertimos la respuesta a formato JSON
        // Aquí ya tenemos acceso a los datos reales
        const data = await response.json();

        // 4️⃣ Mostramos el nombre real de la ciudad
        // (La API puede devolver el nombre corregido)
        weatherCity.textContent = data.name;

        // 5️⃣ Mostramos la temperatura redondeada
        weatherTemp.textContent = `${Math.round(data.main.temp)} °C`;

        // 6️⃣ Guardamos el tipo principal de clima
        // Esto es más estable que usar description
        const weatherMain = data.weather[0].main;

        // 7️⃣ Según el tipo de clima, elegimos icono
        // Usamos switch porque es más limpio que muchos if
        switch(weatherMain) {

            case "Clear":
                weatherDesc.textContent = "☀️ Cielo despejado";
                break;

            case "Clouds":
                weatherDesc.textContent = "☁️ Nublado";
                break;

            case "Rain":
            case "Drizzle":
                weatherDesc.textContent = "🌧️ Lluvia";
                break;

            case "Snow":
                weatherDesc.textContent = "❄️ Nieve";
                break;

            case "Thunderstorm":
                weatherDesc.textContent = "⛈️ Tormenta";
                break;

            case "Mist":
            case "Fog":
                weatherDesc.textContent = "🌫️ Niebla";
                break;

            default:
                // Si el clima no coincide con ninguno anterior,
                // mostramos la descripción real que envía la API
                weatherDesc.textContent = `🌤️ ${data.weather[0].description}`;
        }

    } catch (error) {

        // 8️⃣ Si ocurre cualquier error (API caída, ciudad incorrecta, etc)
        weatherCity.textContent = "Tiempo no disponible";
        weatherTemp.textContent = "";
        weatherDesc.textContent = error.message;

        console.error(error);
    }
}


// Editar ciudad
function editCity() {
    const input = document.createElement("input");
    input.type = "text";
    input.value = weatherCity.textContent;

    weatherCity.replaceWith(input);
    input.focus();

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") saveCity(input.value, input);
    });

    input.addEventListener("blur", () => {
        saveCity(input.value, input);
    });
}

function saveCity(cityName, input) {
    const city = cityName.trim();
    if (city === "") return;

    localStorage.setItem("weatherCity", city);

    const span = document.createElement("span");
    span.id = "weatherCity";
    span.textContent = city;
    span.addEventListener("dblclick", editCity);

    input.replaceWith(span);
    weatherCity = span;

    getWeather(city);
}

weatherCity.addEventListener("dblclick", editCity);

// Ciudad inicial
const savedCity = localStorage.getItem("weatherCity") || "Murcia";
getWeather(savedCity);




