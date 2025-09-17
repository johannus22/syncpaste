"use client"
import { createContext, useContext, ReactNode, useState } from 'react';

interface GlobalContextType {
  clipboard: string;
  setClipboard: (value: string) => void;
  received: string;
  setReceived: (value: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  pasteLoading: boolean;
  setPasteLoading: (value: boolean) => void;
  pasteError: string;
  setPasteError: (value: string) => void;
  deleteLoading: boolean;
  setDeleteLoading: (value: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProps {
  children: ReactNode;
}

export const GlobalStates = ({ children }: GlobalProps) => {
  const [clipboard, setClipboard] = useState<string>('');
  const [received, setReceived] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [pasteLoading, setPasteLoading] = useState<boolean>(false);
  const [pasteError, setPasteError] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  return (
    <GlobalContext.Provider
      value={{
        clipboard,
        setClipboard,
        received,
        setReceived,
        loading,
        setLoading,
        pasteLoading,
        setPasteLoading,
        pasteError,
        setPasteError,
        deleteLoading,
        setDeleteLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('dkfjghskdghisdfu');
  }
  return context;
};
