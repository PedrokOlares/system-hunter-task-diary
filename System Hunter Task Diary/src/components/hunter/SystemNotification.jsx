import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function SystemNotification({ message, show, onClose, type = "info" }) {
  const colors = {
    info: "border-primary/40 bg-primary/10 text-primary",
    success: "border-green-500/40 bg-green-500/10 text-green-400",
    warning: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
    levelup: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] system-panel rounded-lg p-4 pr-10 border ${colors[type]} max-w-sm`}
        >
          <p className="font-heading text-sm tracking-wider">{message}</p>
          <button onClick={onClose} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}