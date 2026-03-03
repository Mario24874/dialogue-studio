"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Plus, Tag } from "lucide-react";

type Coupon = {
  id: string;
  name: string | null;
  percent_off: number | null;
  duration: string;
  duration_in_months: number | null;
  max_redemptions: number | null;
  times_redeemed: number;
  valid: boolean;
  promo_codes: string[];
};

const PRESET_DISCOUNTS = [
  { label: "10%", percent: 10 },
  { label: "50%", percent: 50 },
  { label: "100%", percent: 100 },
];

const DURATIONS = [
  { value: "once", label: "Una vez" },
  { value: "forever", label: "Para siempre" },
  { value: "repeating", label: "Meses repetidos" },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState<number>(10);
  const [duration, setDuration] = useState("once");
  const [durationMonths, setDurationMonths] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.error) setError(data.error);
      else setCoupons(data.coupons ?? []);
    } catch {
      setError("Error cargando cupones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const createCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          percent_off: percent,
          duration,
          ...(duration === "repeating" && durationMonths
            ? { duration_in_months: Number(durationMonths) }
            : {}),
          ...(maxUses ? { max_redemptions: Number(maxUses) } : {}),
          ...(code ? { code } : {}),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setCreateError(data.error);
      } else {
        setName("");
        setCode("");
        setPercent(10);
        setDuration("once");
        setDurationMonths("");
        setMaxUses("");
        fetchCoupons();
      }
    } catch {
      setCreateError("Error creando cupón");
    } finally {
      setCreating(false);
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("¿Archivar/eliminar este cupón?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) alert(data.error);
      else setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Error eliminando cupón");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Cupones</h1>

      {/* Create form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus size={17} />
          Crear cupón
        </h2>
        <form onSubmit={createCoupon} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Nombre del cupón
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VERANO2026"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Código promo (opcional)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Autogenerado del nombre"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
              />
            </div>
          </div>

          {/* Discount presets */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Descuento</label>
            <div className="flex gap-2">
              {PRESET_DISCOUNTS.map((d) => (
                <button
                  key={d.percent}
                  type="button"
                  onClick={() => setPercent(d.percent)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    percent === d.percent
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-500"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Duración</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            {duration === "repeating" && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nº de meses
                </label>
                <input
                  type="number"
                  min="1"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Máximo de usos (opcional)
              </label>
              <input
                type="number"
                min="1"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {createError && (
            <p className="text-sm text-red-600">{createError}</p>
          )}

          <button
            type="submit"
            disabled={creating || !name}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {creating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Tag size={16} />
            )}
            Crear cupón
          </button>
        </form>
      </div>

      {/* Coupons list */}
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
        ) : coupons.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">Sin cupones</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Código(s)</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Descuento</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Duración</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Usos</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Activo</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {c.name ?? c.id}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {c.promo_codes.length > 0
                      ? c.promo_codes.join(", ")
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-semibold">
                    {c.percent_off != null ? `${c.percent_off}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {c.duration === "once"
                      ? "Una vez"
                      : c.duration === "forever"
                      ? "Siempre"
                      : `${c.duration_in_months} mes(es)`}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {c.times_redeemed}
                    {c.max_redemptions ? ` / ${c.max_redemptions}` : " / ∞"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-lg ${c.valid ? "text-green-500" : "text-red-400"}`}>
                      {c.valid ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteCoupon(c.id)}
                      disabled={deletingId === c.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                      title="Eliminar cupón"
                    >
                      {deletingId === c.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
