// Worst Code I've written in the whole project
// Spaghetti code
// Section
const sectionContainer = document.getElementById("section-container");
const addSectionBtn = document.getElementById("todo-add");
addSectionBtn.addEventListener("click", addSection);

// Todo
const todoWidget = document.getElementById("todo-widget");
const addTodoBtn = document.querySelectorAll(".todo-add-btn");
addTodoBtn.forEach(todo => {
    todo.addEventListener("click", addTodo);
});

// Section
function addSection() {
    // Remove Previous Input Form
    removeInputForm();

    // Section Template
    const sectionTemplate = document.getElementById("todo-section-template").content.cloneNode(true);
    const section = sectionTemplate.querySelector(".section");

    // Form Template
    const formTemplate = document.getElementById("input-form-template").content.cloneNode(true);

    const formSubmit = formTemplate.querySelector("button"); 
    const formInput = formTemplate.querySelector("input"); 
    formSubmit.addEventListener("click", setSectionTitle);

    // Append Child
    const sectionTitle = sectionTemplate.querySelector(".section-title");
    sectionTitle.replaceWith(formTemplate);

    sectionContainer.appendChild(section);

    // Focus The Element At Last
    formInput.focus();
    formInput.select();
}

function setSectionTitle(e) {
    e.preventDefault();

    const todoContainer = e.target.parentNode.parentNode.querySelector(".todo-list");
    const formInput = document.getElementById("input-form");
    const input = formInput.querySelector("#section-title-input");
    const title = input.value;

    const sectionTitle = document.createElement("h2");
    sectionTitle.classList.add("section-title");
    sectionTitle.innerText = title;

    formInput.replaceWith(sectionTitle);

    addTodo(null, todoContainer);
}

// ------Todo-------
function addTodo(e, todoElement) {
    // Remove Previous Input Form
    removeInputForm();
    // if(document.getElementById("input-form")) return

    let todo;
    if(e){
        todo = e.target.parentNode.querySelector(".todo-list"); 
    }
    else {
        todo = todoElement;
    }

    // Form Template
    const formTemplate = document.getElementById("input-form-template").content.cloneNode(true);
    formTemplate.querySelector("form").classList.add("margin-top");

    const formSubmit = formTemplate.querySelector("button"); 
    const formInput = formTemplate.querySelector("input"); 
    formInput.id = "todo-input";
    formInput.value = "Write a Task";
    formInput.classList.add("todo-list-item");
    formSubmit.addEventListener("click", (e) => setTodoList(e, todo));

    todo.appendChild(formTemplate);

    // Focus The Element At Last
    formInput.focus();
    formInput.select();

    todo.scrollTo(0, todo.scrollHeight);

    // Remove Input If User Doesn't wanna add todo
    // setTimeout(() => {
    //     document.addEventListener("click", removeFormInput, { once: true });
    // }, 1);
}

function setTodoList(e, todo){
    e.preventDefault();

    const formInput = document.getElementById("input-form");
    const input = document.querySelector("#todo-input");
    const task = input.value;

    const li = document.createElement("li");
    li.classList.add("todo-list-item");
    li.innerText = task;

    formInput.replaceWith(li);
    console.log(todo);
    todo.scrollTo(0, todo.scrollHeight);

    addTodo(null, todo);
}

function removeInputForm() {
    const formInput = document.getElementById("input-form");
    if(formInput) formInput.remove();
}
