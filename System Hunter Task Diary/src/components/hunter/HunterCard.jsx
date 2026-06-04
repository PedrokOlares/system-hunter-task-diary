import { RANK_CONFIG, PERSONAL_TRAINERS } from "@/lib/hunterUtils";
import XPBar from "./XPBar";
import StatBar from "./StatBar";
import { Shield, Flame, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function HunterCard({ profile }) {
  if (!profile) return null;
  const rank = RANK_CONFIG[profile.hunter_class] || RANK_CONFIG["E-Rank"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`system-panel rounded-xl p-5 ${rank.border} glow-blue`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-16 h-16 rounded-lg border-2 ${rank.border} overflow-hidden flex-shrink-0`}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full ${rank.bg} flex items-center justify-center`}>
              <Shield className={`w-8 h-8 ${rank.color}`} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading text-lg text-foreground truncate">
            {profile.hunter_name}
          </h2>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`text-xs font-heading ${rank.color} tracking-wider`}>
              {profile.hunter_class}
            </span>
            {profile.is_premium && (
              <span className="text-xs font-heading text-yellow-400 flex items-center gap-1">
                <Flame className="w-3 h-3" /> PREMIUM
              </span>
            )}
          </div>
          {/* Personal trainer badge */}
          {profile.is_premium && profile.selected_personal && (() => {
            const trainer = PERSONAL_TRAINERS[profile.selected_personal];
            return (
              <div className="flex items-center gap-1.5 mt-1.5">
                <img
                  src={trainer?.avatar}
                  alt=""
                  className="w-5 h-5 rounded-full border border-yellow-500/40 object-cover"
                />
                <span className="text-[10px] font-heading text-yellow-300 tracking-wider">
                  {profile.selected_personal}
                </span>
                <span className="text-[9px] text-muted-foreground font-body">
                  • {trainer?.title}
                </span>
              </div>
            );
          })()}
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary" /> {profile.streak_days} dias
            </span>
            <span>🎯 {profile.total_missions_completed} missões</span>
          </div>
        </div>
      </div>

      <XPBar xp={profile.xp} xpToNext={profile.xp_to_next} level={profile.level} />

      <div className="grid grid-cols-1 gap-2 mt-4">
        <StatBar stat="strength" value={profile.strength} />
        <StatBar stat="agility" value={profile.agility} />
        <StatBar stat="vitality" value={profile.vitality} />
        <StatBar stat="intelligence" value={profile.intelligence} />
        <StatBar stat="endurance" value={profile.endurance} />
      </div>
    </motion.div>
  );
}