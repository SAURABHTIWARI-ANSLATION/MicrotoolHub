import { motion } from "framer-motion";
import { Gauge, Target, Zap, AlertCircle } from "lucide-react";

interface StatsProps {
  wpm: number;
  accuracy: number;
  cpm: number;
  mistakes: number;
}

export const Stats = ({ wpm, accuracy, cpm, mistakes }: StatsProps) => {
  const stats = [
    { label: "WPM", value: wpm, icon: Gauge, color: "text-primary" },
    { label: "Accuracy", value: `${accuracy}%`, icon: Target, color: "text-success" },
    { label: "CPM", value: cpm, icon: Zap, color: "text-secondary" },
    { label: "Mistakes", value: mistakes, icon: AlertCircle, color: "text-destructive" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-6 rounded-2xl text-center"
        >
          <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
          <div className="text-3xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};
