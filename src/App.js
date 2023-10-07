import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { React } from "react";
import Register from './components/register'
import NavBar from './components/navbar.js'
import EditPhoto from './components/editPhoto'
import { EditProfileData, EditProfilePicture } from './components/editComponents'
import HomePage from './components/homepage'

function DashBoard() {
  return (
    <div className='dashBoard'>
      <NavBar />
      <HomePage />
    </div>
  )
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Register />}
        />
        <Route
          path="/dashBoard"
          element={<DashBoard />}
        />
        <Route
          path="/editPicture"
          element={<EditProfilePicture />}
        />
        <Route
          path="/editProfileData"
          element={<EditProfileData />}
        />
        <Route
          path='/editPhoto'
          element={<EditPhoto />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
