import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn('relative w-full bg-surface rounded-xl shadow-2xl overflow-hidden flex flex-col', maxWidth)}
          >
            <div className="flex items-center justify-between px-6 py-4 border-bottom border-border">
              {title && <h3 className="text-lg font-semibold text-text-primary">{title}</h3>}
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
              {children}
            </div>
            {footer && (
              <div className="px-6 py-4 bg-gray-50 border-top border-border flex justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
