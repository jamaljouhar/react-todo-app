import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // All, Completed, NotCompleted

  useEffect(() => {
    axios
      .get("http://localhost:3080/tasks")
      .then((res) => {
        const tasksWithCompleted = res.data.map((task) => ({
          ...task,
          completed: task.completed || false,
        }));
        setData(tasksWithCompleted);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios
        .delete(`http://localhost:3080/delete/${id}`)
        .then(() => {
          setData(data.filter((task) => task.id !== id));
        })
        .catch((err) => console.log(err));
    }
  };

  const toggleCompleted = (id) => {
    setData(
      data.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredData = data
    .filter((task) => {
      if (filter === "Completed") return task.completed;
      if (filter === "NotCompleted") return !task.completed;
      return true;
    })
    .filter((task) => task.task.toLowerCase().includes(search.toLowerCase()));

  return (
    <Fragment>
      {/* HEADER */}
      <header className="container my-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center bg-primary text-white p-3 rounded">
          <h1 className="h3 mb-2">📋 To Do List</h1>
          <Link to="/addTask" className="btn btn-success">
            <i className="bi bi-plus-circle"></i> Add Task
          </Link>
        </div>
      </header>

      {/* NAVBAR */}
      <nav className="container d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div className="btn-group">
          {["All", "Completed", "NotCompleted"].map((item) => (
            <button
              key={item}
              className={`btn btn-outline-primary ${
                filter === item ? "active" : ""
              }`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="form-control w-auto flex-grow-1"
          placeholder="🔎 Search task..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </nav>

      {/* TABLE */}
      <div className="container table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th scope="col">Done</th>
              <th scope="col">Task</th>
              <th scope="col">Created At</th>
              <th scope="col">Due Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((task) => (
              <tr
                key={task.id}
                className={
                  task.completed
                    ? "table-secondary text-decoration-line-through"
                    : ""
                }
              >
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleCompleted(task.id)}
                  />
                </td>
                <td>{task.task}</td>
                <td>{task.created_at}</td>
                <td>{task.due_date}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm me-1"
                    onClick={() => handleDelete(task.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  <Link
                    to={`/Update/${task.id}`}
                    className="btn btn-warning btn-sm text-dark"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default Home;
