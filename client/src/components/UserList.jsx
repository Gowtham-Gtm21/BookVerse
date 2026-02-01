import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const getUsers = async () => {
    try {
      const role = "buyer";
      const res = await axios.get(
        `http://localhost:8080/user/get-user/${role}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data.allUser);
    } catch (err) {}
  };

  const deleteUsers = async (id) => {
    try {
      const ok = window.confirm("Delete this user? This action is permanent.");
      if (!ok) return;

      await axios.delete(`http://localhost:8080/user/delete-user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optimistically remove user from UI
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("User deleted!");
    } catch (err) {}
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (!token) navigate("/");
  });

  if (token && role === "admin") {
    return (
      <div className="container mt-4 ul-wrapper">
        <h2 className="text-center mb-2 ul-title">User List</h2>
        <p className="ul-subtitle text-center">Manage registered users</p>

        <div className="table-responsive-sm table-responsive-md table-responsive-lg">
          <table className="table table-bordered table-hover text-center align-middle ul-table">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined At</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6">No Users Found</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td className="text-start">{user.name || "N/A"}</td>
                    <td className="text-start">{user.email}</td>
                    <td>{user.role || "user"}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm ul-delete-btn"
                        onClick={() => deleteUsers(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default UserList;
