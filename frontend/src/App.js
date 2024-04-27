import React, { useState} from "react";
import axios from "axios";
import "./App.css";
import {useNavigate} from 'react-router-dom'


function App() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [appointment, setAppointment] = useState({ date: "", time: "" });
  const navigate = useNavigate();


  function handleUpload() {
    if (!file) {
      setMessage("No file selected");
      return;
    }

    // File size validation
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxFileSize) {
      setMessage("File size exceeds the maximum limit of 1MB.");
      return;
    }

    // Server-side file type validation
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf","application/zip"];
    if (!allowedFileTypes.includes(file.type)) {
      setMessage("Unsupported file type. Please upload .jpeg, .jpg,.zip, .png, or .pdf files.");
      return;
    }

    // Appointment date validation
    const selectedDate = new Date(appointment.date);
    const today = new Date();
    const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from today
    if (selectedDate < today || selectedDate > maxDate) {
      setMessage("Appointment date must be within the next 30 days.");
      return;
    }

    // Appointment time validation
    const selectedTime = parseInt(appointment.time.split(":")[0]);
    if (selectedTime < 8 || selectedTime >= 19) {
      setMessage("Appointment time must be between 8 am and 7 pm.");
      return;
    }

    setMessage("Uploading...");
    setProgress(0);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("date", appointment.date); // Include date in the form data
    fd.append("time", appointment.time); // Include time in the form data

    axios.post("https://validated-file-upload-react-flask-v1k5.onrender.com/upload", fd, {
      onUploadProgress: (progressEvent) => {
        setProgress((progressEvent.loaded / progressEvent.total) * 100);
      },
    })
    .then((res) => {
      setMessage("Upload Successful");
      navigate('/next')
      console.log(res.data);
    })
    .catch((err) => {
      setMessage("Upload Failed");
      navigate('/failure')
      console.error(err);
    });
  }

  return (
    <div className="App">
      <h1 className="main-heading">Welcome to Noble Hospital</h1>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={appointment.date}
          min={new Date().toISOString().split("T")[0]} // Minimum date is today
          max={new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // Maximum date is 30 days from today
          onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
        />
      </div>
      <div>
        <label>Time:</label>
        <input
          type="time"
          value={appointment.time}
          min="08:00"
          max="19:00"
          onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
        />
      </div>
      <input onChange={(e) => setFile(e.target.files[0])} type="file" />
      <span>Allowed file types: .pdf, .png, .jpg, .jpeg</span>
      <button onClick={handleUpload}>Upload</button>
      {progress > 0 && <progress value={progress} max="100"></progress>}
      {message && <span>{message}</span>}

    </div>
  );
}

export default App;
