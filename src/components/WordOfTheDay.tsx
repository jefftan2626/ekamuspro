'use client';

import { useState, useEffect } from 'react';

interface WordOfTheDay {
  word: string;
  definition: string;
  language: string;
}

const WORDS_OF_THE_DAY: WordOfTheDay[] = [
  { word: 'harmoni', definition: 'Keadaan apabila dua atau lebih bunyi yang berbeza bergabung dengan sedapnya', language: 'ms' },
  { word: 'gotong-royong', definition: 'Kerja sama-sama melakukan sesuatu; bergotong-royong', language: 'ms' },
  { word: 'book', definition: 'A written or printed work consisting of pages', language: 'en' },
  { word: '知识', definition: 'Pengetahuan; maklumat yang diperoleh melalui pembelajaran', language: 'zh' },
  { word: 'merdeka', definition: 'Bebas; tidak bergantung kepada mana-mana negara', language: 'ms' },
  { word: 'courage', definition: 'The ability to do something that frightens one', language: 'en' },
  { word: '团结', definition: 'Perpaduan; keadaan bersatu', language: 'zh' },
];

export default function WordOfTheDay() {
  const [word, setWord] = useState<WordOfTheDay | null>(null);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % WORDS_OF_THE_DAY.length;
    setWord(WORDS_OF_THE_DAY[index]);
  }, []);

  if (!word) return null;

  return (
    <div className="bg-gradient-to-r from-[#cc0000] to-[#a30000] rounded-2xl p-6 text-white">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span className="text-sm font-medium opacity-90">Word of the Day</span>
      </div>
      <h3 className="text-2xl font-bold mb-2">{word.word}</h3>
      <p className="opacity-90 mb-3">{word.definition}</p>
      <span className="inline-block px-2 py-1 bg-white/20 text-sm rounded">
        {word.language === 'en' ? 'English' : word.language === 'ms' ? 'Malay' : 'Chinese'}
      </span>
    </div>
  );
}
