export type Language = 'en' | 'ms' | 'zh';

export interface WordEntry {
  word: string;
  language: Language;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
  examples: string[];
  partOfSpeech?: string;
}

export interface Definition {
  meaning: string;
  partOfSpeech: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
}

export interface Proverb {
  id: string;
  proverb: string;
  meaning: string;
  language: Language;
  relatedWords: string[];
}

export interface SearchResult {
  word: string;
  language: Language;
  translations: {
    [key in Language]?: string[];
  };
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
  proverbs: Proverb[];
}

export interface DictionaryAPIResponse {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
  sourceUrls?: string[];
}
