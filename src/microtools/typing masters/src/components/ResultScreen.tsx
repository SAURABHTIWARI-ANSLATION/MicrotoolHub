import { motion } from "framer-motion";
import { Trophy, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface ResultScreenProps {
  wpm: number;
  accuracy: number;
  mistakes: number;
  time: number;
  onRestart: () => void;
}

export const ResultScreen = ({ wpm, accuracy, mistakes, time, onRestart }: ResultScreenProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getPerformanceMessage = () => {
    if (wpm >= 80) return "Outstanding! 🚀";
    if (wpm >= 60) return "Excellent Work! 🌟";
    if (wpm >= 40) return "Great Job! 💪";
    return "Keep Practicing! 📈";
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-card p-12 rounded-3xl max-w-2xl mx-auto text-center"
    >
      <motion.div variants={itemVariants}>
        <Trophy className="w-20 h-20 mx-auto mb-6 text-primary animate-float" />
      </motion.div>

      <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-2 gradient-text">
        {getPerformanceMessage()}
      </motion.h2>

      <motion.p variants={itemVariants} className="text-muted-foreground mb-8">
        Test completed in {time}s
      </motion.p>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
          <div className="text-5xl font-bold text-primary mb-2">
            <CountUp value={wpm} />
          </div>
          <div className="text-sm text-muted-foreground">Words Per Minute</div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
          <div className="text-5xl font-bold text-success mb-2">
            <CountUp value={accuracy} suffix="%" />
          </div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
          <div className="text-5xl font-bold text-secondary mb-2">
            <CountUp value={Math.round(wpm * 5)} />
          </div>
          <div className="text-sm text-muted-foreground">Characters Per Minute</div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
          <div className="text-5xl font-bold text-destructive mb-2">
            <CountUp value={mistakes} />
          </div>
          <div className="text-sm text-muted-foreground">Mistakes</div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Button
          onClick={onRestart}
          size="lg"
          className="rounded-xl px-8 bg-primary hover:bg-primary/90"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Try Again
        </Button>
      </motion.div>
    </motion.div>
  );
};

const CountUp = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {value}
        {suffix}
      </motion.span>
    </motion.span>
  );
};
