import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp, Footprints, Heart, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { xpForLevel, calculateRank } from "@/lib/hunterUtils";

// Rules: Google Fit data → auto-create completed missions with XP
const FIT_MISSION_RULES = [
  {
    id: "run_5k",
    label: "Corrida 5km",
    check: (d) => d.distance_km >= 5,
    mission: { title: "🏃 Corrida 5km (Google Fit)", category: "agility", difficulty: "C", xp_reward: 35, stat_reward: 3 },
  },
  {
    id: "walk_8k_steps",
    label: "8.000 Passos",
    check: (d) => d.steps >= 8000,
    mission: { title: "🚶 Caminhada 8.000 Passos (Google Fit)", category: "endurance", difficulty: "D", xp_reward: 20, stat_reward: 2 },
  },
  {
    id: "cardio_session",
    label: "Sessão de Cardio",
    check: (d) => d.heart_rate_avg >= 130,
    mission: { title: "❤️ Sessão de Cardio Intensa (Google Fit)", category: "vitality", difficulty: "C", xp_reward: 35, stat_reward: 3 },
  },
  {
    id: "active_30min",
    label: "30 Min Ativos",
    check: (d) => d.active_minutes >= 30,
    mission: { title: "⚡ 30 Minutos Ativos (Google Fit)", category: "endurance", difficulty: "D", xp_reward: 20, stat_reward: 2 },
  },
  {
    id: "walk_10k",
    label: "Caminhada 10km",
    check: (d) => d.distance_km >= 10,
    mission: { title: "🗺️ Caminhada 10km (Google Fit)", category: "agility", difficulty: "B", xp_reward: 50, stat_reward: 4 },
  },
];

export default function GoogleFitConnect({ profile, onMissionsCreated }) {
  const [status, setStatus] = useState("idle"); // idle | connecting | connected | error
  const [fitData, setFitData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState([]);
  const [error, setError] = useState("");

  const connect = () => {
    setStatus("connecting");
    setTimeout(() => {
      // Demo data — replace with real OAuth when CLIENT_ID is set
      const demo = {
        steps: 8432,
        distance_km: 6.1,
        calories: 412,
        heart_rate_avg: 88,
        active_minutes: 47,
      };
      setFitData(demo);
      setStatus("connected");
    }, 1500);
  };

  const convertToMissions = async () => {
    if (!profile || !fitData) return;
    setConverting(true);

    const today = new Date().toISOString().split("T")[0];
    const triggered = FIT_MISSION_RULES.filter((r) => r.check(fitData));
    let totalXP = 0;

    for (const rule of triggered) {
      // Create mission already marked as completed
      await base44.entities.Mission.create({
        ...rule.mission,
        description: `Verificado automaticamente pelo Google Fit em ${today}`,
        mission_date: today,
        hunter_profile_id: profile.id,
        is_completed: true,
        is_premium: false,
      });
      totalXP += rule.mission.xp_reward;
    }

    if (triggered.length > 0 && totalXP > 0) {
      // Update hunter XP + stats
      let newXP = (profile.xp || 0) + totalXP;
      let newLevel = profile.level || 1;
      let newXpToNext = profile.xp_to_next || 100;

      while (newXP >= newXpToNext) {
        newXP -= newXpToNext;
        newLevel += 1;
        newXpToNext = xpForLevel(newLevel);
      }

      // Aggregate stat rewards
      const statUpdates = {};
      for (const rule of triggered) {
        const cat = rule.mission.category;
        statUpdates[cat] = (statUpdates[cat] || profile[cat] || 10) + rule.mission.stat_reward;
      }

      await base44.entities.HunterProfile.update(profile.id, {
        xp: newXP,
        xp_to_next: newXpToNext,
        level: newLevel,
        hunter_class: calculateRank(newLevel),
        total_missions_completed: (profile.total_missions_completed || 0) + triggered.length,
        monthly_score: (profile.monthly_score || 0) + totalXP,
        ...statUpdates,
      });
    }

    setConverted(triggered.map((r) => r.label));
    setConverting(false);
    onMissionsCreated && onMissionsCreated();
  };

  const disconnect = () => {
    setFitData(null);
    setStatus("idle");
    setConverted([]);
  };

  const triggeredRules = fitData ? FIT_MISSION_RULES.filter((r) => r.check(fitData)) : [];

  return (
    <div className="system-panel rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="font-heading text-sm text-foreground tracking-wider">GOOGLE FIT</p>
            <p className="text-[10px] text-muted-foreground font-body">
              {status === "connected"
                ? converted.length > 0
                  ? `${converted.length} missão(ões) convertida(s)`
                  : "Dados sincronizados"
                : "Sincronizar exercícios → missões + XP"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === "connected" && <CheckCircle2 className="w-4 h-4 text-green-400" />}
          {status === "error" && <XCircle className="w-4 h-4 text-destructive" />}
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-4 space-y-4">

              {/* IDLE */}
              {status === "idle" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">
                    Conecte o Google Fit para converter automaticamente seus exercícios em missões concluídas com XP.
                  </p>
                  <div className="space-y-1.5">
                    {FIT_MISSION_RULES.map((r) => (
                      <div key={r.id} className="flex items-center gap-2 text-[10px] text-muted-foreground font-body">
                        <Zap className="w-3 h-3 text-primary flex-shrink-0" />
                        {r.label} → +{r.mission.xp_reward} XP
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={connect}
                    className="w-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 font-heading text-xs tracking-wider"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    CONECTAR GOOGLE FIT
                  </Button>
                  <p className="text-[9px] text-muted-foreground font-body text-center">
                    * Modo demo — dados simulados para visualização
                  </p>
                </div>
              )}

              {/* CONNECTING */}
              {status === "connecting" && (
                <div className="text-center py-4">
                  <Loader2 className="w-8 h-8 animate-spin text-green-400 mx-auto mb-2" />
                  <p className="text-xs font-heading text-muted-foreground tracking-wider">SINCRONIZANDO...</p>
                </div>
              )}

              {/* CONNECTED */}
              {status === "connected" && fitData && (
                <div className="space-y-3">
                  {/* Metrics */}
                  <p className="text-[10px] font-heading text-green-400 tracking-wider">✓ DADOS DE HOJE</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Passos", value: fitData.steps.toLocaleString(), icon: Footprints, color: "text-blue-400" },
                      { label: "Distância", value: `${fitData.distance_km} km`, icon: MapPin, color: "text-green-400" },
                      { label: "Calorias", value: `${fitData.calories} kcal`, icon: Activity, color: "text-orange-400" },
                      { label: "BPM Médio", value: `${fitData.heart_rate_avg} bpm`, icon: Heart, color: "text-red-400" },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="bg-muted/30 rounded-lg p-3">
                        <Icon className={`w-4 h-4 ${color} mb-1`} />
                        <p className="text-sm font-heading text-foreground">{value}</p>
                        <p className="text-[10px] text-muted-foreground font-body">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Missions to be created */}
                  {converted.length === 0 && triggeredRules.length > 0 && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
                      <p className="text-[10px] font-heading text-primary tracking-wider">⚔️ MISSÕES DESBLOQUEADAS</p>
                      {triggeredRules.map((r) => (
                        <div key={r.id} className="flex items-center justify-between text-xs font-body">
                          <span className="text-foreground">{r.mission.title.replace(" (Google Fit)", "")}</span>
                          <span className="text-primary font-heading">+{r.mission.xp_reward} XP</span>
                        </div>
                      ))}
                      <Button
                        onClick={convertToMissions}
                        disabled={converting || !profile}
                        className="w-full mt-1 bg-primary/20 text-primary border border-primary/30 font-heading text-xs tracking-wider"
                      >
                        {converting ? (
                          <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> CONVERTENDO...</>
                        ) : (
                          <><Zap className="w-3 h-3 mr-1" /> CONVERTER EM MISSÕES + XP</>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Already converted */}
                  {converted.length > 0 && (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 space-y-1.5">
                      <p className="text-[10px] font-heading text-green-400 tracking-wider">✅ MISSÕES CONCLUÍDAS AUTOMATICAMENTE</p>
                      {converted.map((label) => (
                        <p key={label} className="text-xs text-foreground font-body flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-green-400" /> {label}
                        </p>
                      ))}
                    </div>
                  )}

                  {triggeredRules.length === 0 && converted.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center font-body py-2">
                      Nenhuma meta atingida hoje ainda. Continue se movendo!
                    </p>
                  )}

                  <button onClick={disconnect} className="text-[10px] text-muted-foreground hover:text-destructive font-body transition-colors">
                    Desconectar
                  </button>
                </div>
              )}

              {/* ERROR */}
              {status === "error" && (
                <div className="text-center py-3 space-y-2">
                  <XCircle className="w-8 h-8 text-destructive mx-auto" />
                  <p className="text-xs text-destructive font-body">{error}</p>
                  <Button onClick={() => setStatus("idle")} variant="ghost" className="text-xs font-heading">Tentar novamente</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}