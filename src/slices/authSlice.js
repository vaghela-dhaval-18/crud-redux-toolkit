// slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Define async thunk for login API call
export const loginUserAsync = createAsyncThunk(
	"auth/loginUserAsync",
	async ({ email, password }) => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/users/?email=${email}&password=${password}`
			);
			if (response.data.length > 0) {
				localStorage.setItem("loginUserId", response.data[0].id);
				toast.success("User Logged in Successfully!", {
					theme: "colored",
				});
				return response.data[0].id;
			} else {
				throw new Error("User not found");
			}
		} catch (error) {
			throw new Error("Login failed");
		}
	}
);

const initialState = {
	isAuthenticated: localStorage.getItem("loginUserId") !== null,
	userId: localStorage.getItem("loginUserId"),
	loading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginUser(state, action) {
			state.isAuthenticated = true;
			state.userId = action.payload;
		},
		logoutUser(state) {
			state.isAuthenticated = false;
			state.userId = null;
			localStorage.removeItem("loginUserId");
		},
		extraReducers: (builder) => {
			builder
				.addCase(loginUserAsync.pending, (state) => {
					state.loading = true;
					state.error = null;
				})
				.addCase(loginUserAsync.fulfilled, (state, action) => {
					state.loading = false;
					state.isAuthenticated = true;
					state.userId = action.payload;
				})
				.addCase(loginUserAsync.rejected, (state, action) => {
					state.loading = false;
					state.isAuthenticated = false;
					state.error = action.error.message;
				});
		},
	},
});

export const { loginUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
