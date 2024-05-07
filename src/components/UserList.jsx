import axios from "axios";
import React, { useEffect, useState } from "react";
import AddEditUser from "./AddEditUser";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserAsync, getUserAsync } from "../slices/userSlice";

const UserList = () => {
  // const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.rootReducer.user.users);

  // const fetchUsers = async () => {
  // 	try {
  // 		const response = await axios.get(
  // 			`${process.env.REACT_APP_API_URL}/users`
  // 		);
  // 		setUserData(response.data);
  // 	} catch (error) {
  // 		console.log("error => ", error);
  // 	}
  // };

  const handleSignOut = () => {
    dispatch(logoutUser());
    // localStorage.removeItem("loginUserId");
    navigate("/"); // Navigate to the home page
  };

  const handleDeleteUser = async (id) => {
    await dispatch(deleteUserAsync(id));
    dispatch(getUserAsync());

    // try {
    // 	const res = window.confirm("Are you sure to delete this user?");
    // 	if (res) {
    // 		const response = await axios.delete(
    // 			`${process.env.REACT_APP_API_URL}/users/${id}`
    // 		);
    // 		if (response.status === 200) {
    // 			toast.success("User Deleted Successfully!", {
    // 				theme: "colored",
    // 			});
    // 			// fetchUsers();
    // 		}
    // 	}
    // } catch (error) {
    // 	console.log("error => ", error);
    // }
  };

  useEffect(() => {
    dispatch(getUserAsync());
  }, [dispatch]);

  useEffect(() => {
    const filteredUsers = userData.filter((user) =>
      Object.values(user).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredData(filteredUsers);
  }, [userData, searchTerm]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditUserId(null);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleEditUser = (id) => {
    setEditUserId(id);
    handleOpenModal();
  };

  return (
    <div className="container">
      <div className="border border-2 p-2 m-2">
        <div className="d-flex justify-content-between mb-5">
          <h1 className="h3">User List</h1>
          <div className="d-flex justify-content-between gap-5">
            <input
              type="text"
              className=""
              placeholder="Search by any field..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              type="button"
              className="btn btn-success"
              onClick={handleOpenModal}
            >
              Add User
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleSignOut}
            >
              Logout
            </button>
          </div>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
              <th scope="col">Phone</th>
              <th scope="col">Gender</th>
              <th scope="col">Language</th>
              <th scope="col">Address</th>
              <th scope="col" colSpan={2}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.phone}</td>
                <td>{user.gender}</td>
                <td>{user.languages.join(", ")}</td>
                <td>{user.address}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditUser(user.id)}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav>
          <nav>
            <ul className="pagination justify-content-center">
              {Array(Math.ceil(filteredData.length / usersPerPage))
                .fill()
                .map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      i + 1 === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      onClick={() => paginate(i + 1)}
                      className="page-link"
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
            </ul>
          </nav>
        </nav>

        {showModal && (
          <div
            className="modal fade show"
            tabIndex="-1"
            style={{ display: "block" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editUserId ? "Edit User" : "Add User"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <AddEditUser
                    handleCloseModal={handleCloseModal}
                    // fetchUsers={fetchUsers}
                    id={editUserId}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
