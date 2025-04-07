const inputField = document.querySelector("#inputField");
const moonIcon = document.querySelector(".icon-moon");
const sunIcon = document.querySelector(".icon-sun");
const inputCheckBox = document.querySelector(".input-checkbox");
const inputCheck = document.querySelector(".inputcheckbox");
const todoContainer = document.querySelector("#container .todos-container");
const todoCrossIcon = todoContainer.querySelector("li .icon-cross");
const todoCheckbox = document.querySelector(".checkbox");
const todoCheck = document.querySelector(".todo");

// function to add todo
function getTodo() {
    if(!inputField.value) {
        return;
    } else {
            let input;
            input = inputField.value.trim();
            return input;
    }
}

function todoLiItem() {
    let li = document.createElement("li");
    let div = document.createElement("div"); // for checkbox
    div.className = "input checkbox";

    let img = document.createElement("img");
    img.className = "todo checkbox";
    img.src = "./images/icon-check.svg";
    img.alt = "icon-check";

    let todo = document.createElement("span");
    todo.textContent = getTodo(); // receive todo text from user

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
    if(li) {
            todoContainer.prepend(li);
            console.log(li);
    }
});