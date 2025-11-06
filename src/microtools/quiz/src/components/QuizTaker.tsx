import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Clock, CheckCircle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
}

interface QuizTakerProps {
  quiz: Quiz;
  onFinish: (results: any) => void;
  onBackToBuilder: () => void;
}

const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, onFinish, onBackToBuilder }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizFinished && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted && !quizFinished) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizFinished]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(quiz.timeLimit);
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(quiz.timeLimit);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setQuizFinished(true);
    setQuizStarted(false);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setTimeLeft(quiz.timeLimit);
    setQuizStarted(false);
    setQuizFinished(false);
    setScore(0);
  };

  const getScoreColor = () => {
    const percentage = (score / quiz.questions.length) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreMessage = () => {
    const percentage = (score / quiz.questions.length) * 100;
    if (percentage >= 80) return 'Excellent work! 🎉';
    if (percentage >= 60) return 'Good job! 👍';
    return 'Keep practicing! 💪';
  };

  if (quizFinished) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="border-border shadow-elegant bg-card-gradient backdrop-blur-sm text-center">
          <CardHeader className="space-y-6 pb-6">
            <div className="mx-auto w-20 h-20 bg-quiz-gradient rounded-full flex items-center justify-center shadow-glow">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div className={`text-7xl font-bold ${getScoreColor()} drop-shadow-sm`}>
                {score}/{quiz.questions.length}
              </div>
              <div className="text-2xl text-muted-foreground font-medium">
                {Math.round((score / quiz.questions.length) * 100)}% Correct
              </div>
              <div className="text-xl font-semibold bg-quiz-gradient bg-clip-text text-transparent">
                {getScoreMessage()}
              </div>
            </div>
            
            <div className="space-y-6 pt-6">
              <h3 className="text-2xl font-bold">Review Your Answers</h3>
              <div className="space-y-4">
                {quiz.questions.map((question, index) => {
                  const isCorrect = selectedAnswers[index] === question.correctAnswer;
                  const userAnswer = selectedAnswers[index];
                  return (
                    <div key={index} className="text-left p-6 border border-border rounded-xl bg-surface-gradient shadow-soft">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
                          {isCorrect ? (
                            <CheckCircle className="h-6 w-6 text-success" />
                          ) : (
                            <XCircle className="h-6 w-6 text-destructive" />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <p className="font-semibold text-lg">Q{index + 1}: {question.question}</p>
                          <div className="space-y-2">
                            <div className={`p-3 rounded-lg ${isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                              <span className="font-medium">Your answer:</span> {userAnswer !== undefined ? `${String.fromCharCode(65 + userAnswer)}: ${question.options[userAnswer]}` : 'Not answered'}
                            </div>
                            {!isCorrect && (
                              <div className="p-3 rounded-lg bg-success/10 text-success">
                                <span className="font-medium">Correct answer:</span> {String.fromCharCode(65 + question.correctAnswer)}: {question.options[question.correctAnswer]}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                variant="hero" 
                size="xl" 
                onClick={restartQuiz}
                className="shadow-elegant hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                <RotateCcw className="h-5 w-5 mr-3" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={onBackToBuilder}
                className="shadow-soft hover:shadow-card transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-3" />
                Create New Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="border-border shadow-elegant bg-card-gradient backdrop-blur-sm text-center">
          <CardHeader className="space-y-6">
            <CardTitle className="text-4xl font-bold bg-quiz-gradient bg-clip-text text-transparent drop-shadow-sm">
              {quiz.title}
            </CardTitle>
            {quiz.description && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">{quiz.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 border border-border rounded-xl bg-surface-gradient shadow-soft">
                <div className="text-4xl font-bold text-primary mb-2">
                  {quiz.questions.length}
                </div>
                <div className="text-lg text-muted-foreground font-medium">Questions</div>
              </div>
              <div className="p-6 border border-border rounded-xl bg-surface-gradient shadow-soft">
                <div className="text-4xl font-bold text-primary mb-2">
                  {quiz.timeLimit}s
                </div>
                <div className="text-lg text-muted-foreground font-medium">Per Question</div>
              </div>
            </div>
            
            <div className="space-y-6 text-left max-w-md mx-auto">
              <h3 className="text-xl font-bold text-center">Instructions:</h3>
              <ul className="space-y-3 text-muted-foreground text-lg">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  Select the best answer for each question
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  You have {quiz.timeLimit} seconds per question
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  Questions will auto-advance when time runs out
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  Review your results at the end
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="xl" 
                onClick={startQuiz}
                className="shadow-elegant hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                Start Quiz
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={onBackToBuilder}
                className="shadow-soft hover:shadow-card transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-3" />
                Back to Builder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="border-border shadow-elegant bg-card-gradient backdrop-blur-sm">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-base text-muted-foreground font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
            <div className="flex items-center gap-3 text-base font-semibold">
              <div className={`p-2 rounded-full ${timeLeft <= 10 ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                <Clock className={`h-5 w-5 ${timeLeft <= 10 ? 'text-destructive' : 'text-primary'}`} />
              </div>
              <span className={timeLeft <= 10 ? 'text-destructive' : 'text-primary'}>{timeLeft}s</span>
            </div>
          </div>
          <Progress value={progress} className="h-3 bg-muted shadow-soft" />
          <CardTitle className="text-2xl font-bold leading-relaxed">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswers[currentQuestion] === index ? "default" : "quiz"}
                size="lg"
                onClick={() => selectAnswer(index)}
                className="justify-start text-left h-auto min-h-[4rem] p-6 shadow-soft hover:shadow-card transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg shadow-soft">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1 text-lg">{option}</div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={onBackToBuilder}
              disabled={quizStarted}
              className="shadow-soft hover:shadow-card transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Quiz
            </Button>
            <Button
              variant="hero"
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="shadow-elegant hover:shadow-glow transition-all duration-300"
            >
              {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizTaker;