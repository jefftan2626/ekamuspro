'use client';

import { SearchResult } from '@/types/dictionary';

interface WordDetailsProps {
  result: SearchResult;
}

export default function WordDetails({ result }: WordDetailsProps) {
  const { word, definitions, synonyms, antonyms, translations, proverbs } = result;
  const hasTranslations = Object.keys(translations).length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{word}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-[#cc0000] text-white text-sm rounded-full capitalize">
            {result.language === 'en' ? 'English' : result.language === 'ms' ? 'Malay' : 'Chinese'}
          </span>
          {result.translations && Object.keys(result.translations).length > 0 && (
            <span className="px-3 py-1 bg-[#003366] text-white text-sm rounded-full">
              Has translations
            </span>
          )}
        </div>
      </div>

      {hasTranslations && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Translations
          </h2>
          <div className="space-y-4">
            {Object.entries(translations).map(([lang, words]) => (
              <div key={lang} className="flex items-start gap-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded capitalize min-w-[80px] text-center">
                  {lang === 'en' ? 'English' : lang === 'ms' ? 'Malay' : 'Chinese'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {words?.map((w, i) => (
                    <span key={i} className="px-3 py-1 bg-[#003366]/10 text-[#003366] text-sm rounded-full">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {definitions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#cc0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Definitions
          </h2>
          <div className="space-y-6">
            {definitions.map((def, index) => (
              <div key={index} className="border-l-4 border-[#cc0000] pl-4">
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-2 capitalize">
                  {def.partOfSpeech}
                </span>
                <p className="text-gray-800 text-lg mb-2">{def.meaning}</p>
                {def.examples.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Example:</p>
                    <p className="text-gray-700 italic">"{def.examples[0]}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {synonyms.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#cc0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Synonyms
          </h2>
          <div className="flex flex-wrap gap-2">
            {synonyms.slice(0, 15).map((syn, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#003366] text-white text-sm rounded-full cursor-pointer hover:bg-[#004488] transition-colors"
              >
                {syn}
              </span>
            ))}
          </div>
        </div>
      )}

      {antonyms.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#cc0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Antonyms
          </h2>
          <div className="flex flex-wrap gap-2">
            {antonyms.slice(0, 15).map((ant, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#e6b800] text-gray-900 text-sm rounded-full"
              >
                {ant}
              </span>
            ))}
          </div>
        </div>
      )}

      {proverbs && proverbs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#e6b800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Related Proverbs (Peribahasa)
          </h2>
          <div className="space-y-4">
            {proverbs.map((proverb) => (
              <div key={proverb.id} className="border-l-4 border-[#e6b800] pl-4 py-2">
                <p className="text-lg font-semibold text-gray-900 mb-1">{proverb.proverb}</p>
                <p className="text-gray-600">{proverb.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {definitions.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">No definitions found for this word.</p>
          <p className="text-gray-400 mt-2">Try searching with a different spelling or language.</p>
        </div>
      )}
    </div>
  );
}
