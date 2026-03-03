"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, FileText, Mic } from "lucide-react";

type Character = { name: string; gender: string };
type Dialogue = {
  id: string;
  output_type: "written" | "audio";
  source_language: string;
  characters: Character[] | null;
  created_at: string;
  users: { email: string } | null;
};

export default function AdminDialoguesPage() {
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchDialogues = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/dialogues");
      const data = await res.json();
      if (data.error) setError(data.error);
      else setDialogues(data.dialogues ?? []);
    } catch {
      setError("Error cargando diálogos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDialogues();
  }, []);

  const deleteDialogue = async (id: string) => {
    if (!confirm("¿Eliminar este diálogo?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/dialogues?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) alert(data.error);
      else setDialogues((prev) => prev.filter((d) => d.id !== id));
    } catch {
      alert("Error eliminando diálogo");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Diálogos</h1>

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
        ) : dialogues.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">Sin diálogos</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Usuario</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Idioma</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Personajes</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {dialogues.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">
                      {d.users?.email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        {d.output_type === "audio" ? (
                          <>
                            <Mic size={14} className="text-purple-500" />
                            Audio
                          </>
                        ) : (
                          <>
                            <FileText size={14} className="text-blue-500" />
                            Escrito
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 uppercase text-gray-500 text-xs">
                      {d.source_language}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {d.characters
                        ? d.characters.map((c) => c.name).join(", ")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {new Date(d.created_at).toLocaleDateString("es")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteDialogue(d.id)}
                        disabled={deletingId === d.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                        title="Eliminar"
                      >
                        {deletingId === d.id ? (
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
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-gray-400">{dialogues.length} diálogo(s) mostrados</p>
    </div>
  );
}
