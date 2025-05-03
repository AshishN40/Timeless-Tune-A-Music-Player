import React from 'react'
import Login from './pages/Login.jsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import { UserData } from './context/User.jsx'
import Loading from './components/Loading.jsx'
import Admin from './pages/Admin.jsx'
import Playlist from './pages/Playlist.jsx'
import Album from './pages/Album.jsx'
import Logo from './pages/Logo.jsx'


const App = () => {
  const {loading, user, isAuth, } = UserData();
  return (
    <>
    {loading ? (<Loading/>) : (<BrowserRouter>
    <Routes>
    <Route path="/" element={  <Logo/>  } />
      <Route path="/Home" element={ isAuth ? <Home /> : <Login /> } />
      <Route path='/playlist' element = {isAuth ? <Playlist user = {user}/> : <Login/>}/>
      <Route path='/album/:id' element = {isAuth ? <Album user = {user}/> : <Login/>}/>
      <Route path="/login" element={isAuth ? <Home /> : <Login />} />
      <Route path='/admin' element = {isAuth ? <Admin/> : <Login/>}/>
      <Route path='/register' element= {isAuth ? <Home /> : <Register/>}/>
    </Routes>
    
    </BrowserRouter>)}
    </>
  )
  
}

export default App