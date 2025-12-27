import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";

function AddTask() {
  const [values, setValues] = useState({
    taskInput: "",
    taskDateInput: "",
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();

  const getValues = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let errors = {};

    if (!values.taskInput.trim()) errors.taskInput = "Please enter a task.";
    if (!values.taskDateInput.trim())
      errors.taskDateInput = "Please choose a date.";

    setError(errors);

    if (Object.keys(errors).length === 0) {
      axios
        .post("http://localhost:3080/tasks", values)
        .then(() => {
          alert("Task added successfully!");
          navigate("/");
        })
        .catch((err) => console.log(err));

      setValues({ taskInput: "", taskDateInput: "" });
    }
  };

  return (
    <div className="container my-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-4 shadow-lg p-3 mx-auto"
        style={{ maxWidth: "600px" }}
      >
        {/* Header */}
        <div
          className="text-center text-white rounded-4 mb-4 p-4"
          style={{
            background: "linear-gradient(90deg, #0099ff, #0066cc)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2 className="fw-bold mb-1">📝 My To-Do List</h2>
          <p className="mb-0">Stay organized and productive</p>
        </div>

        {/* Task Input */}
        <div className="mb-4">
          <label className="form-label fw-semibold text-primary">Task</label>
          <input
            type="text"
            name="taskInput"
            placeholder="What needs to be done?"
            className={`form-control form-control-lg ${
              error.taskInput ? "is-invalid" : ""
            }`}
            value={values.taskInput}
            onChange={getValues}
          />
          {error.taskInput && (
            <div className="invalid-feedback">{error.taskInput}</div>
          )}
        </div>

        {/* Date Input */}
        <div className="mb-4">
          <label className="form-label fw-semibold text-primary">
            Date finished
          </label>
          <input
            type="datetime-local"
            name="taskDateInput"
            className={`form-control form-control-lg ${
              error.taskDateInput ? "is-invalid" : ""
            }`}
            value={values.taskDateInput}
            onChange={getValues}
          />
          {error.taskDateInput && (
            <div className="invalid-feedback">{error.taskDateInput}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className="d-grid">
          <button type="submit" className="btn btn-primary btn-lg">
            <FaPlusCircle className="me-2" /> Add Task
          </button>
        </div>
        <hr style={{fontWeight:"bold", padding:"12px"}}/>
        <div className="card-footer text-center text-muted">
          Task Manager App
        </div>
      </form>
    </div>
  );
}

export default AddTask;
