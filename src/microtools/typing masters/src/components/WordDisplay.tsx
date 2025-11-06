import { motion } from "framer-motion";

interface WordDisplayProps {
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  typedWords: { word: string; correct: boolean }[];
}

export const WordDisplay = ({
  words,
  currentWordIndex,
  currentInput,
  typedWords,
}: WordDisplayProps) => {
  const isCurrentWordCorrect = words[currentWordIndex]?.startsWith(currentInput);

  return (
    <div className="glass-card p-8 rounded-3xl min-h-[200px] flex items-center justify-center">
      <div className="text-2xl leading-relaxed max-w-4xl text-center flex flex-wrap gap-3 justify-center">
        {words.slice(0, currentWordIndex + 20).map((word, index) => {
          const isTyped = index < currentWordIndex;
          const isCurrent = index === currentWordIndex;
          const typedWord = typedWords[index];

          return (
            <motion.span
              key={`${word}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`
                ${isTyped && typedWord?.correct ? "text-success" : ""}
                ${isTyped && !typedWord?.correct ? "text-destructive line-through" : ""}
                ${isCurrent ? "text-foreground font-semibold" : ""}
                ${!isTyped && !isCurrent ? "text-muted-foreground" : ""}
                transition-all duration-200
              `}
            >
              {isCurrent && currentInput && (
                <span className={isCurrentWordCorrect ? "text-success" : "text-destructive"}>
                  {currentInput}
                </span>
              )}
              {isCurrent && !currentInput && word}
              {!isCurrent && word}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};
