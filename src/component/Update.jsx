import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function UpdateTask() {
  const [values, setValues] = useState({
    taskInput: "",
    taskDateInput: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const getValues = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3080/edit/" + id)
      .then((res) => {
        const data = res.data[0];
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
      .then(() => {
        alert("Task updated successfully!");
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h3>Update Task</h3>
              <p className="mb-0">Stay organized and productive</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-primary">Edit Task</label>
                  <input
                    type="text"
                    name="taskInput"
                    placeholder="By what you want to edit?"
                    className="form-control"
                    value={values.taskInput}
                    onChange={getValues}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-primary">Edit Due Date</label>
                  <input
                    type="datetime-local"
                    name="taskDateInput"
                    className="form-control"
                    value={values.taskDateInput}
                    onChange={getValues}
                  />
                </div>

                <div className="d-grid">
                  <button className="btn btn-success" type="submit">
                    Update Task
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center text-muted">
              Task Manager App
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateTask;
