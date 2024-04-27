import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NextPage from "./NextPage.jsx";
import FailPage from "./failure.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>

          <Routes>
              <Route path="/" element={<App />} />
              <Route path="/next" element={<NextPage />}/>
              <Route path="/failure" element={<FailPage />}/>
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
)
