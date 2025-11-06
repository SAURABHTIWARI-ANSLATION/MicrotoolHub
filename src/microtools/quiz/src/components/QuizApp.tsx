import React, { useState, useEffect } from 'react';
import QuizBuilder from './QuizBuilder';
import QuizTaker from './QuizTaker';

interface Quiz {
  title: string;
  description: string;
  timeLimit: number;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

const QuizApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'builder' | 'taker'>('builder');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    // Check if there's a shared quiz in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedQuiz = urlParams.get('quiz');
    
    if (sharedQuiz) {
      try {
        const quizData = JSON.parse(decodeURIComponent(sharedQuiz));
        setCurrentQuiz(quizData);
        setCurrentView('taker');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Failed to load shared quiz:', error);
      }
    }
  }, []);

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentView('taker');
  };

  const backToBuilder = () => {
    setCurrentView('builder');
    setCurrentQuiz(null);
  };

  const finishQuiz = (results: any) => {
    // Handle quiz completion (could save results, etc.)
    console.log('Quiz finished with results:', results);
  };

  return (
    <div className="min-h-screen bg-surface-gradient">
      {currentView === 'builder' ? (
        <QuizBuilder onStartQuiz={startQuiz} />
      ) : (
        <QuizTaker
          quiz={currentQuiz!}
          onFinish={finishQuiz}
          onBackToBuilder={backToBuilder}
        />
      )}
    </div>
  );
};

export default QuizApp;