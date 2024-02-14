import { useState } from "react";
import axios from "axios";
import './App.css'; // Import your CSS file

function App() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [msg, setMsg] = useState(null);
  const [appointment, setAppointment] = useState({ date: "", time: "" });

  function handleUpload() {
    if (!file) {
      setMsg("No File Selected");
      return;
    }

    // File size validation
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxFileSize) {
      setMsg("File size exceeds the maximum limit of 1MB.");
      return;
    }

    // Server-side file type validation
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedFileTypes.includes(file.type)) {
      setMsg("Unsupported file type. Please upload .jpeg, .jpg, .png, or .pdf files.");
      return;
    }

    // Appointment date validation
    const selectedDate = new Date(appointment.date);
    const today = new Date();
    const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from today
    if (selectedDate < today || selectedDate > maxDate) {
      setMsg("Appointment date must be within the next 30 days.");
      return;
    }

    // Appointment time validation
    const selectedTime = parseInt(appointment.time.split(":")[0]);
    if (selectedTime < 8 || selectedTime >= 19) {
      setMsg("Appointment time must be between 8 am and 7 pm.");
      return;
    }

    setMsg("Uploading...");
    setProgress((prevState) => {
      return { ...prevState, started: true };
    });

    const fd = new FormData();
    fd.append("file", file);
    fd.append("date", appointment.date); // Include date in the form data
    fd.append("time", appointment.time); // Include time in the form data

    axios
      .post("http://localhost:5000/upload", fd, { // Change the URL to your Flask backend
        onUploadProgress: (progressEvent) => {
          setProgress((prevState) => {
            return { ...prevState, pc: (progressEvent.loaded / progressEvent.total) * 100 };
          });
        },
        headers: {
          "Custom-Header": "value",
        },
      })
      .then((res) => {
        setMsg("Upload Successful");
        console.log(res.data);
      })
      .catch((err) => {
        setMsg("Upload Failed");
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
          min={new Date().toISOString().split('T')[0]} // Minimum date is today
          max={new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Maximum date is 30 days from today
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

      <button onClick={handleUpload}>Upload</button>

      {progress.started && <progress max="100" value={progress.pc}></progress>}

      {msg && <span>{msg}</span>}
    </div>
  );
}

export default App;
