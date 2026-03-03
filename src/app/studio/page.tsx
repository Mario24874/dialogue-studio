"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  FileText, Mic, ChevronRight, Loader2, Download,
  Copy, Check, RotateCcw, Volume2, Sparkles
} from "lucide-react";
import CharacterBuilder, { Character, ELEVENLABS_VOICES } from "@/components/studio/character-builder";
import { useLanguage } from "@/contexts/language-context";

// User info (useUser + UserButton) loaded client-side only — Clerk hooks cannot
// run during build-time static prerendering (no request context, no middleware).
const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const StudioUser = dynamic(() => import("./_studio-user"), { ssr: false });

type Step = 1 | 2 | 3 | 4;
type OutputType = "written" | "audio";
type SourceLang = "es" | "en";

const INITIAL_CHARACTERS: Character[] = [
  { id: "a", name: "Persona A", gender: "M", voiceId: ELEVENLABS_VOICES.M[0].id },
  { id: "b", name: "Persona B", gender: "F", voiceId: ELEVENLABS_VOICES.F[0].id },
];

export default function StudioPage() {
  const { t, tArray } = useLanguage();

  // Estado del flujo
  const [step, setStep] = useState<Step>(1);
  const [inputText, setInputText] = useState("");
  const [sourceLang, setSourceLang] = useState<SourceLang>("es");
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [outputType, setOutputType] = useState<OutputType>("written");

  // Estado de resultado
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [writtenResult, setWrittenResult] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [copied, setCopied] = useState(false);

  const resetStudio = () => {
    setStep(1);
    setInputText("");
    setCharacters(INITIAL_CHARACTERS);
    setOutputType("written");
    setWrittenResult("");
    setAudioSrc("");
    setError("");
    setProgress(0);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setWrittenResult("");
    setAudioSrc("");
    setProgress(10);

    try {
      const translateRes = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, sourceLang, characters }),
      });
      setProgress(40);

      const translateData = await translateRes.json();
      if (!translateRes.ok) throw new Error(translateData.error || "Error en la traducción");

      const translatedLines: Array<{ name: string; text: string }> = translateData.lines;

      if (outputType === "written") {
        const formatted = translatedLines
          .map((line) => `${line.name}. ${line.text}`)
          .join("\n");
        setWrittenResult(formatted);
        setProgress(100);
        setStep(4);
      } else {
        setProgress(50);
        const audioRes = await fetch("/api/generate-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: translatedLines, characters }),
        });
        setProgress(90);

        const audioData = await audioRes.json();
        if (!audioRes.ok) throw new Error(audioData.error || "Error generando audio");

        setAudioSrc(`data:audio/mp3;base64,${audioData.audioContent}`);
        setProgress(100);
        setStep(4);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(writtenResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAudio = () => {
    const a = document.createElement("a");
    a.href = audioSrc;
    a.download = `dialogo_italiano_${Date.now()}.mp3`;
    a.click();
  };

  const canGoNext = () => {
    if (step === 1) return inputText.trim().length >= 20;
    if (step === 2) return characters.length >= 2 && characters.every(c => c.name.trim());
    if (step === 3) return true;
    return false;
  };

  const stepTitles = tArray("studio.stepTitles");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar del Studio */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Logo_ItaliAnto.png" alt="Italianto" width={28} height={28} className="rounded-md" />
            <span className="font-bold text-italianto-800 text-sm">Dialogue Studio</span>
          </Link>
          {hasClerk && <StudioUser />}
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        {/* Progress steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                step === s
                  ? "bg-italianto-800 text-white shadow-italianto"
                  : step > s
                    ? "bg-italianto-100 text-italianto-800"
                    : "bg-gray-100 text-gray-400"
              }`}>
                {step > s ? <Check size={16} /> : s}
              </div>
              <span className={`hidden sm:block ml-2 text-xs font-medium ${step >= s ? "text-italianto-800" : "text-gray-400"}`}>
                {stepTitles[s - 1]}
              </span>
              {s < 4 && (
                <ChevronRight size={16} className="mx-2 text-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* Contenido del paso actual */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* PASO 1: Ingreso de diálogo */}
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{t("studio.step1.title")}</h2>
              <p className="text-gray-500 text-sm mb-5">{t("studio.step1.subtitle")}</p>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t("studio.step1.langLabel")}</label>
                <div className="flex gap-3">
                  {(["es", "en"] as SourceLang[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSourceLang(lang)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        sourceLang === lang
                          ? "bg-italianto-800 text-white border-italianto-800"
                          : "bg-white text-gray-600 border-gray-200 hover:border-italianto-300"
                      }`}
                    >
                      {lang === "es" ? t("studio.step1.langEs") : t("studio.step1.langEn")}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-italianto-500 focus:border-transparent resize-none transition-all font-mono"
                placeholder={t("studio.step1.placeholder")}
              />
              <p className="text-xs text-gray-400 mt-2 text-right">
                {t("studio.step1.chars", { n: String(inputText.length) })}
                {inputText.length < 20 && inputText.length > 0 && ` ${t("studio.step1.minChars")}`}
              </p>
            </div>
          )}

          {/* PASO 2: Configurar personajes */}
          {step === 2 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{t("studio.step2.title")}</h2>
              <p className="text-gray-500 text-sm mb-5">{t("studio.step2.subtitle")}</p>
              <CharacterBuilder characters={characters} onChange={setCharacters} />
            </div>
          )}

          {/* PASO 3: Elegir formato */}
          {step === 3 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{t("studio.step3.title")}</h2>
              <p className="text-gray-500 text-sm mb-6">{t("studio.step3.subtitle")}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Opción: Escrito */}
                <button
                  onClick={() => setOutputType("written")}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                    outputType === "written"
                      ? "border-italianto-700 bg-italianto-50 shadow-italianto"
                      : "border-gray-200 hover:border-italianto-300 bg-white"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    outputType === "written" ? "bg-italianto-800" : "bg-gray-100"
                  }`}>
                    <FileText className={`w-6 h-6 ${outputType === "written" ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{t("studio.step3.writtenTitle")}</h3>
                  <p className="text-sm text-gray-500">{t("studio.step3.writtenDesc")}</p>
                  <div className="mt-3 text-xs text-gray-400 font-mono bg-gray-50 rounded-lg p-2">
                    Marco. Ciao Sofia!{"\n"}Sofia. Ciao Marco!
                  </div>
                </button>

                {/* Opción: Audio */}
                <button
                  onClick={() => setOutputType("audio")}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                    outputType === "audio"
                      ? "border-italianto-700 bg-italianto-50 shadow-italianto"
                      : "border-gray-200 hover:border-italianto-300 bg-white"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    outputType === "audio" ? "bg-italianto-800" : "bg-gray-100"
                  }`}>
                    <Mic className={`w-6 h-6 ${outputType === "audio" ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{t("studio.step3.audioTitle")}</h3>
                  <p className="text-sm text-gray-500">{t("studio.step3.audioDesc")}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <Volume2 size={14} />
                    <span>{t("studio.step3.voicesLabel")}</span>
                  </div>
                </button>
              </div>

              {/* Resumen de configuración */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t("studio.step3.summary")}</p>
                <div className="flex flex-wrap gap-2">
                  {characters.map((c, i) => (
                    <span key={c.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-italianto-100 rounded-full text-xs font-medium text-italianto-800">
                      <span className="w-4 h-4 bg-italianto-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {c.name} · {c.gender === "M" ? "♂" : "♀"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: Resultado */}
          {step === 4 && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t("studio.step4.title")}</h2>
                  <p className="text-gray-500 text-sm">{t("studio.step4.subtitle")}</p>
                </div>
                <button
                  onClick={resetStudio}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-italianto-700 transition-colors"
                >
                  <RotateCcw size={15} />
                  {t("studio.step4.newDialogue")}
                </button>
              </div>

              {/* Resultado escrito */}
              {writtenResult && (
                <div>
                  <div className="relative bg-italianto-50 border border-italianto-100 rounded-xl p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                    {writtenResult}
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-3 right-3 p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-italianto-50 transition-colors"
                      title="Copiar"
                    >
                      {copied ? <Check size={14} className="text-italianto-700" /> : <Copy size={14} className="text-gray-500" />}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-xs text-italianto-600 mt-2 text-center">{t("studio.step4.copied")}</p>
                  )}
                </div>
              )}

              {/* Resultado audio */}
              {audioSrc && (
                <div className="space-y-4">
                  <div className="bg-italianto-50 border border-italianto-100 rounded-xl p-4">
                    <p className="text-sm font-medium text-italianto-800 mb-3 flex items-center gap-2">
                      <Volume2 size={16} />
                      {t("studio.step4.audioTitle")}
                    </p>
                    <audio controls src={audioSrc} className="w-full">
                      {t("studio.step4.audioNotSupported")}
                    </audio>
                  </div>
                  <button
                    onClick={downloadAudio}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-italianto-800 text-white font-semibold rounded-xl hover:bg-italianto-900 transition-colors"
                  >
                    <Download size={18} />
                    {t("studio.step4.downloadMp3")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navegación */}
          {step < 4 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setStep((prev) => Math.max(1, prev - 1) as Step)}
                disabled={step === 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {t("studio.nav.prev")}
              </button>

              {step < 3 ? (
                <button
                  onClick={() => setStep((prev) => (prev + 1) as Step)}
                  disabled={!canGoNext()}
                  className="px-6 py-2.5 bg-italianto-800 text-white text-sm font-semibold rounded-xl hover:bg-italianto-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {t("studio.nav.next")}
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-italianto-800 text-white text-sm font-semibold rounded-xl hover:bg-italianto-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {progress < 40 ? t("studio.nav.translating") : progress < 80 ? t("studio.nav.generating") : t("studio.nav.finishing")}
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      {t("studio.nav.generate")}
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Barra de progreso */}
          {loading && (
            <div className="h-1.5 bg-gray-100">
              <div
                className="h-full bg-italianto-600 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
