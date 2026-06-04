import { motion } from "framer-motion";
import { STAT_COLORS } from "@/lib/hunterUtils";

export default function StatBar({ stat, value, maxValue = 100 }) {
  const config = STAT_COLORS[stat];
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className={`text-xs font-heading uppercase tracking-wider ${config.text}`}>
          {config.icon} {stat}
        </span>
        <span className="text-xs font-heading text-foreground/70">{value}</span>
      </div>
      <div className="h-2 stat-bar-bg rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${config.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ boxShadow: `0 0 8px ${config.bar === 'bg-red-500' ? 'rgba(239,68,68,0.4)' : config.bar === 'bg-green-500' ? 'rgba(34,197,94,0.4)' : config.bar === 'bg-blue-500' ? 'rgba(59,130,246,0.4)' : config.bar === 'bg-pink-500' ? 'rgba(236,72,153,0.4)' : 'rgba(234,179,8,0.4)'}` }}
        />
      </div>
    </div>
  );
}