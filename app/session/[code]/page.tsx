'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { pusherClient } from '@/lib/pusher-client';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, ClipboardType, Trash2 } from 'lucide-react';

export default function SessionPage() {
  const { code } = useParams() as { code: string };
  const [clipboard, setClipboard] = useState('');
  const [received, setReceived] = useState('');
  const [sessionUrl, setSessionUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [pasteLoading, setPasteLoading] = useState(false);
  const [pasteError, setPasteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    if (!clipboard.trim()) return;
    
    setPasteLoading(true);
    setPasteError('');
    
    try {
      const response = await fetch('/api/clipboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionCode: code, text: clipboard }),
      });

      if (response.ok) {
        const res = await fetch(`/api/clipboard?code=${code}`);
        const data = await res.json();
        setReceived(data.content || '');
        setClipboard(''); // Clear the input after successful paste
      } else {
        const errorData = await response.json().catch(() => ({}));
        setPasteError(errorData.message || 'Failed to paste to session clipboard');
      }
    } catch (error) {
      setPasteError('Network error. Please try again.');
    } finally {
      setPasteLoading(false);
    }
  };

  const deleteClipboard = async () => {
    setDeleteLoading(true);
    
    try {
      const response = await fetch(`/api/clipboard?code=${code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReceived('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Delete failed:', errorData.message || 'Failed to delete clipboard');
      }
    } catch (error) {
      console.error('Network error during delete:', error);
    } finally {
      setDeleteLoading(false);
    }
  }; 

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 bg-gray-900 min-h-screen">
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
      <div className="bg-gray-800 rounded-lg p-6 shadow">
                  <div className="flex items-center justify-between w-full mb-3">
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <ClipboardType size={20} className="text-blue-500" /> Session Clipboard
            </span>
            {received && !loading && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(received)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                >
                  <Copy size={20} /> Copy
                </button>
                <button
                  onClick={deleteClipboard}
                  disabled={deleteLoading}
                  className="text-sm text-red-400 hover:text-red-300 transition flex items-center gap-1 disabled:opacity-50"
                  title="Delete clipboard content"
                >
                  {deleteLoading ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 size={20} />
                  )}
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
          
        <div className="w-full bg-gray-900 rounded p-4 min-h-[80px] border border-gray-700 max-h-64 overflow-auto">
          {loading ? (
            <span className="text-gray-500">Updating clipboard in this session...</span>
          ) : (
            <pre className="font-roboto text-white break-words text-lg text-left whitespace-pre-wrap m-0">
              {received || <span className="text-gray-500">Nothing pasted here yet.</span>}
            </pre>
          )}
        </div>
      </div>
{/* Clipboard input */}
        <div className="space-y-2 bg-gray-800 rounded-lg p-4 shadow">
          <span className='text-red-500'>Note: Never paste your password or sensitive info here</span>
          {pasteError && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 rounded text-sm">
              {pasteError}
            </div>
          )} 
          <textarea
            value={clipboard}
            onChange={e => {
              setClipboard(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="Paste something here..."
            className="w-full border p-2 rounded font-roboto bg-gray-900 text-white border-gray-700 placeholder-gray-500 resize-y overflow-auto min-h-[40px] max-h-64"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '256px' }}
            disabled={pasteLoading}
          />
          <button
            onClick={sendClipboard}
            disabled={pasteLoading || !clipboard.trim()}
            className={`px-4 py-2 rounded w-full font-semibold transition flex items-center justify-center gap-2 ${
              pasteLoading || !clipboard.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {pasteLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Pasting...
              </>
            ) : (
              'Paste to this Session Clipboard'
            )}
          </button>
        </div>
        {/* End Clipboard input */}
    </div>
  );
}
