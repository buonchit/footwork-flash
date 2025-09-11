import React from 'react';
import { ArrowLeft, CheckCircle, Users, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BadmintonFootwork = () => {
  const navigate = useNavigate();

  const drills = [
    {
      name: "Shadow Footwork Drill",
      description: "Practice movement patterns without a shuttle. Focus on technique, rhythm, and breathing.",
      benefit: "Improves muscle memory & endurance",
      icon: <Target className="h-6 w-6" />
    },
    {
      name: "6-Point Drill", 
      description: "Move to all six corners of the court in sequence, returning to center after each.",
      benefit: "Builds agility & full-court coverage",
      icon: <Users className="h-6 w-6" />
    },
    {
      name: "Figure-8 Drill",
      description: "Perform continuous figure-8 movements around two markers.",
      benefit: "Enhances foot speed & coordination", 
      icon: <Clock className="h-6 w-6" />
    },
    {
      name: "Agility Ladder Drill",
      description: "Step quickly through a ladder pattern.",
      benefit: "Increases reaction speed & explosive movement",
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  const faqs = [
    {
      question: "What is the best badminton footwork drill for beginners?",
      answer: "The shadow footwork drill is perfect for beginners because it focuses on movement patterns without needing a shuttle."
    },
    {
      question: "How often should I practice badminton footwork drills?",
      answer: "For steady improvement, 3–4 sessions per week is ideal."
    },
    {
      question: "What is the split-step in badminton?",
      answer: "The split-step is a small jump before your opponent hits the shuttle, preparing you to move instantly in any direction."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Training
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              Badminton Footwork Drills
            </h1>
            <p className="text-xl text-muted-foreground">
              Improve Speed, Agility & Court Coverage
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Master Your Movement, Dominate the Court
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mastering badminton footwork is the fastest way to raise your game. 
              With the right drills, you'll move quicker, recover faster, and dominate the court.
              These proven badminton footwork drills are designed for players who want to improve speed, agility, and endurance.
            </p>
          </div>
        </div>

        {/* Why Footwork is Essential */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h3 className="text-2xl font-bold text-card-foreground mb-6">Why Badminton Footwork is Essential</h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Good strokes mean little without strong footwork. The ability to get into the right position—on time and with balance—defines who controls the rally.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-success/10 rounded-lg p-4 border border-success/20">
              <CheckCircle className="h-6 w-6 text-success mb-2" />
              <p className="text-sm font-medium text-success">React faster to smashes and drop shots</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <Target className="h-6 w-6 text-primary mb-2" />
              <p className="text-sm font-medium text-primary">Conserve energy with efficient movement</p>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
              <Users className="h-6 w-6 text-warning mb-2" />
              <p className="text-sm font-medium text-warning">Maintain balance for powerful strokes</p>
            </div>
          </div>
        </div>

        {/* Key Techniques */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h3 className="text-2xl font-bold text-card-foreground mb-6">3 Key Footwork Techniques Every Player Must Master</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold text-card-foreground">Split-Step Timing</h4>
                <p className="text-muted-foreground">Stay ready with quick mini-jumps before every shot.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold text-card-foreground">Corner-to-Corner Movement</h4>
                <p className="text-muted-foreground">Cover the full court without wasted steps.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold text-card-foreground">Recovery and Balance</h4>
                <p className="text-muted-foreground">Always return to a neutral stance after hitting.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Drills */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h3 className="text-2xl font-bold text-card-foreground mb-6">Badminton Footwork Drills for Training</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {drills.map((drill, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-primary">
                    {drill.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-card-foreground">{drill.name}</h4>
                </div>
                <p className="text-muted-foreground mb-3">{drill.description}</p>
                <div className="bg-success/10 rounded-md p-3 border border-success/20">
                  <p className="text-sm font-medium text-success">
                    <span className="font-semibold">Benefit:</span> {drill.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h3 className="text-2xl font-bold text-card-foreground mb-6">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border pb-4 last:border-b-0">
                <h4 className="text-lg font-semibold text-card-foreground mb-2">{faq.question}</h4>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Note */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center border border-primary/20">
          <blockquote className="text-2xl font-bold text-primary mb-4">
            "Great players are built from great footwork."
          </blockquote>
          <p className="text-muted-foreground">
            Commit to your movement, and your game will never be the same.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BadmintonFootwork;