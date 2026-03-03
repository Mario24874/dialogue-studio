"use client";

import { useEffect, useState } from "react";
import { Users, CreditCard, TrendingUp, MessageSquare, Loader2 } from "lucide-react";

type Stats = {
  totalUsers: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  newSubscriptionsThisMonth: number;
  totalDialogues: number;
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStats(data);
      })
      .catch(() => setError("Error cargando estadísticas"));
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Usuarios registrados"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          label="Suscripciones activas"
          value={stats.activeSubscriptions}
          icon={CreditCard}
          color="bg-green-600"
        />
        <StatCard
          label="Nuevas suscripciones (mes)"
          value={stats.newSubscriptionsThisMonth}
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          label="Suscripciones canceladas"
          value={stats.canceledSubscriptions}
          icon={CreditCard}
          color="bg-red-400"
        />
        <StatCard
          label="Diálogos generados"
          value={stats.totalDialogues}
          icon={MessageSquare}
          color="bg-orange-500"
        />
      </div>
    </div>
  );
}
