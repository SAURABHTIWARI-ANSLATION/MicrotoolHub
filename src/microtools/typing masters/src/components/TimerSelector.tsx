import { motion } from "framer-motion";

interface TimerSelectorProps {
  selectedTime: number;
  onTimeSelect: (time: number) => void;
  disabled: boolean;
}

const timeOptions = [15, 30, 60, 120, 300];

export const TimerSelector = ({ selectedTime, onTimeSelect, disabled }: TimerSelectorProps) => {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {timeOptions.map((time) => (
        <motion.button
          key={time}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={() => !disabled && onTimeSelect(time)}
          disabled={disabled}
          className={`
            px-6 py-2.5 rounded-xl font-medium transition-all duration-300
            ${
              selectedTime === time
                ? "bg-primary text-primary-foreground shadow-lg"
                : "glass-card text-foreground hover:bg-primary/10"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {time < 60 ? `${time}s` : `${time / 60}min`}
        </motion.button>
      ))}
    </div>
  );
};
