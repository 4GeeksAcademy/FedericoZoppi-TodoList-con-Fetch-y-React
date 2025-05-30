import React, { useEffect, useState } from "react";

const username = "federicoZoppi";
const host = 'https://playground.4geeks.com/todo';
const GET_URL = `${host}/users/${username}`;
const POST_URL = `${host}/todos/${username}`;

// ESTADOS
const TodoList = () => {
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editTodo, setEditTodo] = useState({});
  const [todos, setTodos] = useState([]);

  // HANDLERS
  const handleNewTask = event => setNewTask(event.target.value);
  const handleEditTask = event => setEditTask(event.target.value);
  const handleEditCompleted = event => setEditCompleted(event.target.checked);

  // FUNCIONES
  const getTodos = async () => {
    try {
      const response = await fetch(GET_URL);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setTodos(Array.isArray(data) ? data : data.todos || []);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;

    try {
      const response = await fetch(POST_URL, {
        method: "POST",
        body: JSON.stringify({ label: newTask, is_done: false }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      setNewTask("");
      getTodos();
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setEditTodo({});
    setEditTask("");
    setEditCompleted(false);
  };

  const handleEdit = (todo) => {
    setIsEdit(true);
    setEditTodo(todo);
    setEditTask(todo.label);
    setEditCompleted(todo.is_done);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (editTask.trim() === "") return;

    try {
      await fetch(`${host}/todos/${editTodo.id}`, {
        method: "PUT",
        body: JSON.stringify({
          label: editTask,
          is_done: editCompleted
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      setEditTask("");
      setEditCompleted(false);
      setEditTodo({});
      setIsEdit(false);
      getTodos();
    } catch (error) {
      console.error("Error modificando tarea:", error);
    }
  };

  const clearAll = () => {
    Promise.all(
      todos.map(todo =>
        fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
          method: "DELETE"
        })
      )
    ).then(() => setTodos([]));
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${host}/todos/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        getTodos();
      } else {
        console.error("Error eliminando tarea:", response.status);
      }
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="todo-container">
      <h1 className="text-success">📝 Todo List whit Featch</h1>

      {isEdit ? (
        <form className="mb-5" onSubmit={handleSubmitEdit}>
          <div className="input-section row">
            <div className="col-12 col-sm-8">
              <label htmlFor="exampleInputPassword1" className="form-label">Editar tarea</label>
              <input
                type="text"
                className="form-control"
                id="exampleInputPassword1"
                value={editTask}
                onChange={handleEditTask}
                placeholder="Nueva tarea..."
              />
            </div>
          </div>
          <div className="col-sm-4 mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
              checked={editCompleted}
              onChange={handleEditCompleted}
            />
            <label htmlFor="exampleCheck1" className="col-12 form-check-label">Completado</label>
          </div>

          <div className="button-section d-flex justify-content-center">
            <button type="submit" className="btn btn-primary me-2">Modificar</button>
            <button type="reset" onClick={handleCancel} className="btn btn-secondary">Cancelar</button>
          </div>
        </form>
      ) : (
        <form>
          <div className="input-section row">
            <div className="col-12 col-sm-8">
              <label htmlFor="exampleTask" className="form-label">Agregar tarea</label>
              <input
                type="text"
                className="form-control"
                id="exampleTask"
                value={newTask}
                onChange={handleNewTask}
                onKeyDown={e => e.key === "Enter" && addTask()}
                placeholder="Nueva tarea..."
              />
            </div>
            <div className="col-12 col-sm-4">
              <button onClick={addTask} className="botonAgregar btn btn-primary w-100">
                Agregar
              </button>
            </div>
          </div>
        </form>
      )}

      <div>
        <h1 className="text-primary">List</h1>
        <ul>
          {todos.length === 0 ? (
            <li className="empty">No hay tareas</li>
          ) : (
            <>
              {todos.map(todo => (
                <li key={todo.id}>
                  <div className="spanes">
                    {todo.is_done ? <span>👍</span> : <span>👀</span>}
                  </div>
                  {todo.label}
                  <div className="buttons">
                    <button onClick={() => handleEdit(todo)}>📝</button>
                    <button onClick={() => deleteTask(todo.id)}>🗑️</button>
                  </div>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-end align-items-center">
                <span className="badge bg-warning rounded-pill">
                  Hay {todos.filter(todo => !todo.is_done).length} tareas pendientes
                </span>
              </li>
            </>
          )}
        </ul>

        {todos.length > 0 && (
          <button className="clear" onClick={clearAll}>
            Eliminar todas
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoList;
