import type { ReactNode } from "react";

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ title, onClose, children }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg p-6 rounded-2xl shadow-2xl border border-white/10">
        <header className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            ✕
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
