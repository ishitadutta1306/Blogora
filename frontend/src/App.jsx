import { Routes, Route } from 'react-router-dom'
import  { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Login from './pages/Login'
import Homepage from './pages/Homepage'
import ProtectedRoute from './components/ProtectedRoute'
import BlogPage from './pages/BlogPage'
import ProfilePage from './pages/ProfilePage'
import CreateBlog from './pages/CreateBlog'
import SavedPosts from './pages/SavedPosts'
import EditBlog from "./pages/EditBlog"

function App() {

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false}/>

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
        <Route path='/create' element={
            <ProtectedRoute>
              <CreateBlog/>
            </ProtectedRoute>
          }
        />
        <Route path='/saved' element={
            <ProtectedRoute>
              <SavedPosts/>
            </ProtectedRoute>
          }
        />
        <Route path='/edit-post/:slug' element={
            <ProtectedRoute>
              <EditBlog/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
