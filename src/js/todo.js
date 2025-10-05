const todoWidget = document.getElementById("todo-widget");
const addSectionBtn = document.getElementById("todo-add");
const addTodo = document.querySelectorAll(".section-add");
const sectionContainer = document.getElementById("section-container");

addTodo.forEach(todo => {
    todo.addEventListener("click", addTodoList);
});

console.log(addSectionBtn);
console.log(todoWidget);

addSectionBtn.addEventListener("click", addSection);

function addSection(e) {
    const section = document.createElement("div");
    section.classList.add("section");
    section.id = "insert-in-me";

    const form = document.createElement("form");
    form.id = "input-form";
    const subtitle = document.createElement("input");
    const formSubmit = document.createElement("button");
    formSubmit.type = "submit";
    formSubmit.innerText= "Add";

    formSubmit.addEventListener("click", (e) => setSectionTitle(e));
    // formSubmit.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     console.log(e);
    // }
    // );

    form.appendChild(subtitle);
    form.appendChild(formSubmit);

    subtitle.classList.add("section-title");
    subtitle.id="section-title-input";
    subtitle.value="Title";
    subtitle.focus();

    // addTodoList()
    const ul = document.createElement("ul");
    ul.classList.add("todo-list");


    // const todo = e.querySelector("div").closest("todo-list");
    // console.log(todo);

    const sectionAddTodo = document.createElement("div");
    sectionAddTodo.classList.add("todo-list-item", "section-add");
    sectionAddTodo.innerText = "+";
    sectionAddTodo.addEventListener("submit", console.log("hey"));

    section.appendChild(form);
    ul.appendChild(sectionAddTodo);
    section.appendChild(ul);

    sectionContainer.appendChild(section);

    // Get Section Title
    const sectionTitle =document.getElementById("section-title-input");
}

function addSectionBtnFunc (e) {
    e.addEventListener("click", addTodoList);
}

function setSectionTitle(e) {
    e.preventDefault();
    const formInput = document.getElementById("input-form");
    // document.getElementById("section-title-input").focus();
    // bro is distracted fix him later
    const input = formInput.querySelector("#section-title-input");
    const title = input.value;
    console.log(formInput);
    console.log(title);

    const sectionTitle = document.createElement("h2");
    sectionTitle.classList.add("section-title");
    sectionTitle.innerText = title;

    formInput.replaceWith(sectionTitle);
}

function addTodoList(e) {
    console.log(e);

    const todo = e.target.parentNode;
    console.log(todo);

    const li = document.createElement("li");
    li.classList.add("todo-list-item");
    li.innerText = "This is just me testing this shit out";


    const form = document.createElement("form");
    form.id = "input-form";
    const todoItem = document.createElement("input");
    todoItem.id = "todo-item"
    const formSubmit = document.createElement("button");
    formSubmit.type = "submit";
    formSubmit.innerText= "Add";

    formSubmit.addEventListener("click", (e) => setTodoList(e));

    form.appendChild(todoItem);
    form.appendChild(formSubmit);
    todo.appendChild(form);
}

function setTodoList(e){
    e.preventDefault();
    const formInput = document.getElementById("input-form");
    // document.getElementById("section-title-input").focus();
    // bro is distracted fix him later
    const input = formInput.querySelector("#todo-item");
    const todoItem = input.value;

    const li = document.createElement("li");
    li.classList.add("todo-list-item");
    li.innerText = todoItem;

    formInput.replaceWith(li);
}
