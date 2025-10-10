// The Worst Code I've written in this whole project
//
// ----------querySelectors----------
// Section
const sectionContainer = document.getElementById("todo-container");
const addSectionBtn = document.getElementById("todo-add");
addSectionBtn.addEventListener("click", addSection);

// ----------Run Code----------
loadData();

// ----------Functions----------
//
// Load Data From LocalStorage
function loadData() {
  const sections = JSON.parse(localStorage.getItem("todo"));
  if (!sections) return;

  const sectionContainer = document.getElementById("todo-container");

    sections.forEach(sectionObj => {
        // Clone Section Template
        const sectionTemplate = document
            .getElementById("todo-section-template")
            .content.cloneNode(true);

        const section = sectionTemplate.querySelector(".section");
        section.id = sectionObj.id;
        section.querySelector(".section-title").innerText = sectionObj.title;

        // Get todo list container
        const todoList = section.querySelector(".todo-list");

        // Loop through todos
        sectionObj.elements.forEach(todo => {
            const listItemTemplate = document
                .getElementById("todo-list-item-template")
                .content.cloneNode(true);
            const listItem = listItemTemplate.querySelector(".section-list-item");
            const listInput = listItemTemplate.querySelector(".isCompleted");
            const listItemText = listItem.querySelector(".text");

            listItemText.innerText = todo;

            listInput.addEventListener("change", () => removeTodoItem(section.id, todo, listItem));

            todoList.appendChild(listItem);
        });

        sectionContainer.appendChild(section);
    });

    // addEventListener 
    const addTodoBtn = document.querySelectorAll(".todo-add-btn");
    addTodoBtn.forEach(todo => {
        todo.addEventListener("click", addTodo);
    });
}

// -----Section------
function addSection() {
    // Remove Previous Input Form
    removeInputForm();

    // Section Template
    const sectionTemplate = document.getElementById("todo-section-template").content.cloneNode(true);
    const section = sectionTemplate.querySelector(".section");
    const uuid = generateSectionId(); // assign random id to manipulate todo data
    section.id = uuid;

    // Form Template
    const formTemplate = document.getElementById("input-form-template").content.cloneNode(true);

    const formSubmit = formTemplate.querySelector("button"); 
    const formInput = formTemplate.querySelector("input"); 
    formSubmit.addEventListener("click", (e) => setSectionTitle(e, uuid));

    // Append Child
    const sectionTitle = sectionTemplate.querySelector(".section-title");
    sectionTitle.replaceWith(formTemplate);

    sectionContainer.appendChild(section);

    // Focus The Element At Last
    formInput.focus();
    formInput.select();
}

function setSectionTitle(e, uuid) {
    e.preventDefault();

    const todoContainer = e.target.parentNode.parentNode.querySelector(".todo-list");
    const formInput = document.getElementById("input-form");
    const input = formInput.querySelector("#section-title-input");
    const title = input.value;

    const sectionTitle = document.createElement("h2");
    sectionTitle.classList.add("section-title");
    sectionTitle.innerText = title;

    formInput.replaceWith(sectionTitle);

    // Store Section Data To LocalStorage
    saveSection(title, uuid);

    // addEventListener 
    const addTodoBtn = document.querySelectorAll(".todo-add-btn");
    addTodoBtn.forEach(todo => {
        todo.addEventListener("click", addTodo);
    });

    addTodo(null, todoContainer);
}

// ------Todo-------
function addTodo(e, todoElement=null) {
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
    formInput.classList.add("section-list-item");
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

    const listItemTemplate = document
        .getElementById("todo-list-item-template")
        .content.cloneNode(true);
    const listItem = listItemTemplate.querySelector(".section-list-item");
    console.log(listItem);
    const listItemText = listItem.querySelector(".text");
    listItemText.innerText = task;

    // Store Todo in LocalStorage
    const sectionId = todo.parentNode.id;
    saveTodo(sectionId, task);

    // isCompleted Checkbox Event Listener
    const listInput = listItemTemplate.querySelector(".isCompleted");
    listInput.addEventListener("change", () => removeTodoItem(sectionId, task, listItem));

    formInput.replaceWith(listItem);
    todo.scrollTo(0, todo.scrollHeight);


    addTodo(null, todo);
}

function removeTodoItem(sectionId, text, listItem) {
  listItem.remove();

  let sections = JSON.parse(localStorage.getItem("todo"));
  const section = sections.find(obj => obj.id == sectionId);
  section.elements = section.elements.filter(t => t.trim() != text.trim());
  localStorage.setItem("todo", JSON.stringify(sections));
}

function removeInputForm() {
    const formInput = document.getElementById("input-form");
    if(formInput) formInput.remove();
}

function generateSectionId() {
    return Math.random().toString(36).slice(2, 11);
}

// -------LocalStorage-------
function saveSection(title, id) {
    const data = {
        id,
        title,
        elements:[]
    }

    let sections = JSON.parse(localStorage.getItem("todo"));
    if(sections) {
        sections.push(data);
    }
    else {
       sections = [ data ]
    }

    localStorage.setItem("todo", JSON.stringify(sections));
}

function saveTodo(sectionId, todo) {
    let sections = JSON.parse(localStorage.getItem("todo"));
    let section = sections.find(obj => obj.id == sectionId)
    section.elements.push(todo);
    
    localStorage.setItem("todo", JSON.stringify(sections));
}
