import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  wpm: number;
  accuracy: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "SpeedDemon", wpm: 142, accuracy: 98 },
  { rank: 2, name: "TypeMaster", wpm: 128, accuracy: 97 },
  { rank: 3, name: "KeyboardNinja", wpm: 115, accuracy: 96 },
  { rank: 4, name: "FastFingers", wpm: 108, accuracy: 95 },
  { rank: 5, name: "QuickTyper", wpm: 102, accuracy: 94 },
  { rank: 6, name: "RapidKeys", wpm: 95, accuracy: 93 },
  { rank: 7, name: "SwiftWriter", wpm: 88, accuracy: 92 },
  { rank: 8, name: "TurboType", wpm: 82, accuracy: 91 },
  { rank: 9, name: "FlashTypist", wpm: 76, accuracy: 90 },
  { rank: 10, name: "KeyPro", wpm: 70, accuracy: 89 },
];

export const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-primary" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-secondary" />;
    if (rank === 3) return <Award className="w-6 h-6 text-accent" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="glass-card p-8 rounded-3xl">
      <h2 className="text-3xl font-bold mb-6 text-center gradient-text">
        🏆 Leaderboard
      </h2>
      
      <div className="space-y-3">
        {mockLeaderboard.map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className={`
              glass-card p-4 rounded-2xl flex items-center gap-4
              transition-all duration-300 cursor-pointer
              ${entry.rank <= 3 ? "border-2 border-primary/30" : ""}
            `}
          >
            <div className="w-12 flex items-center justify-center">
              {getRankIcon(entry.rank)}
            </div>

            <div className="flex-1">
              <div className="font-semibold text-lg">{entry.name}</div>
              <div className="text-sm text-muted-foreground">
                {entry.accuracy}% accuracy
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{entry.wpm}</div>
              <div className="text-xs text-muted-foreground">WPM</div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Complete a test to join the leaderboard!
      </p>
    </div>
  );
};
