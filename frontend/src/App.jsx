import React from "react";
import Login from "./Pages/Login.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CreateTicket from "./Pages/CreateTicket.jsx";
import ViewTickets from "./Pages/ViewTickets.jsx";
import Profile from "./Pages/Profile.jsx";
import {jwtDecode} from "jwt-decode";
import {useState, useEffect} from "react";
import Layout from "./components/Layout.jsx";
import TicketConfirmation from "./Pages/TicketConfirmation.jsx";


function App() {

    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            const decoded = jwtDecode(token);
            setUsername(decoded.sub)
            const roles = decoded.authorities || [];
            if(roles.includes("ROLE_ADMIN")) {
                setIsAdmin(true);
            }
        }
    }, []);

    return(
        <Router>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route element={<Layout />}>

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard username={username} isAdmin={isAdmin}/>
                            </ProtectedRoute>
                        }/>

                    <Route
                        path = "/create-ticket"
                        element={
                            <ProtectedRoute>
                                <CreateTicket />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path = "/ticket-confirmation"
                        element={
                            <ProtectedRoute>
                                <TicketConfirmation />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path = "/view-tickets"
                        element={
                            <ProtectedRoute>
                                <ViewTickets />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path = "/profile"
                        element={
                            <ProtectedRoute>
                                <Profile username={username} isAdmin={isAdmin}/>
                            </ProtectedRoute>
                        }
                    />

                </Route>

            </Routes>
        </Router>
    );
}

export default App;