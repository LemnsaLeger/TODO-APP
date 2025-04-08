const inputField = document.querySelector("#inputField");
const moonIcon = document.querySelector(".icon-moon");
const sunIcon = document.querySelector(".icon-sun");
const inputCheckBox = document.querySelector(".input-checkbox");
const inputCheck = document.querySelector(".inputcheckbox");
const todoContainer = document.querySelector("#container > ul");
let todoCrossIcon = document.querySelectorAll(".icon-cross");
const todoCheckbox = document.querySelector(".checkbox");
const todoCheck = document.querySelector(".todo");

let todosArray = []; // let: for modifying the array(reasign)

function CreateTodoObject(todo, status = "pending") {
  this.todo = todo;
  this.status = status;

  return { todo, status };
}

// function to add todo
function getTodo() {
  if (!inputField.value) {
    return;
  } else {
    let input;
    input = inputField.value.trim();
    const todoObject = new CreateTodoObject(input);
    todosArray.push(todoObject);

    saveTodoToLocalStorage(todoObject);
    return input;
  }
}

function todoLiItem(todoText = "") {
  let li = document.createElement("li");
  li.className = "todo-item";
  let div = document.createElement("div"); // for checkbox
  div.className = "input checkbox";

  let img = document.createElement("img");
  img.className = "todo checkbox";
  img.src = "./images/icon-check.svg";
  img.alt = "icon-check";

  let todo = document.createElement("span");
  if (todoText === "") {
    todo.textContent = getTodo(); // receive todo text from user
  } else {
    todo.textContent = todoText;
  }

  let deleteIcon = document.createElement("img");
  deleteIcon.className = "icon-cross";
  deleteIcon.src = "./images/icon-cross.svg";
  deleteIcon.alt = "icon-cross";

  li.appendChild(div);
  li.appendChild(img);
  li.appendChild(todo);
  li.appendChild(deleteIcon);

  return li;
}

// add todo to DOM on button click(checkbox)
inputCheckBox.addEventListener("click", () => {
  let li;

  li = todoLiItem();
  if (li) {
    todoContainer.prepend(li);
    deleteTodo(li);
    markTodoCompleted(li);
    updateTodoStatusInLocalStorage(li);
  }
});

// save todos in local storage
function saveTodoToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todosArray));
}

// fill the DOM with todos 
document.addEventListener("DOMContentLoaded", () => {
  let todosArray = JSON.parse(localStorage.getItem("todos")) || [];
  let li;

  todosArray.forEach((todo, index) => {
    if (todo.todo) {
      li = todoLiItem(todo.todo); // calling the function that creates li
      let span = li.querySelector("span");
      let checkbox = li.querySelector(".input");
      let check = li.querySelector(".todo");
      span.className = todo.status; // Set the saved class (status)

      if(span.className === "completed") {
        check.classList.toggle("active");
        checkbox.classList.toggle("active");
      }

      todoContainer.prepend(li); // Prepend to the DOM

      // Call deleteTodo and markTodoCompleted for each li (assuming these functions work as expected)
      deleteTodo(li);
      markTodoCompleted(li);
    }
  });
});


// function to delete a todo
const deleteTodo = (todo) => {
  let deleteIcon = todo.querySelector(".icon-cross");
  let todoText = todo.querySelector("span").textContent;
  todosArray = JSON.parse(localStorage.getItem("todos")) || [];

  let index = todosArray.findIndex((t) => t.todo === todoText);
  deleteIcon.addEventListener("click", () => {
    todo.remove(); // remove the todo from dom
    // Remove the todo from the todos array in localStorage
    todosArray.splice(index, 1); // Modify the array in place
    saveTodoToLocalStorage(); // Update localStorage
  });
};


// this function marks a todo done
const markTodoCompleted = (todo) => {
  let checkbox = todo.querySelector(".input");
  let check = todo.querySelector(".todo");
  let todoText = todo.querySelector("span");

  // mark todo complete when checkbox is clicked
  checkbox.addEventListener("click", () => {
    todoText.classList.toggle("completed");
    check.classList.toggle("active");
    checkbox.classList.toggle("active");
    updateTodoStatusInLocalStorage(todo);
  });

  // mark todo complete when todo is clicked
  todo.addEventListener("click", (event) => {
    if(event.target !== checkbox) {
        todoText.classList.toggle("completed");
        check.classList.toggle("active");
        checkbox.classList.toggle("active");
        updateTodoStatusInLocalStorage(todo);
    }
  });
}

const updateTodoStatusInLocalStorage = (todo) => {
    let todoSpan = todo.querySelector("span");
    todosArray = JSON.parse(localStorage.getItem("todos")) || [];

    let todoFromLS = todosArray.findIndex(t => t.todo === todoSpan.textContent);
    if(todoFromLS !== -1) {
         todosArray[todoFromLS].status = todoSpan.classList.contains(
           "completed"
         )
           ? "completed"
           : "active";
        saveTodoToLocalStorage();
    }
}