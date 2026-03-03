"use client";
import { Plus, Trash2, User } from "lucide-react";

export interface Character {
  id: string;
  name: string;
  gender: "M" | "F";
  voiceId: string;
}

// Voces gratuitas de ElevenLabs con buena calidad
export const ELEVENLABS_VOICES = {
  M: [
    { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
    { id: "VR6AewLTigWG4xSOukaG", name: "Arnold" },
    { id: "ErXwobaYiN019PkySvjV", name: "Antoni" },
    { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
    { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam" },
  ],
  F: [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella" },
    { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli" },
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
    { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
    { id: "ThT5KcBeYPX3keUQqHPh", name: "Dorothy" },
  ],
};

interface Props {
  characters: Character[];
  onChange: (characters: Character[]) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function CharacterBuilder({ characters, onChange }: Props) {
  const addCharacter = () => {
    if (characters.length >= 6) return;
    const gender: "M" | "F" = characters.length % 2 === 0 ? "M" : "F";
    onChange([
      ...characters,
      {
        id: generateId(),
        name: `Persona ${characters.length + 1}`,
        gender,
        voiceId: ELEVENLABS_VOICES[gender][0].id,
      },
    ]);
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    onChange(
      characters.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...updates };
        // Si cambia el género, resetear la voz al primer option del nuevo género
        if (updates.gender && updates.gender !== c.gender) {
          updated.voiceId = ELEVENLABS_VOICES[updates.gender][0].id;
        }
        return updated;
      })
    );
  };

  const removeCharacter = (id: string) => {
    if (characters.length <= 2) return;
    onChange(characters.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Configura cada participante del diálogo (mín. 2, máx. 6)
        </p>
        <button
          onClick={addCharacter}
          disabled={characters.length >= 6}
          className="flex items-center gap-1.5 text-sm font-medium text-italianto-700 hover:text-italianto-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={16} />
          Agregar personaje
        </button>
      </div>

      <div className="grid gap-3">
        {characters.map((char, index) => (
          <div
            key={char.id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-italianto-300 transition-colors"
          >
            {/* Avatar con letra */}
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-italianto-800 text-white text-sm font-bold flex items-center justify-center">
              {String.fromCharCode(65 + index)}
            </div>

            {/* Nombre */}
            <div className="flex-1 min-w-0">
              <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
              <input
                type="text"
                value={char.name}
                onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-italianto-500 focus:border-transparent"
                placeholder="Nombre del personaje"
                maxLength={30}
              />
            </div>

            {/* Género */}
            <div className="w-full sm:w-24">
              <label className="text-xs text-gray-500 mb-1 block">Género</label>
              <select
                value={char.gender}
                onChange={(e) => updateCharacter(char.id, { gender: e.target.value as "M" | "F" })}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-italianto-500 bg-white"
              >
                <option value="M">Hombre</option>
                <option value="F">Mujer</option>
              </select>
            </div>

            {/* Voz */}
            <div className="w-full sm:w-32">
              <label className="text-xs text-gray-500 mb-1 block">Voz</label>
              <select
                value={char.voiceId}
                onChange={(e) => updateCharacter(char.id, { voiceId: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-italianto-500 bg-white"
              >
                {ELEVENLABS_VOICES[char.gender].map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Eliminar */}
            <button
              onClick={() => removeCharacter(char.id)}
              disabled={characters.length <= 2}
              className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-red-50"
              title="Eliminar personaje"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {characters.length < 2 && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Necesitas al menos 2 personajes para generar el diálogo.
        </p>
      )}
    </div>
  );
}
