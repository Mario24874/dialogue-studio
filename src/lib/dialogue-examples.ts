export type DialogueType = "formal" | "informal" | "technical";

export const DIALOGUE_TYPE_KEYS: DialogueType[] = ["formal", "informal", "technical"];

// Few-shot examples used to guide the AI towards the correct register.
// One representative example per type (short, clear, unambiguous).
export const DIALOGUE_EXAMPLES: Record<DialogueType, string> = {
  formal: `A: Buongiorno, signor Rossi. Sono lieto di incontrarLa oggi per discutere del progetto.
B: Buongiorno, signor Bianchi. Anch'io sono lieto di vederLa. Possiamo iniziare con i dettagli finanziari?
A: Certamente. Il budget previsto è di 50.000 euro. Qual è la Sua opinione?
B: Mi sembra adeguato, ma suggerisco di rivedere le spese per il marketing.`,

  informal: `A: Ciao, Marco! Che fai stasera? Andiamo al cinema?
B: Ciao, Luca! Sì, dai, mi va. Che film vuoi vedere?
A: Quello nuovo di azione. Inizia alle 20:00.
B: Perfetto, ci vediamo lì!`,

  technical: `A: Il codice presenta un errore di sintassi nella funzione principale. Hai verificato l'indentazione?
B: Sì, ho controllato. Il problema è nel loop for: manca il colon dopo la condizione.
A: Correggiamolo. Ora testa l'output con i dati di input.
B: Eseguito. L'algoritmo elabora i dati correttamente ora.`,
};

export const DIALOGUE_TYPE_STYLE_NOTES: Record<DialogueType, string> = {
  formal: "Usa il Lei (forma di cortesia), vocabolario elevato e tono professionale. Evita contrazioni e linguaggio colloquiale.",
  informal: "Usa il tu, linguaggio colloquiale, espressioni everyday come 'dai', 'tipo', 'roba'. Puoi usare contrazioni.",
  technical: "Usa terminologia specializzata e precisa del settore. Mantieni un tono neutro e diretto.",
};
