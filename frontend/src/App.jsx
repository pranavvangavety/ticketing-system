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
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Unauthorized from "./Pages/Unauthorized.jsx";
import AdminViewTickets from "./Pages/AdminViewTickets.jsx";
import AdminViewUsers from "./Pages/AdminViewUsers.jsx";
import AdminUserTickets from "./Pages/AdminUserTickets.jsx";
import AdminCreatedTickets from "./Pages/AdminCreatedTickets.jsx";
import AdminAnalytics from "./Pages/AdminAnalytics.jsx";
import UserAnalytics from "./Pages/UserAnalytics.jsx";
import SessionExpiredModal from "./components/SessionExpiredModal.jsx";


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
                localStorage.setItem("role", "ROLE_ADMIN");
                setIsAdmin(true);
            }else{
                localStorage.setItem("role", "ROLE_USER");
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

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path = "/unauthorized"
                        element={<Unauthorized />}
                    />

                    <Route
                        path="/admin/tickets"
                        element = {
                            <ProtectedRoute>
                                <AdminRoute>
                                    <AdminViewTickets />
                                </AdminRoute>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                        <ProtectedRoute>
                            <AdminViewUsers />
                        </ProtectedRoute>
                        }
                    />

                    <Route
                        path = "/admin/users/:username/tickets"
                        element={
                            <ProtectedRoute>
                                <AdminUserTickets />
                            </ProtectedRoute>
                        }
                    />

                    <Route

                        path = "/admin/created-tickets"
                        element={
                            <ProtectedRoute>
                                <AdminCreatedTickets/>
                            </ProtectedRoute>
                        }

                    />

                    <Route

                        path = "/admin/analytics"
                        element={
                            <ProtectedRoute>
                                <AdminAnalytics />
                            </ProtectedRoute>
                        }

                    />

                    <Route

                        path = "/analytics"
                        element={
                            <ProtectedRoute>
                                <UserAnalytics />
                            </ProtectedRoute>
                        }

                    />

                </Route>

            </Routes>
        </Router>
    );
}

export default App;