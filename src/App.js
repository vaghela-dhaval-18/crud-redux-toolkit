import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UserList from "./components/UserList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	// const [isAuthenticated, setIsAuthenticated] = useState(
	// 	localStorage.getItem("loginUserId") !== null
	// );

	const isAuthenticated = useSelector(
		(state) => state.rootReducer.auth.isAuthenticated
	);

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={isAuthenticated ? <Navigate to="/list" /> : <Login />}
				/>
				<Route
					path="/list"
					element={
						<PrivateRoute>
							<UserList />
						</PrivateRoute>
					}
				/>
				<Route path="*" element={<h1>Page Not Found!</h1>} />
			</Routes>
			<ToastContainer />
		</BrowserRouter>
	);
}

export default App;
