'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { pusherClient } from '@/lib/pusher-client';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, ClipboardType } from 'lucide-react';

export default function SessionPage() {
  const { code } = useParams() as { code: string };
  const [clipboard, setClipboard] = useState('');
  const [received, setReceived] = useState('');
  const [sessionUrl, setSessionUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSessionUrl(`${window.location.origin}/session/${code}`);
    }
  }, [code]);

  useEffect(() => {
    const fetchClipboard = async () => {
      setLoading(true);
      const res = await fetch(`/api/clipboard?code=${code}`);
      const data = await res.json();
      setReceived(data.content || '');
      setLoading(false);
    };

    fetchClipboard();

    const channel = pusherClient.subscribe(`session-${code}`);
    channel.bind('clipboard-update', (data: { text: string }) => {
      setReceived(data.text);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [code]);

  const sendClipboard = async () => {
    setLoading(true);
    const response = await fetch('/api/clipboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionCode: code, text: clipboard }),
    });

    if (response.ok) {
      const res = await fetch(`/api/clipboard?code=${code}`);
      const data = await res.json();
      setReceived(data.content || '');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 bg-gray-900 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col space-y-6 justify-center">
        <h1 className="text-2xl font-bold text-center text-white mb-2">
          Session Code: <span className="text-blue-400">{code}</span>
        </h1>

        {/* QR Code Section */}
        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
          <div className="bg-white p-3 rounded-md shadow-md">
            <QRCodeCanvas value={sessionUrl} size={180} />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400 break-all text-center">
            <span className="truncate max-w-[200px]">{sessionUrl}</span>
            <button
              onClick={() => navigator.clipboard.writeText(sessionUrl)}
              className="text-blue-400 hover:text-blue-300 transition"
              title="Copy session URL"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
{/* Received Clipboard Section */}
      <div className="flex-1 flex flex-col justify-center mt-2">
        <div className="bg-gray-800 rounded-lg p-6 shadow h-full flex flex-col items-center justify-center w-full">
          <div className="flex items-center justify-between w-full mb-3">
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <ClipboardType size={20} className="text-blue-500" /> Session Clipboard
            </span>
            {received && !loading && (
              <button
                onClick={() => navigator.clipboard.writeText(received)}
                className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
              >
                <Copy size={20} /> Copy
              </button>
            )}
          </div>
            
          <div className="w-full bg-gray-900 rounded p-4 min-h-[80px] border border-gray-700 max-h-48 overflow-y-auto flex items-center justify-center gap-2">
            
            {loading ? (
              <span className="text-gray-500">Updating clipboard in this session...</span>
            ) : (
              <p className="font-roboto text-white break-words text-lg text-center flex-1" style={{ whiteSpace: 'pre-line' }}>
                {received || <span className="text-gray-500">Nothing pasted here yet.</span>}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* End Received Clipboard Section */}
        
      </div>
{/* Clipboard input */}
        <div className="space-y-2 bg-gray-800 rounded-lg p-4 shadow">
        <span className='text-red-500'>Note: Never paste your password or sensitive info here</span>
          <textarea
            value={clipboard}
            onChange={e => {
              setClipboard(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="Paste something here..."
            className="w-full border p-2 rounded font-roboto bg-gray-900 text-white border-gray-700 placeholder-gray-500 resize-none overflow-hidden min-h-[40px]"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '300px' }}
          />
          <button
            onClick={sendClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold transition"
          >
            Paste to this Session Clipboard
          </button>
        </div>
        {/* End Clipboard input */}
      
    </div>
  );
}
