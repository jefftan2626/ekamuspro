import { DictionaryAPIResponse, Language, SearchResult, Definition, Proverb } from '@/types/dictionary';

const FREE_DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

interface LocalDictionaryEntry {
  word: string;
  language: Language;
  definitions: Definition[];
  translations: {
    en?: string[];
    ms?: string[];
    zh?: string[];
  };
  synonyms: string[];
  antonyms: string[];
}

let malayDictionaryCache: Record<string, LocalDictionaryEntry> | null = null;
let chineseDictionaryCache: Record<string, LocalDictionaryEntry> | null = null;
let proverbsCache: Proverb[] | null = null;

async function loadMalayDictionary(): Promise<Record<string, LocalDictionaryEntry>> {
  if (malayDictionaryCache) return malayDictionaryCache;
  try {
    const response = await fetch('/data/malay-dictionary.json');
    malayDictionaryCache = await response.json();
    return malayDictionaryCache!;
  } catch (error) {
    console.error('Error loading Malay dictionary:', error);
    return {};
  }
}

async function loadChineseDictionary(): Promise<Record<string, LocalDictionaryEntry>> {
  if (chineseDictionaryCache) return chineseDictionaryCache;
  try {
    const response = await fetch('/data/chinese-dictionary.json');
    chineseDictionaryCache = await response.json();
    return chineseDictionaryCache!;
  } catch (error) {
    console.error('Error loading Chinese dictionary:', error);
    return {};
  }
}

async function loadProverbs(): Promise<Proverb[]> {
  if (proverbsCache) return proverbsCache;
  try {
    const response = await fetch('/data/malay-proverbs.json');
    proverbsCache = await response.json();
    return proverbsCache!;
  } catch (error) {
    console.error('Error loading proverbs:', error);
    return [];
  }
}

export function detectLanguage(query: string): Language {
  const chineseRegex = /[\u4e00-\u9fff]/;
  const malayIndicators = ['yang', 'dan', 'adalah', 'dengan', 'untuk', 'dari', 'ke', 'di', 'ini', 'itu', 'anda', 'saya', 'mereka', 'kami', 'dia', 'apa', 'siapa', 'mana', 'bilang', 'berapa', 'bila', 'kenapa', 'bagaimana', 'salah', 'betul', 'okay', 'ok', 'lah', 'pun', 'saja', 'tapi', 'atau', 'jika', 'kalau', 'maka', 'jadi', 'lagi', 'sudah', 'akan', 'sedang', 'telah', 'bisa', 'harus', 'mau', 'ingin', 'takut', 'baik', 'buruk', 'besar', 'kecil', 'panjang', 'pendek', 'tinggi', 'rendah', 'cepat', 'lambat', 'panas', 'dingin', 'baru', 'lama', 'senang', 'sukar', 'cantik', 'hodoh', 'lezat', 'sedap', 'kereta', 'rumah', 'makan', 'minum', 'air'];
  
  if (chineseRegex.test(query)) {
    return 'zh';
  }
  
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/);
  
  const malayWordCount = words.filter(word => malayIndicators.includes(word)).length;
  const totalWords = words.filter(w => w.length > 2).length;
  
  if (totalWords > 0 && malayWordCount / totalWords > 0.3) {
    return 'ms';
  }
  
  return 'en';
}

export async function fetchEnglishDefinition(word: string): Promise<DictionaryAPIResponse | null> {
  try {
    const response = await fetch(`${FREE_DICTIONARY_API}/${encodeURIComponent(word)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching English definition:', error);
    return null;
  }
}

export function transformToWordEntry(data: DictionaryAPIResponse): {
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
} {
  const definitions: Definition[] = [];
  const allSynonyms: Set<string> = new Set();
  const allAntonyms: Set<string> = new Set();

  for (const meaning of data.meanings) {
    for (const def of meaning.definitions) {
      definitions.push({
        meaning: def.definition,
        partOfSpeech: meaning.partOfSpeech,
        examples: def.example ? [def.example] : [],
        synonyms: def.synonyms || [],
        antonyms: def.antonyms || [],
      });
      
      def.synonyms?.forEach(s => allSynonyms.add(s));
      def.antonyms?.forEach(a => allAntonyms.add(a));
    }
  }

  return {
    definitions,
    synonyms: Array.from(allSynonyms).slice(0, 20),
    antonyms: Array.from(allAntonyms).slice(0, 20),
  };
}

export async function searchWord(query: string): Promise<SearchResult | null> {
  const language = detectLanguage(query);
  const cleanQuery = query.trim().toLowerCase();

  if (language === 'en') {
    const apiData = await fetchEnglishDefinition(cleanQuery);
    if (!apiData) {
      const malayData = await loadMalayDictionary();
      const malayEntry = malayData[cleanQuery];
      if (malayEntry) {
        const proverbs = await findRelatedProverbs(cleanQuery);
        return {
          word: malayEntry.word,
          language: 'ms',
          translations: malayEntry.translations,
          definitions: malayEntry.definitions,
          synonyms: malayEntry.synonyms,
          antonyms: malayEntry.antonyms,
          proverbs,
        };
      }
      return null;
    }

    const { definitions, synonyms, antonyms } = transformToWordEntry(apiData);

    return {
      word: apiData.word,
      language: 'en',
      translations: {},
      definitions,
      synonyms,
      antonyms,
      proverbs: [],
    };
  }

  if (language === 'ms') {
    const malayData = await loadMalayDictionary();
    const entry = malayData[cleanQuery];
    
    if (entry) {
      const proverbs = await findRelatedProverbs(cleanQuery);
      return {
        word: entry.word,
        language: 'ms',
        translations: entry.translations,
        definitions: entry.definitions,
        synonyms: entry.synonyms,
        antonyms: entry.antonyms,
        proverbs,
      };
    }

    const apiData = await fetchEnglishDefinition(cleanQuery);
    if (apiData) {
      const { definitions, synonyms, antonyms } = transformToWordEntry(apiData);
      return {
        word: apiData.word,
        language: 'en',
        translations: {},
        definitions,
        synonyms,
        antonyms,
        proverbs: [],
      };
    }

    return null;
  }

  if (language === 'zh') {
    const chineseData = await loadChineseDictionary();
    const entry = chineseData[query];
    
    if (entry) {
      const proverbs = await findRelatedProverbs(query);
      return {
        word: entry.word,
        language: 'zh',
        translations: entry.translations,
        definitions: entry.definitions,
        synonyms: entry.synonyms,
        antonyms: entry.antonyms,
        proverbs,
      };
    }

    return null;
  }

  return null;
}

async function findRelatedProverbs(query: string): Promise<Proverb[]> {
  const proverbs = await loadProverbs();
  const lowerQuery = query.toLowerCase();
  
  return proverbs.filter(proverb => 
    proverb.relatedWords.some(word => 
      word.toLowerCase().includes(lowerQuery) || 
      lowerQuery.includes(word.toLowerCase())
    )
  );
}

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('recentSearches');
  return stored ? JSON.parse(stored) : [];
}

export function addRecentSearch(word: string): void {
  if (typeof window === 'undefined') return;
  const recent = getRecentSearches();
  const updated = [word, ...recent.filter(w => w !== word)].slice(0, 10);
  localStorage.setItem('recentSearches', JSON.stringify(updated));
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('recentSearches');
}
