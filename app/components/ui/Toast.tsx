'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  show,
  message,
  type = 'success',
  onClose,
  duration = 5000
}: ToastProps) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 z-[100] transform -translate-x-1/2"
        >
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl min-w-[300px] max-w-[500px] ${
              type === 'success'
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}
          >
            {type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <p
              className={`flex-1 font-medium ${
                type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message}
            </p>
            <button
              onClick={onClose}
              className={`flex-shrink-0 p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                type === 'success'
                  ? 'text-green-600 hover:bg-green-200'
                  : 'text-red-600 hover:bg-red-200'
              }`}
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

