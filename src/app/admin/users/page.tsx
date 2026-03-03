"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

type Subscription = { status: string };
type User = {
  id: string;
  email: string;
  created_at: string;
  subscriptions: Subscription[];
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async (p: number, q: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/users?page=${p}&search=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setUsers(data.users ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      setError("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers(1, search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  useEffect(() => {
    fetchUsers(page, search);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const deleteUser = async (id: string, email: string) => {
    if (!confirm(`¿Eliminar usuario ${email}? Esta acción no se puede deshacer.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) alert(data.error);
      else fetchUsers(page, search);
    } catch {
      alert("Error eliminando usuario");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(total / 20);

  const getSubStatus = (subs: Subscription[]) => {
    if (!subs || subs.length === 0) return null;
    return subs.find((s) => s.status === "active" || s.status === "trialing")?.status ?? subs[0].status;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Usuarios</h1>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">Sin usuarios</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Registrado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Suscripción</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const subStatus = getSubStatus(u.subscriptions);
                return (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-mono text-xs">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString("es")}
                    </td>
                    <td className="px-4 py-3">
                      {subStatus ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            subStatus === "active" || subStatus === "trialing"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {subStatus}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteUser(u.id, u.email)}
                        disabled={deletingId === u.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                        title="Eliminar usuario"
                      >
                        {deletingId === u.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>
            {total} usuario{total !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
