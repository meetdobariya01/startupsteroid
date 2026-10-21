import { useEffect, useState } from "react";
import api from "./api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/users", {
        params: { page, limit: 10, search },
      });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (e) {
      console.error("Load users error:", e.response?.data || e.message);
    }
  };

  useEffect(() => {
    load();
    /* eslint-disable-next-line */
  }, [page, search]);

  const setRole = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update role");
    }
  };

  const verify = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/verify`);
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to verify user");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div>
      <h2>Users</h2>
      <input
        className="admin-search"
        placeholder="Search username or email…"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                  No users found.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u._id}>
                <td><strong>{u.username}</strong></td>
                <td>{u.email}</td>
                <td>{u.mobile}</td>
                <td>
                  <select
                    className="role-select"
                    value={u.role}
                    onChange={(e) => setRole(u._id, e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>
                  {u.isVerified ? (
                    <span className="badge badge-verified">Verified</span>
                  ) : (
                    <span className="badge badge-pending">Pending</span>
                  )}
                </td>
                <td>
                  {!u.isVerified && (
                    <button className="btn-verify" onClick={() => verify(u._id)}>
                      Verify
                    </button>
                  )}
                  <button className="btn-delete" onClick={() => remove(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}