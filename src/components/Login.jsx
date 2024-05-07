import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAsync, logoutUser } from "../slices/authSlice";

const Login = () => {
	const navigate = useNavigate();

	const dispatch = useDispatch();
	// const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	// const loading = useSelector((state) => state.auth.loading);
	// const error = useSelector((state) => state.auth.error);

	const validationSchema = Yup.object().shape({
		email: Yup.string().email("Invalid email").required("Email is required"),
		password: Yup.string()
			.min(6, "Password must be at least 6 characters")
			.required("Password is required"),
	});

	const formik = useFormik({
		initialValues: { email: "", password: "" },
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				// const response = await axios.get(
				// 	`${process.env.REACT_APP_API_URL}/users/?email=${values.email}&password=${values.password}`,
				// 	{
				// 		email: values.email,
				// 		password: values.password,
				// 	}
				// );
				// if (response.data.length > 0) {
				// 	localStorage.setItem("loginUserId", response.data[0].id);
				// 	navigate("/list");
				// 	toast.success("User Logged in Successfully!", {
				// 		theme: "colored",
				// 	});
				// } else {
				// 	toast.error("User not found!", {
				// 		theme: "colored",
				// 	});
				// }

				const email = values.email; // Get email from form input
				const password = values.password;

				await dispatch(loginUserAsync({ email, password }));
				navigate("/list");
				// toast.success("User Logged in Successfully!", {
				// 	theme: "colored",
				// });
			} catch (error) {
				console.log("error is => ", error);
			}
		},
	});

	return (
		<div className="container m-2 p-2 d-flex justify-content-center align-items-center flex-column">
			<form onSubmit={formik.handleSubmit}>
				<div>
					<h1>Login</h1>
				</div>
				<div className="m-2">
					<label htmlFor="email" className="form-label">
						Email
					</label>
					<input
						type="text"
						id="email"
						name="email"
						className="form-control"
						{...formik.getFieldProps("email")}
					/>
					{formik.touched.email && formik.errors.email ? (
						<div className="text-danger">{formik.errors.email}</div>
					) : null}
				</div>
				<div className="m-2">
					<label htmlFor="email" className="form-label">
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						className="form-control"
						{...formik.getFieldProps("password")}
					/>
					{formik.touched.password && formik.errors.password ? (
						<div className="text-danger">{formik.errors.password}</div>
					) : null}
				</div>
				<div>
					<button type="submit" className="btn btn-primary">
						Login
					</button>
				</div>
			</form>
		</div>
	);
};

export default Login;
