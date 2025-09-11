import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle, Users, Clock, Target, Footprints, Zap, ArrowLeftRight, Triangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TennisFootwork = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // SEO meta tags
    document.title = "Tennis Footwork Drills | Improve Court Speed & Agility";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn tennis footwork drills including split-step and movement techniques to boost speed, agility, and positioning.');
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Tennis Footwork Drills | Improve Court Speed & Agility');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Learn tennis footwork drills including split-step and movement techniques to boost speed, agility, and positioning.');
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

  const drills = [
    {
      name: "Cone Agility Drill",
      description: "Quick direction changes around cones to improve lateral movement and acceleration.",
      benefit: "Enhances court coverage & reaction speed",
      icon: <Triangle className="h-6 w-6" />
    },
    {
      name: "Side-to-Side Baseline", 
      description: "Sprint touches from sideline to sideline along the baseline for endurance.",
      benefit: "Builds stamina & lateral speed",
      icon: <ArrowLeftRight className="h-6 w-6" />
    },
    {
      name: "Crossover Steps Drill",
      description: "Practice crossover footwork for wide shots and court positioning.",
      benefit: "Improves reach & balance for wide shots", 
      icon: <Footprints className="h-6 w-6" />
    }
  ];

  const faqs = [
    {
      question: "What are the best tennis footwork drills for beginners?",
      answer: "Start with basic split-step practice and cone agility drills. These tennis footwork drills help develop fundamental movement patterns and court awareness essential for all skill levels."
    },
    {
      question: "How to improve tennis footwork quickly and effectively?",
      answer: "Focus on how to improve tennis footwork through consistent daily practice of split-step timing, lateral movements, and recovery steps. Dedicate 15-20 minutes to tennis footwork drills before every practice session."
    },
    {
      question: "What is tennis split-step footwork and why is it important?",
      answer: "Tennis split-step footwork is a small hop performed just before your opponent hits the ball, loading your muscles for explosive movement. This fundamental technique is crucial for all tennis footwork drills and competitive play."
    },
    {
      question: "How often should I practice tennis footwork drills?",
      answer: "Practice tennis footwork drills 4-5 times per week for optimal improvement. Consistency with these exercises will significantly enhance your court movement and positioning."
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
              Tennis Footwork Drills to Improve Court Speed & Agility
            </h1>
            <p className="text-xl text-muted-foreground">
              Master Movement for Competitive Tennis
            </p>
          </div>
        </div>

        {/* Intro Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border shadow-lg">
          <div className="mb-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mastering tennis footwork drills is fundamental to competitive success on the court. 
              These proven exercises will enhance your speed, agility, and positioning, giving you the edge needed to reach every shot with confidence and power.
            </p>
          </div>
        </div>

        {/* Why Tennis Footwork is Essential */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Why Tennis Footwork is Essential</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Elite tennis performance depends on superior footwork. Every shot in tennis begins with proper positioning, 
            and your ability to move efficiently determines whether you're in control of the point or scrambling to stay in the rally.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-success/10 rounded-lg p-4 border border-success/20">
              <CheckCircle className="h-6 w-6 text-success mb-2" />
              <p className="text-sm font-medium text-success">Reach more shots with balance</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <Target className="h-6 w-6 text-primary mb-2" />
              <p className="text-sm font-medium text-primary">Generate more power from stable base</p>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
              <Clock className="h-6 w-6 text-warning mb-2" />
              <p className="text-sm font-medium text-warning">Recover faster between shots</p>
            </div>
          </div>
        </div>

        {/* Split-Step & Court Coverage */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Split-Step & Court Coverage</h2>
          <div className="flex items-start gap-4 mb-6">
            <div className="text-primary">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Tennis split-step footwork is the foundation of reactive movement. This technique involves a small hop performed just as your opponent makes contact with the ball, 
                loading your muscles for explosive movement in any direction across the court.
              </p>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">Perfect Split-Step Technique:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Time the hop with opponent's racket contact</li>
                  <li>• Land on balls of feet with knees slightly bent</li>
                  <li>• Keep feet shoulder-width apart for balance</li>
                  <li>• Immediately push off in the direction of the ball</li>
                  <li>• Practice the timing until it becomes automatic</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-success/10 rounded-md p-4 border border-success/20">
            <p className="text-sm font-medium text-success">
              <span className="font-semibold">Court Coverage Benefit:</span> Reduces reaction time by 0.2-0.3 seconds, often the difference between reaching a shot or not
            </p>
          </div>
        </div>

        {/* How to Improve Tennis Footwork */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">How to Improve Tennis Footwork</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Master the Fundamentals</h3>
                <p className="text-muted-foreground">Start with proper stance, weight distribution, and basic movement patterns before advancing to complex drills.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Practice Movement Without the Ball</h3>
                <p className="text-muted-foreground">Shadow drills allow you to focus purely on footwork technique and develop muscle memory.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Incorporate Speed and Agility Training</h3>
                <p className="text-muted-foreground">Use ladder drills, cone work, and plyometric exercises to build explosive movement capability.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specific Drills */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Essential Tennis Footwork Drills</h2>
          <div className="grid md:grid-cols-1 gap-6">
            {drills.map((drill, index) => (
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
            "Champions are made with perfect footwork."
          </blockquote>
          <p className="text-muted-foreground">
            Dedicate yourself to these tennis footwork drills, and transform your game from the ground up.
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
              onClick={() => navigate('/pickleball')}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Pickleball Footwork Drills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TennisFootwork;