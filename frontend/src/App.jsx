import {BrowserRouter, Route, Routes} from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ProtectedRoute from "./pages/ProtectedRoute"
import { Navigate } from "react-router-dom"
import Home from "./pages/home"
import ChatRoom from "./pages/ChatRoom"
import Notification from "./pages/notification"
function App() {
  const token = localStorage.getItem("chat-token")
  return(
  <BrowserRouter>
  <Routes>
          <Route
          path="/"
          element={
            token ? <Navigate to="/home" /> : <Signup />
          }
        />
     <Route path="/login" element={<Login />}/>
       <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
       <Route path="/notifications" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
       <Route path="/chatroom" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>}/>
  </Routes>
  </BrowserRouter>
  )
}
export default App