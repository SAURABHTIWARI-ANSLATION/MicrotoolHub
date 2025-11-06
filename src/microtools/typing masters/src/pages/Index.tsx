import { useState } from "react";
import { motion } from "framer-motion";
import { Keyboard, Trophy } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { TypingTest } from "../components/TypingTest";
import { Leaderboard } from "../components/Leaderboard";
import { Button } from "../components/ui/button";

const Index = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-3 rounded-2xl"
          >
            <Keyboard className="w-8 h-8 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              TypeSpeed Pro
            </h1>
            <p className="text-sm text-muted-foreground">
              Test your typing speed & accuracy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            variant="outline"
            className="glass-card hidden md:flex"
          >
            <Trophy className="w-5 h-5 mr-2" />
            {showLeaderboard ? "Hide" : "Show"} Leaderboard
          </Button>
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className={`grid ${showLeaderboard ? "lg:grid-cols-3" : "lg:grid-cols-1"} gap-8`}>
          <motion.div
            layout
            className={showLeaderboard ? "lg:col-span-2" : "lg:col-span-1"}
          >
            <TypingTest />
          </motion.div>

          {showLeaderboard && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-1"
            >
              <Leaderboard />
            </motion.div>
          )}
        </div>

        {/* Mobile Leaderboard Toggle */}
        <div className="md:hidden mt-8">
          <Button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            variant="outline"
            className="glass-card w-full"
            size="lg"
          >
            <Trophy className="w-5 h-5 mr-2" />
            {showLeaderboard ? "Hide" : "Show"} Leaderboard
          </Button>
        </div>

        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-6"
          >
            <Leaderboard />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-7xl mx-auto mt-16 text-center text-sm text-muted-foreground"
      >
        <p>Built with React & Framer Motion • Free to use • No sign-up required</p>
      </motion.footer>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};

export default Index;
