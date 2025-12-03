import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Login from './pages/Login'
// import Homepage from './pages/Homepage'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        {/* <Route path='/home' element={<Homepage/>}/> */}
      </Routes>
    </Router>
  )
}

export default App
