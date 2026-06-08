import React from 'react';
import { Check, X } from 'lucide-react';

class Question extends React.Component {
  render() {
    const { 
      questionData, 
      selectedAnswer, 
      isAnswerChecked, 
      onSelectAnswer,
      questionNumber,
      totalQuestions 
    } = this.props;

    if (!questionData) {
      return (
        <div className="card text-center p-8">
          <p className="text-secondary text-lg">No question loaded.</p>
        </div>
      );
    }

    const { question, options, answer } = questionData;

    return (
      <div className="card question-card">
        {/* Question Header */}
        <div className="question-header">
          <span className="badge">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Text */}
        <h2 className="question-text">{question}</h2>

        {/* Answer Options */}
        <div className="options-grid">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === answer;
            
            let optionClass = "option-item";
            let iconToShow = null;

            if (isAnswerChecked) {
              if (isCorrect) {
                optionClass += " option-correct";
                iconToShow = <Check className="option-icon text-success-heavy" size={18} />;
              } else if (isSelected) {
                optionClass += " option-incorrect";
                iconToShow = <X className="option-icon text-danger-heavy" size={18} />;
              } else {
                optionClass += " option-disabled";
              }
            } else if (isSelected) {
              optionClass += " option-selected";
            }

            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => !isAnswerChecked && onSelectAnswer(option)}
                disabled={isAnswerChecked}
                aria-label={`Option ${index + 1}: ${option}`}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-label">{option}</span>
                {iconToShow}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Question;
