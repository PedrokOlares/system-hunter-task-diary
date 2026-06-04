import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { PERSONAL_TRAINERS } from "@/lib/hunterUtils";

const trainers = Object.entries(PERSONAL_TRAINERS);

export default function TrainerCarousel({ selected, onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i - 1 + trainers.length) % trainers.length);
  const next = () => setActiveIndex((i) => (i + 1) % trainers.length);

  const getPosition = (index) => {
    const diff = (index - activeIndex + trainers.length) % trainers.length;
    if (diff === 0) return "center";
    if (diff === 1 || diff === -(trainers.length - 1)) return "right1";
    if (diff === trainers.length - 1 || diff === -1) return "left1";
    if (diff === 2) return "right2";
    return "left2";
  };

  const posStyles = {
    center: { x: 0, scale: 1.1, zIndex: 10, opacity: 1, filter: "brightness(1)" },
    right1: { x: "55%", scale: 0.85, zIndex: 7, opacity: 0.85, filter: "brightness(0.7)" },
    left1: { x: "-55%", scale: 0.85, zIndex: 7, opacity: 0.85, filter: "brightness(0.7)" },
    right2: { x: "100%", scale: 0.65, zIndex: 4, opacity: 0.5, filter: "brightness(0.4)" },
    left2: { x: "-100%", scale: 0.65, zIndex: 4, opacity: 0.5, filter: "brightness(0.4)" },
  };

  const [name, trainer] = trainers[activeIndex];
  const isSelected = selected === name;

  return (
    <div className="w-full">
      <p className="text-xs text-muted-foreground text-center mb-4 font-heading tracking-wider">
        ◄ ESCOLHA SEU PERSONAL TRAINER ►
      </p>

      {/* Carousel */}
      <div className="relative h-72 flex items-center justify-center overflow-hidden">
        {trainers.map(([tname, trainer], index) => {
          const pos = getPosition(index);
          const style = posStyles[pos] || posStyles.left2;
          return (
            <motion.div
              key={tname}
              animate={style}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute w-40 cursor-pointer"
              onClick={() => {
                if (pos === "center") {
                  onSelect(tname);
                } else {
                  setActiveIndex(index);
                }
              }}
              style={{ zIndex: style.zIndex }}
            >
              <div
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                  selected === tname
                    ? "border-yellow-400"
                    : pos === "center"
                    ? "border-primary/60"
                    : "border-border/30"
                }`}
                style={{ aspectRatio: "2/3" }}
              >
                {/* Background image */}
                <img
                  src={trainer.cardImage || trainer.avatar}
                  alt={tname}
                  className="w-full h-full object-cover object-top"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Selected badge */}
                {selected === tname && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                )}

                {/* Name & title */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-heading text-sm text-white leading-tight">{tname}</p>
                  <p className="text-[10px] text-yellow-400 font-heading tracking-wider">{trainer.title}</p>
                  {pos === "center" && (
                    <p className="text-[9px] text-white/70 font-body mt-1 leading-tight">{trainer.specialty}</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-0 z-20 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center text-primary hover:border-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-0 z-20 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center text-primary hover:border-primary transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Select button */}
      <div className="text-center mt-4">
        <button
          onClick={() => onSelect(name)}
          className={`px-6 py-2 rounded-lg border font-heading text-xs tracking-wider transition-all ${
            isSelected
              ? "border-yellow-400 bg-yellow-400/20 text-yellow-400"
              : "border-primary/40 bg-primary/10 text-primary hover:border-primary"
          }`}
        >
          {isSelected ? "✓ SELECIONADO" : "SELECIONAR"}
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {trainers.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === activeIndex ? "bg-primary w-4" : "bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}