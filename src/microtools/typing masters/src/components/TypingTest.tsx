import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { TimerSelector } from "./TimerSelector";
import { WordDisplay } from "./WordDisplay";
import { Stats } from "./Stats";
import { ResultScreen } from "./ResultScreen";
import { generateWords } from "../utils/wordGenerator";
import { Button } from "./ui/button";

export const TypingTest = () => {
  const [selectedTime, setSelectedTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [typedWords, setTypedWords] = useState<{ word: string; correct: boolean }[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWords(generateWords(300));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!isActive && value.length > 0) {
      setIsActive(true);
    }

    if (value.endsWith(" ")) {
      const typedWord = value.trim();
      const currentWord = words[currentWordIndex];
      const isCorrect = typedWord === currentWord;

      if (!isCorrect) {
        setMistakes((prev) => prev + 1);
      }

      setTypedWords([...typedWords, { word: typedWord, correct: isCorrect }]);
      setCurrentWordIndex((prev) => prev + 1);
      setCurrentInput("");
    } else {
      setCurrentInput(value);
    }
  };

  const calculateStats = () => {
    const timeElapsed = (selectedTime - timeLeft) / 60;
    const correctWords = typedWords.filter((w) => w.correct).length;
    const totalCharacters = typedWords.reduce((acc, w) => acc + w.word.length, 0);
    
    const wpm = timeElapsed > 0 ? Math.round(correctWords / timeElapsed) : 0;
    const accuracy = typedWords.length > 0 
      ? Math.round((correctWords / typedWords.length) * 100)
      : 100;
    const cpm = timeElapsed > 0 ? Math.round(totalCharacters / timeElapsed) : 0;

    return { wpm, accuracy, cpm };
  };

  const stats = calculateStats();

  const handleRestart = () => {
    setWords(generateWords(300));
    setCurrentWordIndex(0);
    setCurrentInput("");
    setTypedWords([]);
    setMistakes(0);
    setTimeLeft(selectedTime);
    setIsActive(false);
    setIsFinished(false);
    inputRef.current?.focus();
  };

  const handleTimeSelect = (time: number) => {
    setSelectedTime(time);
    setTimeLeft(time);
    handleRestart();
  };

  if (isFinished) {
    return (
      <ResultScreen
        wpm={stats.wpm}
        accuracy={stats.accuracy}
        mistakes={mistakes}
        time={selectedTime}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <TimerSelector
          selectedTime={selectedTime}
          onTimeSelect={handleTimeSelect}
          disabled={isActive}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card inline-block px-8 py-4 rounded-2xl"
        >
          <div className="text-6xl font-bold gradient-text">
            {timeLeft}s
          </div>
        </motion.div>
      </div>

      <Stats wpm={stats.wpm} accuracy={stats.accuracy} cpm={stats.cpm} mistakes={mistakes} />

      <WordDisplay
        words={words}
        currentWordIndex={currentWordIndex}
        currentInput={currentInput}
        typedWords={typedWords}
      />

      <div className="flex justify-center">
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          className="glass-card px-6 py-4 rounded-2xl text-xl text-center w-full max-w-md
                   focus:outline-none focus:ring-2 focus:ring-primary bg-transparent
                   placeholder:text-muted-foreground"
          placeholder={isActive ? "Type here..." : "Start typing to begin..."}
          autoFocus
        />
      </div>

      {isActive && (
        <div className="flex justify-center">
          <Button
            onClick={() => setIsActive(false)}
            variant="outline"
            size="lg"
            className="rounded-xl glass-card"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        </div>
      )}
    </div>
  );
};
