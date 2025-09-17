import React from 'react'
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useParams } from 'next/navigation';
import { pusherClient } from "@/lib/pusher-client";
import { Copy, ClipboardType, Trash2 } from "lucide-react";
import { useEffect } from "react";

const ClipboardReceived = () => {
      const { code } = useParams() as { code: string };
      const { 
          received,
          loading,
          deleteLoading,
          setDeleteLoading,
          setReceived,
          setPasteError,
          setLoading,
      } = useGlobalContext();
    
      useEffect(() => {
    const fetchClipboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/clipboard?code=${code}`);
        const data = await res.json();
        setReceived(data.content || "");
      } catch {
        setPasteError("Failed to fetch clipboard from the server");
      } finally {
        setLoading(false);
      }
    };

    fetchClipboard();

    const channel = pusherClient.subscribe(`session-${code}`);
    channel.bind("clipboard-update", (data: { text: string }) => {
      setReceived(data.text);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [code]);
    
    const deleteClipboard = async () => {
    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/clipboard?code=${code}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReceived("");
        // Also clear any paste errors
        setPasteError("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || errorData.error || "Failed to delete clipboard";
        console.error("Delete failed:", errorMessage);
        // Show error to user
        setPasteError(`Delete failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Network error during delete:", error);
      setPasteError("Network error during delete. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center justify-between w-full mb-3">
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <ClipboardType size={20} className="text-blue-500" /> Session
            Clipboard
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
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        <div className="w-full bg-gray-900 rounded p-4 min-h-[80px] border border-gray-700 max-h-64 overflow-auto">
          {loading ? (
            <span className="text-gray-500">
              Updating clipboard in this session...
            </span>
          ) : (
            <pre className="font-roboto text-white break-words text-lg text-left whitespace-pre-wrap m-0">
              {received || (
                <span className="text-gray-500">Nothing pasted here yet.</span>
              )}
            </pre>
          )}
        </div>
      </div>
  )
}

export default ClipboardReceived
