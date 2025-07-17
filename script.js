// Global Variables
let currentSection = 'fortune';

// Fortune Generator Variables
const fortunes = [
    "True wisdom comes not from knowledge, but from understanding.",
    "The journey of a thousand miles begins with a single step.",
    "Your future is created by what you do today, not tomorrow.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Life is what happens to you while you're busy making other plans.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "You miss 100% of the shots you don't take.",
    "Whether you think you can or you think you can't, you're right.",
    "The only impossible journey is the one you never begin.",
    "Happiness is not something ready made. It comes from your own actions.",
    "Don't watch the clock; do what it does. Keep going."
];

const fontColors = ['#e53e3e', '#38a169', '#3182ce', '#805ad5', '#d69e2e', '#2d3748'];
const backgroundColors = ['#fff5f5', '#f0fff4', '#ebf8ff', '#faf5ff', '#fffbeb', '#f7fafc'];
const borderColors = ['#e53e3e', '#38a169', '#3182ce', '#805ad5', '#d69e2e', '#4a5568'];
const fontFamilies = ['Georgia, serif', 'Arial, sans-serif', 'Times New Roman, serif', 'Helvetica, sans-serif', 'Courier New, monospace'];
const fontSizes = ['16px', '18px', '20px', '22px', '24px'];

let currentFontColorIndex = 0;
let currentBgColorIndex = 0;
let currentBorderColorIndex = 0;
let currentFontStyleIndex = 0;

// Stopwatch Variables
let currentTime = 0;
let timerInterval = null;
let isRunning = false;
let isFinished = false;
const MAX_TIME = 30;
const INTERVAL = 3;

// To-Do List Variables
let tasks = [];
let taskIdCounter = 1;

// Initialize on page load
window.onload = function() {
    console.log('Application loaded successfully');
    displayRandomFortune();
    loadTasksFromStorage();
    renderTasks();
    updateStats();
    updateStopwatchDisplay();
    updateStopwatchButtons();
};

// ================ Assignment part ====================

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionName + 'Section').classList.add('active');
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(sectionName + 'Nav').classList.add('active');
    
    currentSection = sectionName;
    console.log('Switched to section:', sectionName);
}

// ==================== Fortune generator ====================

function displayRandomFortune() {
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    document.getElementById('fortuneText').textContent = fortunes[randomIndex];
    console.log('Fortune displayed:', fortunes[randomIndex]);
}

function changeFontColor() {
    const fortuneBox = document.getElementById('fortuneBox');
    currentFontColorIndex = (currentFontColorIndex + 1) % fontColors.length;
    fortuneBox.style.color = fontColors[currentFontColorIndex];
    console.log('Font color changed to:', fontColors[currentFontColorIndex]);
}

function changeBackgroundColor() {
    const fortuneBox = document.getElementById('fortuneBox');
    currentBgColorIndex = (currentBgColorIndex + 1) % backgroundColors.length;
    fortuneBox.style.backgroundColor = backgroundColors[currentBgColorIndex];
    console.log('Background color changed to:', backgroundColors[currentBgColorIndex]);
}

function changeBorderColor() {
    const fortuneBox = document.getElementById('fortuneBox');
    currentBorderColorIndex = (currentBorderColorIndex + 1) % borderColors.length;
    fortuneBox.style.borderColor = borderColors[currentBorderColorIndex];
    console.log('Border color changed to:', borderColors[currentBorderColorIndex]);
}

function changeFontStyle() {
    const fortuneBox = document.getElementById('fortuneBox');
    currentFontStyleIndex = (currentFontStyleIndex + 1) % fontFamilies.length;
    fortuneBox.style.fontFamily = fontFamilies[currentFontStyleIndex];
    fortuneBox.style.fontSize = fontSizes[currentFontStyleIndex % fontSizes.length];
    console.log('Font style changed to:', fontFamilies[currentFontStyleIndex]);
}


// ==================== Stop watch ====================

function updateStopwatchDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    console.log({currentTime})
    timerDisplay.textContent = currentTime.toString().padStart(2, '0');
    console.log('Stopwatch display updated:', currentTime + ' seconds');
}

function updateStopwatchStatus(message, className) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = 'status ' + className;
}

function updateStopwatchButtons() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (isFinished) {
        startBtn.disabled = true;
        stopBtn.disabled = true;
        resetBtn.disabled = false;
    } else if (isRunning) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        resetBtn.disabled = false;
    } else {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        resetBtn.disabled = false;
    }
}

function startTimer() {
    if (isFinished || isRunning) {
        return;
    }

    isRunning = true;
    updateStopwatchStatus('Timer running...', 'running');
    updateStopwatchButtons();

    console.log('Stopwatch started from:', currentTime + ' seconds');

    timerInterval = setInterval(() => {
        currentTime += INTERVAL;
        updateStopwatchDisplay();

        if (currentTime >= MAX_TIME) {
            finishTimer();
        }
    }, 3000); // 3 second intervals
}

function stopTimer() {
    if (!isRunning) {
        return;
    }

    isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    
    updateStopwatchStatus('Timer stopped at ' + currentTime + ' seconds', 'stopped');
    updateStopwatchButtons();

    console.log('Stopwatch stopped at:', currentTime + ' seconds');
}

function resetTimer() {
    isRunning = false;
    isFinished = false;
    currentTime = 0;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    updateStopwatchDisplay();
    updateStopwatchStatus('Ready to start', '');
    updateStopwatchButtons();

    console.log('Stopwatch reset');
}

function finishTimer() {
    isRunning = false;
    isFinished = true;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    updateStopwatchStatus('Timer finished! Maximum time reached.', 'finished');
    updateStopwatchButtons();


    alert('Stopwatch has reached the maximum time of 30 seconds!');
}

// ==================== TO-DO LIST FUNCTIONS ====================

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    taskInput.value = '';
    
    saveTasksToStorage();
    renderTasks();
    updateStats();
    
    console.log('Task added:', newTask);
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
        updateStats();
        console.log('Task toggled:', task);
    }
}

function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
        const deletedTask = tasks.splice(taskIndex, 1)[0];
        saveTasksToStorage();
        renderTasks();
        updateStats();
        console.log('Task deleted:', deletedTask);
    }
}

function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }

    if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasksToStorage();
        renderTasks();
        updateStats();
        console.log('Completed tasks cleared');
    }
}

function renderTasks() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    if (tasks.length === 0) {
        todoList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        todoList.appendChild(li);
    });
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

function saveTasksToStorage() {
    try {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
        localStorage.setItem('taskIdCounter', taskIdCounter.toString());
        console.log('Tasks saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        alert('Error saving tasks. Please check your browser settings.');
    }
}

function loadTasksFromStorage() {
    try {
        const savedTasks = localStorage.getItem('todoTasks');
        const savedCounter = localStorage.getItem('taskIdCounter');
        
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            console.log('Tasks loaded from localStorage:', tasks);
        }
        
        if (savedCounter) {
            taskIdCounter = parseInt(savedCounter);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        tasks = [];
        taskIdCounter = 1;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== EVENT LISTENERS ====================

// Allow Enter key to add tasks
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }
});
