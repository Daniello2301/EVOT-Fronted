import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllUsuarios } from "../services/usuarios.service";

export default function StudentsViewDashboard() {
  const { authUser } = useAuth();
  const role = authUser?.rol;
  const isAdmin = role === "ADMIN";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsuarios();
        const normalized = Array.isArray(response)
          ? response
          : response?.results ?? response?.data ?? [];
        setUsers(normalized);
      } catch (error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <section className="p-4 md:p-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
          Esta vista es exclusiva para el rol ADMIN.
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">Gestión de usuarios</h1>
        <p className="mt-2 text-sm text-slate-600">Como administrador puedes gestionar usuarios del sistema.</p>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs uppercase tracking-wide text-blue-700">Total usuarios</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{users.length}</p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Correo</th>
                <th className="px-3 py-2">Rol</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={3}>Cargando usuarios...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={3}>No hay usuarios para mostrar.</td>
                </tr>
              ) : (
                users.slice(0, 12).map((user) => (
                  <tr className="border-t border-slate-200" key={user._id ?? user.correo}>
                    <td className="px-3 py-2">{user.nombreUsuario ?? "-"}</td>
                    <td className="px-3 py-2">{user.correo ?? "-"}</td>
                    <td className="px-3 py-2">{user.rol ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
