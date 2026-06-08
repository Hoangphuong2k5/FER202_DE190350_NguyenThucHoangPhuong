import React from 'react';
import { RotateCcw, Share2, Award, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

class Score extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      toastMessage: ''
    };
    this.handleShare = this.handleShare.bind(this);
  }

  handleShare() {
    const { score, totalQuestions } = this.props;
    const shareText = `I scored ${score}/${totalQuestions} on the Supercharged Quiz App! Check it out! 🏆✨`;
    
    navigator.clipboard.writeText(shareText)
      .then(() => {
        this.setState({
          showToast: true,
          toastMessage: 'Score copied to clipboard!'
        });
        setTimeout(() => {
          this.setState({ showToast: false });
        }, 3000);
      })
      .catch(() => {
        this.setState({
          showToast: true,
          toastMessage: 'Failed to copy score. Try sharing manually!'
        });
        setTimeout(() => {
          this.setState({ showToast: false });
        }, 3000);
      });
  }

  render() {
    const { score, totalQuestions, onReplay } = this.props;
    const percentage = Math.round((score / totalQuestions) * 100) || 0;
    
    // Performance feedback message and icon
    let FeedbackIcon = AlertTriangle;
    let feedbackTitle = "Keep Practicing!";
    let feedbackColor = "text-danger";
    let feedbackMessage = "You can do better! Try reviewing the questions and testing yourself again.";

    if (percentage === 100) {
      FeedbackIcon = Award;
      feedbackTitle = "Perfect Score!";
      feedbackColor = "text-accent";
      feedbackMessage = "Incredible! You got every single question correct. You are a quiz master!";
    } else if (percentage >= 70) {
      FeedbackIcon = Sparkles;
      feedbackTitle = "Great Job!";
      feedbackColor = "text-success";
      feedbackMessage = "Excellent work! You have a solid grasp of this material. Keep it up!";
    } else if (percentage >= 40) {
      FeedbackIcon = CheckCircle;
      feedbackTitle = "Good Effort!";
      feedbackColor = "text-warning";
      feedbackMessage = "Decent score! A bit more practice and you'll master this in no time.";
    }

    // SVG parameters for circular progress
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="card score-card text-center animate-fade-in">
        {/* Results Toast */}
        {this.state.showToast && (
          <div className="toast animate-slide-up">
            <span className="toast-content">{this.state.toastMessage}</span>
          </div>
        )}

        <div className="score-header">
          <FeedbackIcon className={`feedback-icon ${feedbackColor}`} size={48} />
          <h2 className="score-title">{feedbackTitle}</h2>
          <p className="score-subtitle">{feedbackMessage}</p>
        </div>

        {/* Circular Progress Gauge */}
        <div className="radial-progress-container">
          <svg className="radial-progress-svg" viewBox="0 0 120 120">
            <circle
              className="radial-progress-bg"
              cx="60"
              cy="60"
              r={radius}
            />
            <circle
              className="radial-progress-fill"
              cx="60"
              cy="60"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
            />
          </svg>
          <div className="radial-progress-text">
            <span className="score-percentage">{percentage}%</span>
            <span className="score-ratio">{score} / {totalQuestions} Correct</span>
          </div>
        </div>

        {/* Actions */}
        <div className="actions-container">
          <button 
            className="btn btn-primary btn-icon flex items-center justify-center gap-2"
            onClick={onReplay}
          >
            <RotateCcw size={18} />
            <span>Play Again</span>
          </button>
          <button 
            className="btn btn-outline btn-icon flex items-center justify-center gap-2"
            onClick={this.handleShare}
          >
            <Share2 size={18} />
            <span>Share Result</span>
          </button>
        </div>
      </div>
    );
  }
}

export default Score;
