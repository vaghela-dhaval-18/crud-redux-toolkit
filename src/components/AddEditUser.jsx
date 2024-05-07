import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
	addUserAsync,
	getUserAsync,
	updateUserAsync,
} from "../slices/userSlice";

const AddEditUser = ({ handleCloseModal, fetchUsers, id }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get(`http://localhost:3001/users/${id}`);
				if (response.status === 200) {
					formik.setFieldValue("firstName", response.data.firstName);
					formik.setFieldValue("lastName", response.data.lastName);
					formik.setFieldValue("email", response.data.email);
					formik.setFieldValue("password", response.data.password);
					formik.setFieldValue("phone", response.data.phone);
					formik.setFieldValue("gender", response.data.gender);
					formik.setFieldValue("languages", response.data.languages);
					formik.setFieldValue("address", response.data.address);
				}
			} catch (error) {
				console.log(error);
			}
		};

		if (id) {
			fetchUser();
		}
	}, [id]);

	const initialValues = {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		phone: "",
		gender: "",
		languages: [],
		address: "",
	};

	const validationSchema = Yup.object().shape({
		firstName: Yup.string()
			.min(3, "First Name must be at least 3 characters")
			.required("First Name is required"),
		lastName: Yup.string()
			.min(3, "Last Name must be at least 3 characters")
			.required("Last Name is required"),
		email: Yup.string().email("Invalid email").required("Email is required"),
		password: Yup.string()
			.min(6, "Password must be at least 6 characters")
			.required("Password is required"),
		phone: Yup.string()
			.matches(/^\d{10}$/, "Phone number must be 10 digits")
			.required("Phone number is required"),
		gender: Yup.string().required("Gender is required"),
		languages: Yup.array().min(1, "At least one language is required"),
		address: Yup.string().required("Address is required"),
	});

	const handleSubmit = async (values) => {
		try {
			if (!id) {
				await dispatch(addUserAsync(values));
				dispatch(getUserAsync());
			} else {
				const userData = { id: id, ...values };
				await dispatch(updateUserAsync(userData));
				dispatch(getUserAsync());
			}

			formik.resetForm();
			handleCloseModal();
		} catch (error) {
			console.log(error);
		}
	};

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: handleSubmit,
	});

	return (
		<div className="container">
			<form onSubmit={formik.handleSubmit}>
				<div className="mb-3">
					<label htmlFor="firstName" className="form-label">
						First Name
					</label>
					<input
						type="text"
						id="firstName"
						name="firstName"
						className="form-control"
						{...formik.getFieldProps("firstName")}
					/>
					{formik.touched.firstName && formik.errors.firstName ? (
						<div className="text-danger">{formik.errors.firstName}</div>
					) : null}
				</div>
				<div className="mb-3">
					<label htmlFor="lastName" className="form-label">
						Last Name
					</label>
					<input
						type="text"
						id="lastName"
						name="lastName"
						className="form-control"
						{...formik.getFieldProps("lastName")}
					/>
					{formik.touched.lastName && formik.errors.lastName ? (
						<div className="text-danger">{formik.errors.lastName}</div>
					) : null}
				</div>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						className="form-control"
						{...formik.getFieldProps("email")}
					/>
					{formik.touched.email && formik.errors.email ? (
						<div className="text-danger">{formik.errors.email}</div>
					) : null}
				</div>
				<div className="mb-3">
					<label htmlFor="password" className="form-label">
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
				<div className="mb-3">
					<label htmlFor="phone" className="form-label">
						Phone
					</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						className="form-control"
						{...formik.getFieldProps("phone")}
					/>
					{formik.touched.phone && formik.errors.phone ? (
						<div className="text-danger">{formik.errors.phone}</div>
					) : null}
				</div>
				<div className="mb-3">
					<label htmlFor="gender" className="form-label">
						Gender
					</label>
					<select
						id="gender"
						name="gender"
						className="form-select"
						{...formik.getFieldProps("gender")}
					>
						<option value="">Select Gender</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Other">Other</option>
					</select>
					{formik.touched.gender && formik.errors.gender ? (
						<div className="text-danger">{formik.errors.gender}</div>
					) : null}
				</div>
				<div className="mb-3">
					<label htmlFor="languages" className="form-label">
						Languages
					</label>
					<select
						id="languages"
						name="languages"
						className="form-select"
						multiple
						{...formik.getFieldProps("languages")}
					>
						<option value="English">English</option>
						<option value="Spanish">Spanish</option>
						<option value="French">French</option>
						<option value="Hindi">Hindi</option>
					</select>
					{formik.touched.languages && formik.errors.languages ? (
						<div className="text-danger">{formik.errors.languages}</div>
					) : null}
				</div>
				<div className="mb-3">
					<label htmlFor="address" className="form-label">
						Address
					</label>
					<textarea
						id="address"
						name="address"
						className="form-control"
						{...formik.getFieldProps("address")}
					/>
					{formik.touched.address && formik.errors.address ? (
						<div className="text-danger">{formik.errors.address}</div>
					) : null}
				</div>
				<button
					type="submit"
					className="btn btn-primary"
					disabled={formik.isSubmitting}
				>
					{id ? "Update User" : "Add User"}
				</button>
			</form>
		</div>
	);
};

export default AddEditUser;
