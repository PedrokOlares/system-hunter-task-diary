import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Swords, Lock } from "lucide-react";
import { STAT_COLORS } from "@/lib/hunterUtils";

const DIFF_COLORS = {
  E: "text-gray-400 border-gray-500/30",
  D: "text-green-400 border-green-500/30",
  C: "text-blue-400 border-blue-500/30",
  B: "text-purple-400 border-purple-500/30",
  A: "text-orange-400 border-orange-500/30",
  S: "text-red-400 border-red-500/30",
};

export default function MissionCard({ mission, onComplete, isPremiumUser }) {
  const cat = STAT_COLORS[mission.category] || STAT_COLORS.strength;
  const diff = DIFF_COLORS[mission.difficulty] || DIFF_COLORS.E;
  const isLocked = mission.is_premium && !isPremiumUser;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`system-panel rounded-lg p-4 border ${
        mission.is_completed
          ? "border-green-500/30 bg-green-500/5"
          : isLocked
          ? "border-yellow-500/20 bg-yellow-500/5 opacity-70"
          : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-heading px-1.5 py-0.5 rounded border ${diff}`}>
              {mission.difficulty}-Rank
            </span>
            <span className={`text-[10px] font-heading ${cat.text}`}>
              {cat.icon} {mission.category}
            </span>
            {mission.is_premium && (
              <span className="text-[10px] font-heading text-yellow-400">⭐ PREMIUM</span>
            )}
          </div>
          <h3 className={`font-heading text-sm ${mission.is_completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {mission.title}
          </h3>
          {mission.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{mission.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="text-primary">+{mission.xp_reward} XP</span>
            <span className={cat.text}>+{mission.stat_reward} {mission.category}</span>
          </div>
        </div>

        {mission.is_completed ? (
          <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
        ) : isLocked ? (
          <Lock className="w-6 h-6 text-yellow-500 flex-shrink-0" />
        ) : (
          <Button
            size="sm"
            onClick={() => onComplete(mission)}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 flex-shrink-0"
          >
            <Swords className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.diS>
  );
}