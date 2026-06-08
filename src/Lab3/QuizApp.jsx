import React from 'react';
import Question from './Question';
import Score from './Score';
import { PlusCircle, Play, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

class QuizApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [
        {
          id: 1,
          question: "What is the capital of France?",
          options: ["Paris", "London", "Berlin", "Madrid"],
          answer: "Paris"
        },
        {
          id: 2,
          question: "What is the largest planet in our solar system?",
          options: ["Jupiter", "Saturn", "Mars", "Earth"],
          answer: "Jupiter"
        }
      ],
      currentQuestion: 0,
      score: 0,
      selectedAnswer: null,
      isAnswerChecked: false,
      quizEnd: false,
      activeTab: 'play', // 'play' or 'builder'

      // Form state for creating custom questions
      newQuestionText: '',
      newOptionA: '',
      newOptionB: '',
      newOptionC: '',
      newOptionD: '',
      newAnswerIndex: 0, // index of options (0-3)

      formError: '',
      formSuccess: false
    };

    // Bind methods
    this.handleAnswerSelect = this.handleAnswerSelect.bind(this);
    this.handleAnswerCheck = this.handleAnswerCheck.bind(this);
    this.handleNextQuestion = this.handleNextQuestion.bind(this);
    this.handleReplay = this.handleReplay.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddQuestion = this.handleAddQuestion.bind(this);
  }

  handleAnswerSelect(option) {
    this.setState({ selectedAnswer: option });
  }

  handleAnswerCheck() {
    const { questions, currentQuestion, selectedAnswer, score } = this.state;
    const currentQ = questions[currentQuestion];

    if (!selectedAnswer) {
      this.setState({ formError: 'Please select an option before checking!' });
      setTimeout(() => this.setState({ formError: '' }), 3000);
      return;
    }

    const isCorrect = selectedAnswer === currentQ.answer;
    
    this.setState({
      score: isCorrect ? score + 1 : score,
      isAnswerChecked: true
    });
  }

  handleNextQuestion() {
    const { currentQuestion, questions } = this.state;
    if (currentQuestion + 1 < questions.length) {
      this.setState({
        currentQuestion: currentQuestion + 1,
        selectedAnswer: null,
        isAnswerChecked: false
      });
    } else {
      this.setState({
        quizEnd: true
      });
    }
  }

  handleReplay() {
    this.setState({
      currentQuestion: 0,
      score: 0,
      selectedAnswer: null,
      isAnswerChecked: false,
      quizEnd: false
    });
  }

  handleTabChange(tab) {
    this.setState({ activeTab: tab });
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleAddQuestion(e) {
    e.preventDefault();
    const { 
      newQuestionText, 
      newOptionA, 
      newOptionB, 
      newOptionC, 
      newOptionD, 
      newAnswerIndex,
      questions 
    } = this.state;

    // Validate form inputs
    if (!newQuestionText.trim() || !newOptionA.trim() || !newOptionB.trim() || !newOptionC.trim() || !newOptionD.trim()) {
      this.setState({ formError: 'All fields must be filled out.' });
      return;
    }

    const options = [newOptionA.trim(), newOptionB.trim(), newOptionC.trim(), newOptionD.trim()];
    const answer = options[parseInt(newAnswerIndex)];

    const newQuestion = {
      id: questions.length + 1,
      question: newQuestionText.trim(),
      options: options,
      answer: answer
    };

    this.setState({
      questions: [...questions, newQuestion],
      newQuestionText: '',
      newOptionA: '',
      newOptionB: '',
      newOptionC: '',
      newOptionD: '',
      newAnswerIndex: 0,
      formError: '',
      formSuccess: true
    });

    // Reset success alert after 3 seconds
    setTimeout(() => {
      this.setState({ formSuccess: false });
    }, 3000);
  }

  render() {
    const { 
      questions, 
      currentQuestion, 
      score, 
      selectedAnswer, 
      isAnswerChecked, 
      quizEnd, 
      activeTab,
      newQuestionText,
      newOptionA,
      newOptionB,
      newOptionC,
      newOptionD,
      newAnswerIndex,
      formError,
      formSuccess
    } = this.state;

    const currentQ = questions[currentQuestion];

    return (
      <div className="quiz-app-container">
        {/* Navigation Tabs */}
        <header className="quiz-header-bar">
          <div className="app-branding">
            <h1 className="brand-title">Supercharged Quiz Studio</h1>
            <p className="brand-subtitle">Test your knowledge or build custom quiz challenges</p>
          </div>
          
          <nav className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'play' ? 'active' : ''}`}
              onClick={() => this.handleTabChange('play')}
            >
              <Play size={16} />
              <span>Play Quiz</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
              onClick={() => this.handleTabChange('builder')}
            >
              <PlusCircle size={16} />
              <span>Question Builder</span>
            </button>
          </nav>
        </header>

        {/* Dynamic Errors/Success inside builder */}
        {formSuccess && (
          <div className="alert alert-success animate-fade-in flex items-center gap-2">
            <CheckCircle2 size={18} />
            <span>Success! Question added to the quiz deck.</span>
          </div>
        )}

        {formError && (
          <div className="alert alert-danger animate-fade-in flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{formError}</span>
          </div>
        )}

        <main className="quiz-main-content">
          {activeTab === 'play' ? (
            quizEnd ? (
              <Score 
                score={score} 
                totalQuestions={questions.length} 
                onReplay={this.handleReplay} 
              />
            ) : (
              <div className="quiz-play-view animate-fade-in">
                <Question 
                  questionData={currentQ}
                  selectedAnswer={selectedAnswer}
                  isAnswerChecked={isAnswerChecked}
                  onSelectAnswer={this.handleAnswerSelect}
                  questionNumber={currentQuestion + 1}
                  totalQuestions={questions.length}
                />

                <div className="control-bar mt-6 flex justify-between gap-4">
                  {!isAnswerChecked ? (
                    <button 
                      className="btn btn-primary w-full"
                      onClick={this.handleAnswerCheck}
                      disabled={selectedAnswer === null}
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button 
                      className="btn btn-accent w-full"
                      onClick={this.handleNextQuestion}
                    >
                      {currentQuestion + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                    </button>
                  )}
                </div>
              </div>
            )
          ) : (
            /* Question Builder Screen */
            <div className="quiz-builder-view card animate-fade-in">
              <div className="section-title-area flex items-center gap-2 mb-6">
                <FileText className="text-primary" size={24} />
                <h2>Create a Custom Question</h2>
              </div>
              <form onSubmit={this.handleAddQuestion} className="builder-form">
                <div className="form-group">
                  <label htmlFor="newQuestionText">Question Text</label>
                  <input
                    type="text"
                    id="newQuestionText"
                    name="newQuestionText"
                    placeholder="e.g., What is the boiling point of water?"
                    value={newQuestionText}
                    onChange={this.handleInputChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="options-input-grid">
                  <div className="form-group">
                    <label htmlFor="newOptionA">Option A</label>
                    <input
                      type="text"
                      id="newOptionA"
                      name="newOptionA"
                      placeholder="Enter option A"
                      value={newOptionA}
                      onChange={this.handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newOptionB">Option B</label>
                    <input
                      type="text"
                      id="newOptionB"
                      name="newOptionB"
                      placeholder="Enter option B"
                      value={newOptionB}
                      onChange={this.handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newOptionC">Option C</label>
                    <input
                      type="text"
                      id="newOptionC"
                      name="newOptionC"
                      placeholder="Enter option C"
                      value={newOptionC}
                      onChange={this.handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newOptionD">Option D</label>
                    <input
                      type="text"
                      id="newOptionD"
                      name="newOptionD"
                      placeholder="Enter option D"
                      value={newOptionD}
                      onChange={this.handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newAnswerIndex">Select the Correct Option</label>
                  <select
                    id="newAnswerIndex"
                    name="newAnswerIndex"
                    value={newAnswerIndex}
                    onChange={this.handleInputChange}
                    className="form-select"
                  >
                    <option value={0}>Option A (Currently: {newOptionA || "Empty"})</option>
                    <option value={1}>Option B (Currently: {newOptionB || "Empty"})</option>
                    <option value={2}>Option C (Currently: {newOptionC || "Empty"})</option>
                    <option value={3}>Option D (Currently: {newOptionD || "Empty"})</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2">
                  <PlusCircle size={18} />
                  <span>Add Question to Deck</span>
                </button>
              </form>

              {/* Deck summary list */}
              <div className="deck-summary-section mt-8 pt-6 border-t">
                <h3>Current Deck ({questions.length} Questions)</h3>
                <ul className="deck-list mt-4">
                  {questions.map((q, idx) => (
                    <li key={q.id} className="deck-item flex justify-between items-center p-3 mb-2 rounded bg-bg-secondary">
                      <div>
                        <span className="font-semibold text-secondary text-sm mr-2">#{idx + 1}</span>
                        <span className="text-main font-medium">{q.question}</span>
                      </div>
                      <span className="badge text-xs badge-success">Ans: {q.answer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
}

export default QuizApp;
