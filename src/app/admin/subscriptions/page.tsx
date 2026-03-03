"use client";

import { useEffect, useState } from "react";
import { Loader2, XCircle } from "lucide-react";

type Subscription = {
  id: string;
  status: string;
  price_id: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  users: { email: string } | null;
};

const MONTHLY_PRICE = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY;
const ANNUAL_PRICE = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL;

function getPlan(priceId: string) {
  if (MONTHLY_PRICE && priceId === MONTHLY_PRICE) return "Mensual";
  if (ANNUAL_PRICE && priceId === ANNUAL_PRICE) return "Anual";
  return priceId.slice(0, 14) + "…";
}

const STATUS_FILTERS = ["all", "active", "canceled", "past_due", "trialing"];

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchSubs = async (status: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/subscriptions?status=${status}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else setSubs(data.subscriptions ?? []);
    } catch {
      setError("Error cargando suscripciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs(statusFilter);
  }, [statusFilter]);

  const cancelSub = async (id: string) => {
    if (!confirm("¿Cancelar esta suscripción inmediatamente?")) return;
    setCancelingId(id);
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "cancel" }),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else fetchSubs(statusFilter);
    } catch {
      alert("Error cancelando suscripción");
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Suscripciones</h1>

      {/* Status filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === s
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "all" ? "Todas" : s}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        ) : subs.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">Sin suscripciones</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Usuario</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Inicio</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fin</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">
                      {s.users?.email ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{getPlan(s.price_id)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.status === "active" || s.status === "trialing"
                            ? "bg-green-100 text-green-700"
                            : s.status === "past_due"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.status}
                        {s.cancel_at_period_end && " (cancela)"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {s.current_period_start
                        ? new Date(s.current_period_start).toLocaleDateString("es")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {s.current_period_end
                        ? new Date(s.current_period_end).toLocaleDateString("es")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(s.status === "active" || s.status === "trialing") && (
                        <button
                          onClick={() => cancelSub(s.id)}
                          disabled={cancelingId === s.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          {cancelingId === s.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <XCircle size={13} />
                          )}
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-gray-400">{subs.length} resultado(s)</p>
    </div>
  );
}
