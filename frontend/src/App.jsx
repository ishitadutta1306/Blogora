import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Login from './pages/Login'
import Homepage from './pages/Homepage'
import ProtectedRoute from './components/ProtectedRoute'
import BlogPage from './pages/BlogPage'
import ProfilePage from './pages/ProfilePage'

function App() {

  return (
    <Routes>
      {/* Public routes */}
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/profile/:id' element={<ProfilePage/>}/>

      {/* Protected routes */}
      <Route path='/home' element={
          <ProtectedRoute>
            <Homepage/>
          </ProtectedRoute>
        }
      />
      <Route path='/post/:slug' element={
          <ProtectedRoute>
            <BlogPage/>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
