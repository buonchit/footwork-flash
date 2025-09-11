import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle, Users, Clock, Target, Footprints, Zap, ArrowLeftRight, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PickleballFootwork = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // SEO meta tags
    document.title = "Pickleball Footwork Drills | Improve Balance & Agility";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Simple pickleball footwork drills including split-step and multi-directional movement to improve balance and reaction time.');
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Pickleball Footwork Drills | Improve Balance & Agility');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Simple pickleball footwork drills including split-step and multi-directional movement to improve balance and reaction time.');
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

  const faqs = [
    {
      question: "What are the best pickleball footwork drills for beginners?",
      answer: "Start with basic pickleball split-step drill and lateral shuffles. These pickleball footwork drills are foundational and help develop proper movement patterns and court awareness."
    },
    {
      question: "How does the pickleball split-step drill improve my game?",
      answer: "The pickleball split-step drill enhances your reaction time and helps you move quickly in any direction. This fundamental drill is essential for effective court positioning and balance."
    },
    {
      question: "What is multi-directional footwork pickleball training?",
      answer: "Multi-directional footwork pickleball training involves practicing movements in all directions - forward, backward, and lateral. This comprehensive approach improves overall court coverage and agility."
    },
    {
      question: "How often should I practice pickleball footwork drills?",
      answer: "Practice pickleball footwork drills 3-4 times per week for best results. Even 10-15 minutes of focused footwork training can significantly improve your court movement and balance."
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
              Pickleball Footwork Drills to Improve Balance & Agility
            </h1>
            <p className="text-xl text-muted-foreground">
              Master Movement for Better Court Control
            </p>
          </div>
        </div>

        {/* Intro Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border shadow-lg">
          <div className="mb-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Effective pickleball footwork drills are the foundation of competitive play. 
              These simple yet powerful exercises will enhance your balance, agility, and reaction time, 
              helping you control the court and respond quickly to every shot.
            </p>
          </div>
        </div>

        {/* Why Footwork is Critical */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Why Footwork is Critical in Pickleball</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Pickleball's unique court size and gameplay style demand precise footwork. Unlike other racket sports, 
            pickleball requires quick adjustments in tight spaces, making efficient movement patterns essential for success.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-success/10 rounded-lg p-4 border border-success/20">
              <CheckCircle className="h-6 w-6 text-success mb-2" />
              <p className="text-sm font-medium text-success">Better positioning at the net</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <Target className="h-6 w-6 text-primary mb-2" />
              <p className="text-sm font-medium text-primary">Quicker reaction to dinks and drives</p>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
              <Clock className="h-6 w-6 text-warning mb-2" />
              <p className="text-sm font-medium text-warning">Improved balance for volleys</p>
            </div>
          </div>
        </div>

        {/* Core Techniques */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Core Techniques Every Pickleball Player Needs</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Prep-Step</h3>
                <p className="text-muted-foreground">Small adjustment steps to get into optimal position for each shot.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Split-Step</h3>
                <p className="text-muted-foreground">Ready position jump to prepare for explosive movement in any direction.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Lateral Shuffle</h3>
                <p className="text-muted-foreground">Side-to-side movement while maintaining balance and court position.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Split-Step Drill Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Pickleball Split-Step Drill</h2>
          <div className="flex items-start gap-4 mb-6">
            <div className="text-primary">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                The pickleball split-step drill is fundamental for developing explosive movement and proper timing. 
                This technique involves a small hop performed just as your opponent makes contact, loading your muscles for instant directional change.
              </p>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">Split-Step Drill Progression:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Start in ready position at the baseline</li>
                  <li>• Watch for opponent's paddle contact</li>
                  <li>• Perform small hop, landing on balls of feet</li>
                  <li>• Immediately move toward the ball's direction</li>
                  <li>• Practice timing until it becomes automatic</li>
                  <li>• Gradually increase movement speed and distance</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-success/10 rounded-md p-4 border border-success/20">
            <p className="text-sm font-medium text-success">
              <span className="font-semibold">Training Benefit:</span> Reduces reaction time and improves first-step quickness by 25-30%
            </p>
          </div>
        </div>

        {/* Multi-Directional Footwork Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Multi-Directional Footwork Pickleball Drill</h2>
          <div className="flex items-start gap-4 mb-6">
            <div className="text-primary">
              <RotateCw className="h-8 w-8" />
            </div>
            <div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Multi-directional footwork pickleball training develops comprehensive court coverage. 
                This drill improves your ability to move efficiently in all directions while maintaining balance and readiness for the next shot.
              </p>
              <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
                <h3 className="font-semibold text-warning mb-2">Multi-Directional Drill Setup:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Place 4 cones in a square pattern (6 feet apart)</li>
                  <li>• Start in center, facing forward</li>
                  <li>• Move to each cone using proper footwork</li>
                  <li>• Forward: Quick steps, stay low</li>
                  <li>• Backward: Cross-over steps, maintain balance</li>
                  <li>• Lateral: Shuffle steps, don't cross feet</li>
                  <li>• Return to center after each movement</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-success/10 rounded-md p-4 border border-success/20">
            <p className="text-sm font-medium text-success">
              <span className="font-semibold">Performance Benefit:</span> Enhances court coverage, balance, and movement efficiency in all directions
            </p>
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
            "Great pickleball starts with great footwork."
          </blockquote>
          <p className="text-muted-foreground">
            Master these pickleball footwork drills, and elevate your game to new heights.
          </p>
        </div>

        {/* Footer Links */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 text-center">
            Explore More Footwork Training
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/badminton')}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Badminton Footwork Drills
            </button>
            <span className="text-muted-foreground">|</span>
            <button 
              onClick={() => navigate('/table-tennis')}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Table Tennis Footwork Drills
            </button>
            <span className="text-muted-foreground">|</span>
            <button 
              onClick={() => navigate('/tennis')}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Tennis Footwork Drills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickleballFootwork;