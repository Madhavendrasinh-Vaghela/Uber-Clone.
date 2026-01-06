import React, { useContext } from "react"
import { Route,Routes } from "react-router-dom";
import Start from "./pages/Start.jsx";
import Home from "./pages/Home.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import UserSignup from "./pages/UserSignup.jsx";
import CapatinLogin from "./pages/CaptainLogin.jsx";  
import CaptainSignup from "./pages/CaptainSignup.jsx";
import CaptainHome from "./pages/CaptainHome.jsx";
import  {UserLogout}  from "./pages/UserLogout.jsx";
import UserProtectedWrapper from "./pages/UserProtectedWrapper.jsx";
import CaptainProtectedWrapper from "./pages/CaptainProtectedWrapper.jsx";
import CaptainLogout from "./pages/CaptainLogout.jsx";
import Riding from "./pages/Riding.jsx";
import CaptainRiding from "./pages/CaptainRiding.jsx";

const App = ()=>{

  return(
    <div>
      <Routes>
        <Route path='/' element={<Start/>}/>
        <Route path='/home' element={<UserProtectedWrapper>
          <Home/>
        </UserProtectedWrapper>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/signup' element={<UserSignup/>}/>
        <Route path='/captain-login' element={<CapatinLogin/>}/>
        <Route path='/captain-signup' element={<CaptainSignup />}/>
        <Route path='/riding' element={<Riding />}/>
        <Route path='/captain-riding' element={<CaptainRiding />}/>
        <Route path='/users/logout' element={<UserProtectedWrapper>
          <UserLogout/>
        </UserProtectedWrapper>}/>
        <Route path='/Captains/logout' element={<CaptainProtectedWrapper>
          <CaptainLogout/>
        </CaptainProtectedWrapper>}/>
      <Route path="/captain-home" element={
        <CaptainProtectedWrapper>
          <CaptainHome/>
        </CaptainProtectedWrapper>
      } />
      </Routes>
      </div>
  )
}
export default App;