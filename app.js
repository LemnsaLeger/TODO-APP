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
  let input;
  input = inputField.value.trim();
  if (!input) {
    return;
  } else {
    const todoObject = new CreateTodoObject(input);
    todosArray.push(todoObject);
    upadteTodoCount(todosArray); // update the todos count
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
    let input;
    input = inputField.value.trim();
  if(!input) {
    return;
} else {
  li = todoLiItem();
   let text = li.querySelector("span").textContent;
   if (text !== "" || text !== " " || !text) {
     todoContainer.prepend(li);

     // clear input field immediately after the user adds todo
     inputField.value = "";

     deleteTodo(li);
     markTodoCompleted(li);
     updateTodoStatusInLocalStorage(li);
     upadteTodoCount(todosArray);
   }
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

      if (span.className === "completed") {
        check.classList.toggle("active");
        checkbox.classList.toggle("active");
      }

      todoContainer.prepend(li); // Prepend to the DOM

      // Call deleteTodo and markTodoCompleted for each li (assuming these functions work as expected)
      deleteTodo(li);
      markTodoCompleted(li);
      upadteTodoCount(todosArray);
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
    upadteTodoCount(todosArray); // update todo count
    saveTodoToLocalStorage(); // Update localStorage
    upadteTodoCount(todosArray);
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
    upadteTodoCount(todosArray);
  });

  // mark todo complete when todo is clicked
  todo.addEventListener("click", (event) => {
    if (event.target !== checkbox) {
      todoText.classList.toggle("completed");
      check.classList.toggle("active");
      checkbox.classList.toggle("active");
      updateTodoStatusInLocalStorage(todo);
      upadteTodoCount(todosArray);
    }
  });
};

const updateTodoStatusInLocalStorage = (todo) => {
  let todoSpan = todo.querySelector("span");
  todosArray = JSON.parse(localStorage.getItem("todos")) || [];

  let todoFromLS = todosArray.findIndex((t) => t.todo === todoSpan.textContent);
  if (todoFromLS !== -1) {
    todosArray[todoFromLS].status = todoSpan.classList.contains("completed")
      ? "completed"
      : "active";
    saveTodoToLocalStorage();
  }
};

// this function updates todo counts
const upadteTodoCount = (todos) => {
  let counter = document.querySelector("#container > ul > li > p.count");
  counter.textContent = `${todos.length} item(s) left`;
};

// filter todos
const filterTodos = (todos, filter) => {
  let allTodos = JSON.parse(localStorage.getItem("todos")) || [];
  let arr = [];
  switch (filter) {
    case "All":
      arr = allTodos;
      break;

    case "Active":
      arr = allTodos.filter(
        (t) => t.status === "pending" || t.status === "active"
      );
      break;

    case "Completed":
      arr = allTodos.filter((t) => t.status === "completed");
      break;
  }
  return arr;
};

// adding an event listener to the filters
let filters = document.querySelectorAll("#container > ul > li > ul > li");
filters.forEach((f) => {
  f.addEventListener("click", (e) => {
    colorFilterb(f);
    let domTodos = document.querySelectorAll("#container > ul > li.todo-item");
    domTodos.forEach((t) => t.remove());

    let filter = e.target.textContent;
    let filteredTodos = filterTodos(todosArray, filter);
    filteredTodos.forEach((t) => {
      let todoLI = todoLiItem(t.todo);
      let status = todoLI.querySelector("span");
      status.className = t.status;

      // prepend rhe todo to the dom
      document.querySelector("#container > ul").prepend(todoLI);

      // manage the todoe
      markTodoCompleted(todoLI);
      deleteTodo(todoLI);
      updateTodoStatusInLocalStorage(todoLI);
      upadteTodoCount(todosArray);
    });
  });
});

// color a clicked filter
const colorFilterb = (filter) => {
  filters.forEach(f => f.classList.remove("active"));

  filter.classList.add("active");
}

// clear all todos
const clearTodos = () => {
  let clearBtn = document.querySelector(
    "#container > ul > li.footer > p.clear-btn"
  );
  
  clearBtn.addEventListener("click", () => {
    localStorage.clear();
    todosArray.splice(0, todosArray.length);
    upadteTodoCount(todosArray);

        let domTodos = document.querySelectorAll(
          "#container > ul > li.todo-item"
        );
        domTodos.forEach((t) => t.remove());
  });
}

clearTodos();