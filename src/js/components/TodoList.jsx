import React, { useEffect, useState } from "react";

const username = "federicoZoppi";
const GET_URL = `https://playground.4geeks.com/todo/users/${username}`;
const POST_URL = `https://playground.4geeks.com/todo/todos/${username}`;

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

const getTodos = () => {
  fetch(GET_URL)
      .then(res => res.json())
      .then(data => setTodos(Array.isArray(data.todos) ? data.todos : []))
      .catch(error => console.error("Error al cargar tareas:", error));
}
  // Cargar tareas al iniciar
  useEffect(() => {
    getTodos();
   
  }, []);


  const reloadTasks = () => {
    fetch(GET_URL)
      .then(res => res.json())
      .then(data => setTodos(Array.isArray(data.todos) ? data.todos : []));
  };

  const addTask = () => {
    if (input.trim() === "") return;


    fetch(POST_URL, {
      method: "POST",
      body: JSON.stringify({ label: input, is_done: false }),
      headers: { "Content-Type": "application/json" }
    })
      .then(() => {
        setInput("");
        reloadTasks();
      });
  };
  
  

  const deleteTask = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE"
    }).then(() => reloadTasks());
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

  


  return (
    <div className="todo-container">
      <h1>📝 TODO List</h1>
      <div className="input-section row">
        <div className="col-12 col-sm-8">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            placeholder="Nueva tarea..."
            className="form-control"
          />
        </div>
        <div className="col-12 col-sm-4">
          <button onClick={addTask} className="btn btn-primary w-100">
            Agregar
          </button>
        </div>
      </div>
      <ul>
        {todos.length === 0 && <li className="empty">No hay tareas</li>}
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.label}
            <button onClick={() => deleteTask(todo.id)}>❌</button>
          </li>
        ))}
        <li>
          <button onClick={getTodos} className="btn btn-secondary">
            Recargar
          </button>
        </li>
      </ul>

      

      {todos.length > 0 && (
        <button className="clear" onClick={clearAll}>
          Eliminar todas
        </button>
      )}
    </div>
    
  )
  ;
};

export default TodoList;
