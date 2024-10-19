import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import LoginPage from "./pages/login/LoginPage";
import Register from "./pages/login/Register";
import ProtectedRoute from "./config/ProtectedRoute";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route element={<ProtectedRoute/>}>

                </Route>
                <Route path="*" element={<Navigate to="/login"/>}/>
            </Routes>
        </Router>
    );
}

export default App;