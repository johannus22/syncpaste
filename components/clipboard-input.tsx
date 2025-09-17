import React from 'react'
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useParams } from 'next/navigation';


const ClipboardInput = () => {
  const { code } = useParams() as { code: string };
  const { 
      clipboard,
      setClipboard,
      setReceived,
      pasteLoading, 
      setPasteLoading, 
      pasteError, 
      setPasteError, 
    } = useGlobalContext();

    const sendClipboard = async () => {
    if (!clipboard.trim()) return;

    setPasteLoading(true);
    setPasteError("");

    try {
      const response = await fetch("/api/clipboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionCode: code, text: clipboard }),
      });

      if (response.ok) {
        const res = await fetch(`/api/clipboard?code=${code}`);
        const data = await res.json();
        setReceived(data.content || "");
        setClipboard(""); // Clear the input after successful paste
      } else {
        const errorData = await response.json().catch(() => ({}));
        setPasteError(
          errorData.message || "Failed to paste to session clipboard"
        );
      }
    } catch (error) {
      setPasteError("Network error. Please try again.");
    } finally {
      setPasteLoading(false);
    }
  };

  return (
    <div className="space-y-2 bg-gray-800 rounded-lg p-4 shadow">
        <span className="text-red-500">
          Note: Never paste your password or sensitive info here
        </span>
        {pasteError && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 rounded text-sm">
            {pasteError}
          </div>
        )}
        <textarea
          value={clipboard}
          onChange={(e) => {
            setClipboard(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          placeholder="Paste something here..."
          className="w-full border p-2 rounded font-roboto bg-gray-900 text-white border-gray-700 placeholder-gray-500 resize-y overflow-auto min-h-[40px] max-h-64"
          rows={1}
          style={{ minHeight: "40px", maxHeight: "256px" }}
          disabled={pasteLoading}
        />
        <button
          onClick={sendClipboard}
          disabled={pasteLoading || !clipboard.trim()}
          className={`px-4 py-2 rounded w-full font-semibold transition flex items-center justify-center gap-2 ${
            pasteLoading || !clipboard.trim()
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {pasteLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Pasting...
            </>
          ) : (
            "Paste to this Session Clipboard"
          )}
        </button>
      </div>
  )
}

export default ClipboardInput
