import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { PlusCircle, Trash2, Edit, Play, Share2 } from 'lucide-react';

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

interface QuizBuilderProps {
  onStartQuiz: (quiz: Quiz) => void;
}

const QuizBuilder: React.FC<QuizBuilderProps> = ({ onStartQuiz }) => {
  const [quiz, setQuiz] = useState<Quiz>({
    title: '',
    description: '',
    timeLimit: 30,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  const addQuestion = () => {
    if (currentQuestion.question.trim() && currentQuestion.options.every(opt => opt.trim())) {
      if (isEditing) {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[editIndex] = currentQuestion;
        setQuiz({ ...quiz, questions: updatedQuestions });
        setIsEditing(false);
        setEditIndex(-1);
      } else {
        setQuiz({ ...quiz, questions: [...quiz.questions, currentQuestion] });
      }
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  };

  const editQuestion = (index: number) => {
    setCurrentQuestion(quiz.questions[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const generateShareableLink = () => {
    const quizData = encodeURIComponent(JSON.stringify(quiz));
    return `${window.location.origin}?quiz=${quizData}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-quiz-gradient bg-clip-text text-transparent drop-shadow-sm">
          Quiz Generator
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Create engaging quizzes with multiple-choice questions and share them instantly
        </p>
      </div>

      {/* Quiz Settings */}
      <Card className="border-border shadow-card bg-card-gradient backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-quiz-gradient rounded-lg shadow-glow">
              <Edit className="h-5 w-5 text-white" />
            </div>
            Quiz Settings
          </CardTitle>
          <CardDescription className="text-base">Configure your quiz details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Quiz Title</Label>
              <Input
                id="title"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                placeholder="Enter an engaging quiz title"
                className="bg-background border-border shadow-soft transition-all duration-200 focus:shadow-elegant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeLimit" className="text-sm font-medium">Time Limit (seconds per question)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="10"
                max="300"
                value={quiz.timeLimit}
                onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })}
                className="bg-background border-border shadow-soft transition-all duration-200 focus:shadow-elegant"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={quiz.description}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              placeholder="Describe your quiz and what participants can expect..."
              className="bg-background border-border shadow-soft transition-all duration-200 focus:shadow-elegant min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Question Builder */}
      <Card className="border-border shadow-card bg-card-gradient backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-hero-gradient rounded-lg shadow-glow">
              <PlusCircle className="h-5 w-5 text-white" />
            </div>
            {isEditing ? 'Edit Question' : 'Add New Question'}
          </CardTitle>
          <CardDescription className="text-base">
            Create multiple-choice questions with four answer options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-medium">Question</Label>
            <Textarea
              id="question"
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
              placeholder="Enter your question here..."
              className="bg-background border-border shadow-soft transition-all duration-200 focus:shadow-elegant"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`option-${index}`} className="text-sm font-medium">
                  Option {String.fromCharCode(65 + index)}
                </Label>
                <div className="flex gap-3">
                  <Input
                    id={`option-${index}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="bg-background border-border shadow-soft transition-all duration-200 focus:shadow-elegant"
                  />
                  <Button
                    variant={currentQuestion.correctAnswer === index ? "success" : "outline"}
                    size="sm"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                    className="shrink-0 min-w-[40px] transition-all duration-200"
                  >
                    {currentQuestion.correctAnswer === index ? '✓' : '○'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={addQuestion} 
            variant="hero" 
            size="lg" 
            className="w-full shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            {isEditing ? 'Update Question' : 'Add Question'}
          </Button>
        </CardContent>
      </Card>

      {/* Questions List */}
      {quiz.questions.length > 0 && (
        <Card className="border-border shadow-card bg-card-gradient backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Quiz Questions ({quiz.questions.length})</CardTitle>
            <CardDescription className="text-base">Review and manage your questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quiz.questions.map((q, index) => (
                <div key={index} className="p-6 border border-border rounded-xl bg-surface-gradient shadow-soft">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-lg">Q{index + 1}: {q.question}</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editQuestion(index)}
                        className="hover:bg-accent/50 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          optIndex === q.correctAnswer
                            ? 'bg-success/10 border-success text-success-foreground shadow-sm'
                            : 'bg-muted/50 border-border hover:bg-muted/70'
                        }`}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + optIndex)}:</span> {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {quiz.questions.length > 0 && quiz.title.trim() && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="hero"
            size="xl"
            onClick={() => onStartQuiz(quiz)}
            className="flex items-center gap-3 shadow-elegant hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            <Play className="h-5 w-5" />
            Start Quiz
          </Button>
          <Button
            variant="outline"
            size="xl"
            onClick={() => {
              navigator.clipboard.writeText(generateShareableLink());
              // Could add toast notification here
              alert('Quiz link copied to clipboard!');
            }}
            className="flex items-center gap-3 shadow-soft hover:shadow-card transition-all duration-300"
          >
            <Share2 className="h-5 w-5" />
            Share Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizBuilder;