import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import ReCAPTCHA from 'react-google-recaptcha';

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleCaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const [recaptchaToken, setRecaptchaToken] = useState(null);


    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Send in login request", {username, password});

        if (!recaptchaToken) {
            setErrorMessage("Please complete the CAPTCHA.");
            return;
        }

        axios.post('http://localhost:8080/auth/login', {
            username: username,
            password: password,
            recaptchaToken: recaptchaToken
        })
            .then(response => {

                console.log("Login success: ", response.data)

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('lastLogin', response.data.lastLogin);
                console.log("Backend lastLogin:", response.data.lastLogin);


                const decoded = jwtDecode(response.data.token);
                const role = decoded.authorities?.[0];


                localStorage.setItem("role", role);
                localStorage.setItem('username', username);

                if(role === "ROLE_ADMIN") {
                    console.log("Navigating to Admin dashboard ")
                    navigate("/admin");
                } else {
                    console.log("Navigating to dashboard ")
                    navigate("/dashboard");
                }

            })
            .catch(error => {
                setErrorMessage(error.response?.data?.message || 'Login Failed');
            });
        console.log("Username: ", username);
        console.log("Password: ", password);
    }


    return(
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className=" bg-white p-8 rounded-xl shadow-lg w-full max-w-md ">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        {errorMessage && (
                            <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
                        )}
                        <label htmlFor="username" className="block text-base font-medium text-gray-800 mb-1 mt-1">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-black rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />

                    </div>

                    <div>
                        <label htmlFor="password" className="block text-base font-medium text-gray-800 mb-1 mt-1">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-black rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>


                    <div className="flex justify-center my-4">
                        <ReCAPTCHA
                            sitekey="6LcKF30rAAAAADLPuZOzauGCipNJQr4___zPf-8w"
                            onChange={handleCaptchaChange}
                        />
                    </div>



                    <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 mt-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-black">Login</button>
                </form>

            </div>

        </div>
    );
}

export default Login;