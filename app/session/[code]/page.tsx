"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import QRBlock from "@/components/qr-block";
import ClipboardInput from "@/components/clipboard-input";
import ClipboardReceived from "@/components/clipboard-received";

export default function SessionPage() {
  const { code } = useParams() as { code: string };

  const sessionUrl = useMemo(
    () =>
      typeof window !== "undefined"
        ? `${window.location.origin}/session/${code}`
        : "",
    [code]
  );

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-white mb-2">
        Session Code: <span className="text-blue-400">{code}</span>
      </h1>
      <QRBlock />
      <ClipboardReceived />
      <ClipboardInput />
    </div>
  );
}
