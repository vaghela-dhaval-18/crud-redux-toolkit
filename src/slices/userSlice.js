// slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Define async thunk for login API call
export const getUserAsync = createAsyncThunk(
	"get/getUserAsync",
	async (values) => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/users`,
				values
			);
			if (response && response.data.length > 0) {
				return response.data;
			} else {
				throw new Error("User list not found");
			}
		} catch (error) {
			throw new Error("Login failed");
		}
	}
);

export const addUserAsync = createAsyncThunk(
	"add/addUserAsync",
	async (values) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_API_URL}/users`,
				values
			);
			if (response.status === 201) {
				toast.success("User Added Successfully!", {
					theme: "colored",
				});
				return response.data;

				// fetchUsers();
			}
		} catch (error) {
			throw new Error("Login failed");
		}
	}
);

export const updateUserAsync = createAsyncThunk(
	"update/updateUserAsync",
	async (userData) => {
		try {
			const response = await axios.put(
				`${process.env.REACT_APP_API_URL}/users/${userData.id}`,
				userData
			);
			if (response.status === 200) {
				toast.success("User Updated Successfully!", {
					theme: "colored",
				});
				return response.data;
			}
		} catch (error) {
			throw new Error("Failed to update user");
		}
	}
);

export const deleteUserAsync = createAsyncThunk(
	"delete/deleteUserAsync",
	async (userId) => {
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_API_URL}/users/${userId}`
			);
			if (response.status === 200) {
				toast.success("User Deleted Successfully!", {
					theme: "colored",
				});
				return userId;
			}
		} catch (error) {
			throw new Error("Failed to delete user");
		}
	}
);

const initialState = {
	users: [],
	loading: false,
	error: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(addUserAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addUserAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.users.push(action.payload);
			})
			.addCase(addUserAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(getUserAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getUserAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.users = action.payload;
			})
			.addCase(getUserAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(updateUserAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateUserAsync.fulfilled, (state, action) => {
				state.loading = false;
				const updatedUserIndex = state.users.findIndex(
					(user) => user.id === action.payload.id
				);
				if (updatedUserIndex !== -1) {
					state.users[updatedUserIndex] = action.payload;
				}
			})
			.addCase(updateUserAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(deleteUserAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteUserAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.users = state.users.filter((user) => user.id !== action.payload);
			})
			.addCase(deleteUserAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
