const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("todo-list");

function addRemoveFunctionality(li) {
<<<<<<< HEAD
  const removeBtn = li.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => {
      li.remove();
    });
  }
=======
    const removeBtn = li.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => {
        li.remove();
    });
}
>>>>>>> 46ee2b3ddf9f36d3c1fa4fdcba1bc04cbec34381

document.querySelectorAll(".todo-list li").forEach(addRemoveFunctionality);

form.addEventListener("submit", function(e) {
<<<<<<< HEAD
  e.preventDefault();

  if (input.value.trim() !== "") {
    const li = document.createElement("li");
    li.innerHTML = `${input.value} <button class="remove-btn">✖</button>`;
    list.appendChild(li);
    addRemoveFunctionality(li);
    input.value = "";
  }
});
=======
    e.preventDefault();

    if (input.value.trim() !== "") {
        const li = document.createElement("li");
        li.innerHTML = `${input.value} <button class="remove-btn">✖</button>`;
        list.appendChild(li);
        addRemoveFunctionality(li);
        input.value = "";
    }
});
>>>>>>> 46ee2b3ddf9f36d3c1fa4fdcba1bc04cbec34381
