import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle, Users, Clock, Target, Footprints, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BadmintonFootwork = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // SEO meta tags
    document.title = "Badminton Footwork Drills | Improve Speed & Agility";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Step-by-step badminton footwork drills, including shadow training and split-step exercises to boost speed and agility.');
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Badminton Footwork Drills | Improve Speed & Agility');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Step-by-step badminton footwork drills, including shadow training and split-step exercises to boost speed and agility.');
    }

    return () => {
      // Reset to default on unmount
      document.title = "Master Footwork v5.8 - Badminton Training App";
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Master your badminton footwork with interactive training sessions, randomized positions, and real-time feedback. Perfect for singles court practice.');
      }
      if (ogTitle) {
        ogTitle.setAttribute('content', 'Master Footwork v5.8 - Badminton Training App');
      }
      if (ogDescription) {
        ogDescription.setAttribute('content', 'Interactive badminton footwork training with customizable modes and instant feedback');
      }
    };
  }, []);

  const otherDrills = [
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
      question: "What are the best badminton footwork drills for beginners?",
      answer: "The shadow footwork drill is perfect for beginners because it focuses on movement patterns without needing a shuttle. Start with basic badminton footwork drills to build a foundation."
    },
    {
      question: "How often should I practice badminton footwork drills?",
      answer: "For steady improvement, practice badminton footwork drills 3–4 sessions per week. Consistency is key to mastering proper footwork techniques."
    },
    {
      question: "What is badminton split-step training?",
      answer: "Badminton split-step training involves a small jump before your opponent hits the shuttle, preparing you to move instantly in any direction. This fundamental technique is essential for all badminton footwork drills."
    },
    {
      question: "Can shadow footwork badminton training be done at home?",
      answer: "Yes, shadow footwork badminton training is ideal for home practice as it requires no equipment. Focus on proper form and movement patterns during your shadow footwork sessions."
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

        {/* Intro Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border shadow-lg">
          <div className="mb-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mastering badminton footwork drills is the fastest way to raise your game. 
              With the right training techniques, you'll move quicker, recover faster, and dominate the court.
              These proven exercises are designed for players who want to improve speed, agility, and endurance through structured practice.
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
          <h2 className="text-2xl font-bold text-card-foreground mb-6">3 Key Techniques Every Player Must Master</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Split-Step Timing</h3>
                <p className="text-muted-foreground">Stay ready with quick mini-jumps before every shot.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Corner-to-Corner Movement</h3>
                <p className="text-muted-foreground">Cover the full court without wasted steps.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Recovery and Balance</h3>
                <p className="text-muted-foreground">Always return to a neutral stance after hitting.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shadow Footwork Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Shadow Footwork Badminton Drill</h2>
          <div className="flex items-start gap-4 mb-6">
            <div className="text-primary">
              <Footprints className="h-8 w-8" />
            </div>
            <div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Shadow footwork badminton training is the cornerstone of movement improvement. Practice movement patterns without a shuttle, focusing entirely on technique, rhythm, and breathing. This drill builds muscle memory and forms the foundation for all other footwork exercises.
              </p>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">How to Practice Shadow Footwork:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Start in the center of the court</li>
                  <li>• Move to each corner using proper footwork</li>
                  <li>• Focus on split-step timing and recovery</li>
                  <li>• Practice for 10-15 minutes per session</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-success/10 rounded-md p-4 border border-success/20">
            <p className="text-sm font-medium text-success">
              <span className="font-semibold">Benefit:</span> Improves muscle memory, endurance, and movement precision without equipment
            </p>
          </div>
        </div>

        {/* Split-Step Training Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Badminton Split-Step Training</h2>
          <div className="flex items-start gap-4 mb-6">
            <div className="text-primary">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Badminton split-step training is essential for reactive movement. This fundamental technique involves a small jump just before your opponent hits the shuttle, loading your muscles and preparing for explosive movement in any direction.
              </p>
              <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
                <h3 className="font-semibold text-warning mb-2">Split-Step Training Steps:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Time the jump with opponent's racket contact</li>
                  <li>• Land on balls of feet, knees slightly bent</li>
                  <li>• Keep feet shoulder-width apart</li>
                  <li>• React immediately after landing</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-success/10 rounded-md p-4 border border-success/20">
            <p className="text-sm font-medium text-success">
              <span className="font-semibold">Benefit:</span> Reduces reaction time and enables faster directional changes
            </p>
          </div>
        </div>

        {/* Additional Training Drills */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Additional Badminton Footwork Drills</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {otherDrills.map((drill, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-primary">
                    {drill.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">{drill.name}</h3>
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
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border pb-4 last:border-b-0">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Note */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center border border-primary/20 mb-8">
          <blockquote className="text-2xl font-bold text-primary mb-4">
            "Great players are built from great footwork."
          </blockquote>
          <p className="text-muted-foreground">
            Commit to your movement, and your game will never be the same.
          </p>
        </div>

        {/* Footer Links */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 text-center">
            Explore More Footwork Training
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/tennis')}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Tennis Footwork Drills
            </button>
            <span className="text-muted-foreground">|</span>
            <button 
              onClick={() => navigate('/pickleball')}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Pickleball Footwork Drills
            </button>
            <span className="text-muted-foreground">|</span>
            <button 
              onClick={() => navigate('/table-tennis')}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Table Tennis Footwork Drills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadmintonFootwork;