import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy } from "lucide-react";

const QRBlock = () => {
  const { code } = useParams() as { code: string };
  const sessionUrl = useMemo(
    () => `${window.location.origin}/session/${code}`,
    [code]
  );
  return (
    <>
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
    </>
  );
};

export default QRBlock;
