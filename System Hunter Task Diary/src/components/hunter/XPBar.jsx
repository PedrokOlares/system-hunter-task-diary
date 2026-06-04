import { motion } from "framer-motion";

export default function XPBar({ xp, xpToNext, level }) {
  const percentage = (xp / xpToNext) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-heading text-primary text-glow-blue tracking-widest">
          LVL {level}
        </span>
        <span className="text-xs font-body text-muted-foreground">
          {xp} / {xpToNext} XP
        </span>
      </div>
      <div className="h-3 stat-bar-bg rounded-full overflow-hidden border border-primary/20">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-blue-400 to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ boxShadow: '0 0 12px rgba(59,130,246,0.5)' }}
        />
      </div>
    </div>
  );
}