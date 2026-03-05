const btnAddTask = document.querySelector(".button_add_task");
const btnViewTasks = document.querySelector(".view_tasks")
const btnBack = document.querySelector('.back')

const addTask = document.querySelector('.add_tasks')
const firstInput = document.querySelector('.first_input');
const secondInput = document.querySelector('.second_input');
const thirdInput = document.querySelector('.third_input');

const container = document.querySelector('.tasks');
container.addEventListener('click', delete_task);

btnAddTask.addEventListener('click', add_task);
btnViewTasks.addEventListener('click', task)
btnBack.addEventListener('click', back)

function add_task() {
    const first = firstInput.value;
    const second = secondInput.value;
    const third = thirdInput.value;
    
    console.log(first, second, third);

    let taskWrapper = document.createElement('div');
    taskWrapper.className = 'new-div';

    let inp = document.createElement('input');
    inp.type = 'checkbox';
    taskWrapper.appendChild(inp);

    let textSpan = document.createElement('span');
    textSpan.textContent = `${first} | ${second} | ${third}`;
    taskWrapper.appendChild(textSpan);

    let button = document.createElement('button');
    button.className = 'delete-btn';
    button.textContent = 'удалить задачу';
    taskWrapper.appendChild(button);

    container.appendChild(taskWrapper);

    firstInput.value = '';
    secondInput.value = '';
    thirdInput.value = '';
}

function delete_task(event) {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
    }

    if (event.target.type === 'checkbox') {
        const taskText = event.target.nextElementSibling;
        if (taskText) {
            taskText.style.textDecoration = event.target.checked ? 'line-through' : 'none';
            taskText.style.color = event.target.checked ? '#888' : 'black';
        }
    }
}

function task() {
    btnAddTask.style.display = 'none'
    btnViewTasks.style.display = 'none'
    addTask.style.display = 'none'
    container.style.display = 'block'
    btnBack.style.display = 'block'
}

function back() {
    btnAddTask.style.display = 'block'
    btnViewTasks.style.display = 'block'
    addTask.style.display = 'block'
    container.style.display = 'none'
    btnBack.style.display = 'none'
}