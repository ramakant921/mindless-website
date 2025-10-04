const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("todo-list");

function addRemoveFunctionality(li) {
  const removeBtn = li.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => {
      li.remove();
    });
  }

document.querySelectorAll(".todo-list li").forEach(addRemoveFunctionality);

form.addEventListener("submit", function(e) {
  e.preventDefault();

  if (input.value.trim() !== "") {
    const li = document.createElement("li");
    li.innerHTML = `${input.value} <button class="remove-btn">✖</button>`;
    list.appendChild(li);
    addRemoveFunctionality(li);
    input.value = "";
  }
});