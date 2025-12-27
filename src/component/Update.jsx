import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Update() {
  const [values, setValues] = useState({
    taskInput: "",
    taskDateInput: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  // Handle input change
  const getValues = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Fetch task data by id and populate inputs
 useEffect(() => {
   axios
     .get("http://localhost:3080/edit/" + id)
     .then((res) => {
       const data = res.data[0]; // MySQL يرجع array
       const formattedDate = data.due_date
         ? data.due_date.replace(" ", "T").slice(0, 16)
         : "";

       setValues({
         taskInput: data.task,
         taskDateInput: formattedDate,
       });
     })
     .catch((err) => console.log(err));
 }, [id]);


  // Submit updated data
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!values.taskInput.trim() || !values.taskDateInput.trim()) {
      alert("Please fill in both Task and Due Date.");
      return;
    }

    axios
      .put("http://localhost:3080/edit/" + id, {
        taskInput: values.taskInput,
        taskDateInput: values.taskDateInput,
      })
      .then((res) => {
        alert("Task updated successfully!");
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <form className="todolist" onSubmit={handleSubmit}>
      <div className="App-header">
        <h2 className="App-title">Update Task</h2>
        <p>Stay organized and productive</p>
      </div>

      <div className="input-section">
        <label>Task</label>
        <input
          type="text"
          name="taskInput"
          placeholder="What needs to be done?"
          className="taskInput"
          value={values.taskInput}
          onChange={getValues}
        />
      </div>

      <div className="input-section">
        <label>Due Date</label>
        <input
          type="datetime-local"
          name="taskDateInput"
          className="taskInput"
          value={values.taskDateInput}
          onChange={getValues}
        />
      </div>

      <div className="add">
        <button className="addTask" type="submit">
          Update Task
        </button>
      </div>
    </form>
  );
}

export default Update;
