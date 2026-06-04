import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Swords, Trophy, Users, Crown, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Hub" },
  { path: "/missions", icon: Swords, label: "Missões" },
  { path: "/rankings", icon: Trophy, label: "Ranking" },
  { path: "/social", icon: Users, label: "Hunters" },
  { path: "/premium", icon: Crown, label: "Premium" },
  { path: "/profile", icon: User, label: "Perfil" },
];

export default function AppLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-6 border-r border-border bg-card/50 backdrop-blur-xl z-50">
        <Link to="/" className="mb-8">
          <span className="font-display text-xl text-primary text-glow-blue">SL</span>
        </Link>
        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary glow-blue"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-heading tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 border-b border-border bg-card/90 backdrop-blur-xl z-50">
        <Link to="/" className="font-display text-lg text-primary text-glow-blue">
          SOLO LEVELING
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-foreground p-2"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-14 left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border z-40 p-4"
          >
            <nav className="grid grid-cols-3 gap-3">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs font-heading">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around border-t border-border bg-card/90 backdrop-blur-xl z-50">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 p-2 transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-heading">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="md:ml-20 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}