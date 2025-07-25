'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { customAlphabet } from 'nanoid';

const generateCode = customAlphabet('0123456789', 4); // 4-digit numeric code lang para madali sauluhin

export default function HomePage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [pasteCount, setPasteCount] = useState<number | null>(null);
  const [pasteCountLoading, setPasteCountLoading] = useState(true);

  const handleCreate = () => {
    const code = generateCode();
    router.push(`/session/${code}`);
  };

  const handleJoin = () => {
    if (/^\d{4}$/.test(joinCode)) {
      router.push(`/session/${joinCode}`);
    } else {
      alert('Please enter a valid 4-digit code.');
    }
  };

  //paste count fetchewr
  useEffect(() => {
    const fetchPasteCount = async () => {
      setPasteCountLoading(true);
      try {
        const res = await fetch('/api/paste-count');
        const data = await res.json();
        setPasteCount(data.totalPastes);
      } catch (err) {
        console.error('Failed to fetch paste count:', err);
      }
      setPasteCountLoading(false);
    };
    fetchPasteCount();
  }, []);

  return (
    <main className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center space-y-6 px-4 text-center bg-gray-900">
      <h1 className="text-5xl font-bold text-white bg-gray-800 p-3 rounded shadow-gray-950">Welcome to ClipSync</h1>
      <p className="text-gray-500">
        Copy and paste across devices, fast and instantly ✨</p>

      <button
        onClick={handleCreate}
        className="bg-blue-800 hover:bg-blue-700 hover:text-shadow-sm duration-100 transition-colors text-white px-6 py-3 rounded text-lg"
      >
        Create Session Code
      </button>

      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          maxLength={4}
          placeholder="Enter 4-digit code"
          className="border p-2 rounded w-32 text-center"
        />
        <button
          onClick={handleJoin}
          className="bg-green-800 hover:bg-green-700 text-white hover:text-shadow-sm duration-100 transition-colors px-4 py-2 rounded"
        >
          Join
        </button>
      </div>
      {pasteCountLoading ? (
        <p className="text-gray-400 text-sm animate-pulse">📋 Total pastes made:...</p>
      ) : pasteCount !== null && (
        <p className="text-gray-400 text-sm">
          📋 Total pastes made: <span className="text-white font-medium">{pasteCount}</span>
        </p>
      )}
    </main>
  );
}
