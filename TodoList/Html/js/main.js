// Ensure f7App is available (usually provided by F7Wrapper)
// const f7App = new Framework7(); // Or Framework7.instance;

let todos = [];

// Load Todos from DroidScript storage
function loadTodos() {
    try {
        let data = app.LoadText("todos", "[]", "fileTodo");
        todos = JSON.parse(data);
        if (!Array.isArray(todos)) {
            todos = [];
        }
    } catch (e) {
        console.error("Failed to load or parse todos:", e);
        todos = [];
    }
}

// Save Todos to DroidScript storage
function saveTodos() {
    try {
        app.SaveText("todos", JSON.stringify(todos), "fileTodo");
    } catch (e) {
        console.error("Failed to save todos:", e);
    }
}

// Render Todo List
function renderTodoList() {
    let listContainer = $$("#todoList");
    listContainer.empty();

    if (todos.length === 0) {
        listContainer.append('<li class="item-content"><div class="item-inner"><div class="item-title">No todos yet!</div></div></li>');
        return;
    }

    todos.forEach(function(todo) {
        const todoHtml = `
            <li class="${todo.completed ? 'completed-todo' : ''}" data-id="${todo.id}">
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title">${todo.text}</div>
                        <div class="item-after">
                            <a href="#" class="toggle-complete-btn"><i class="f7-icons">${todo.completed ? 'checkmark_alt_circle_fill' : 'circle'}</i></a>
                            <a href="#" class="delete-todo-btn" style="margin-left: 10px;"><i class="f7-icons">trash</i></a>
                        </div>
                    </div>
                </div>
            </li>
        `;
        listContainer.append(todoHtml);
    });
}

// Event listener for adding a new todo
$$(document).on('click', '#addTodoFab', function() {
    f7App.dialog.prompt("What do you need to do?", "New Todo", function(text) {
        if (text && text.trim() !== "") {
            const newTodo = {
                text: text.trim(),
                completed: false,
                id: Date.now() 
            };
            todos.push(newTodo);
            saveTodos();
            renderTodoList();
        }
    });
});

// Event delegation for toggling todo completion
$$(document).on('click', '.toggle-complete-btn', function(e) {
    const listItem = $$(this).closest('li');
    const todoId = listItem.data('id');
    
    const todo = todos.find(t => t.id == todoId); // Use == for type coercion if id is stored as string
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodoList();
    }
});

// Event delegation for deleting a todo
$$(document).on('click', '.delete-todo-btn', function(e) {
    const listItem = $$(this).closest('li');
    const todoId = listItem.data('id');

    f7App.dialog.confirm("Are you sure you want to delete this todo?", "Delete Todo", function() {
        todos = todos.filter(t => t.id != todoId); // Use != for type coercion
        saveTodos();
        renderTodoList();
    });
});

// Initial load when the home page is shown
$$(document).on("page:afterin", '.page[data-name="home"]', function() {
    loadTodos();
    renderTodoList();
});
