function Todo(name, state) {
  this.name = name;
  this.state = state;
}

var todos = [];
var states = ["active", "inactive", "done"];
var tabs = ["all"].concat(states);
var currentTab = "all";

var form = document.getElementById("new-todo-form");
var input = document.getElementById("new-todo-title");

if (localStorage.getItem("todos")) {
  todos = JSON.parse(localStorage.getItem("todos"));
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

form.onsubmit = function(event) {
  event.preventDefault();
  if (input.value && input.value.length) {
    todos.push(new Todo(input.value, "active"));
    input.value = "";
    saveTodos();
    renderTodos();
  }
};

var buttons = [
  { action: "done", icon: "ok" },
  { action: "active", icon: "plus" },
  { action: "inactive", icon: "minus" },
  { action: "remove", icon: "trash" },
  { action: "up", icon: "arrow-up" },
  { action: "down", icon: "arrow-down" },
];

function renderTodos() {
  var todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  var filteredTodos = todos.filter(function (todo) {
    return todo.state === currentTab || currentTab === "all";
  });

  filteredTodos.forEach(function(todo, index) {
      var div1 = document.createElement("div");
      div1.className = "row";

      var div2 = document.createElement("div");
      div2.innerHTML =
        '<a class="list-group-item" href="#">' + todo.name + "</a>";
      div2.className = "col-xs-6 col-sm-9 col-md-10";

      var div3 = document.createElement("div");
      div3.className = "col-xs-6 col-sm-3 col-md-2 btn-group text-right";
      buttons.forEach(function(button) {
        var btn = document.createElement("button");
        btn.className = "btn btn-default btn-xs";
        btn.innerHTML =
          '<i class="glyphicon glyphicon-' + button.icon + '"></i>';
        div3.appendChild(btn);

        if (button.action === todo.state) {
          btn.disabled = true;
        }

        if (button.action === "remove") {
          btn.title = "Remove";
          btn.onclick = function() {
            if (
              confirm(
                "Are you sure you want to delete the item titled " + todo.name
              )
            ) {
              todos.splice(todos.indexOf(todo), 1);
              saveTodos();
              renderTodos();
            }
          };
        } else if (button.action === "up") {
          btn.title = "Move Up";
          btn.onclick = function () {
            if (index > 0) {
              var temp = filteredTodos[index - 1];
              filteredTodos[index - 1] = filteredTodos[index];
              filteredTodos[index] = temp;
              todos = recombineTodos(filteredTodos);
              saveTodos();
              renderTodos();
            }
          };
        } else if (button.action === "down") {
          btn.title = "Move Down";
          btn.onclick = function () {
            if (index < filteredTodos.length - 1) {
              var temp = filteredTodos[index + 1];
              filteredTodos[index + 1] = filteredTodos[index];
              filteredTodos[index] = temp;
              todos = recombineTodos(filteredTodos);
              saveTodos();
              renderTodos();
            }
          };
        } else {
          btn.title = "Mark as " + button.action;
          btn.onclick = function() {
            todo.state = button.action;
            saveTodos();
            renderTodos();
          };
        }
      });

      div1.appendChild(div2);
      div1.appendChild(div3);

      todoList.appendChild(div1);
    });

    updateBadges();
}

function recombineTodos(filteredTodos) {
  var remainingTodos = todos.filter(function (todo) {
    return filteredTodos.indexOf(todo) === -1;
  });
  return filteredTodos.concat(remainingTodos);
}

renderTodos();

function selectTab(element) {
  var tabName = element.attributes["data-tab-name"].value;
  currentTab = tabName;
  var todoTabs = document.getElementsByClassName("todo-tab");
  for (var i = 0; i < todoTabs.length; i++) {
    todoTabs[i].classList.remove("active");
  }
  element.classList.add("active");
  renderTodos();
}

function updateBadges() {
  tabs.forEach(function (tab) {
    var count = todos.filter(function (todo) {
      return tab === "all" || todo.state === tab;
    }).length;
    var badge = document.querySelector(
      '.todo-tab[data-tab-name="' + tab + '"] .badge'
    );
    if (badge) {
      badge.textContent = count;
    }
  });
}