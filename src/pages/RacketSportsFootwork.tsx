import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle, Users, Clock, Target, Footprints, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RacketSportsFootwork = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // SEO meta tags
    document.title = "Racket Sports Footwork Drills | Badminton, Tennis, Pickleball, Table Tennis";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Comprehensive racket sports footwork training hub. Learn drills for badminton, tennis, pickleball, and table tennis.');
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Racket Sports Footwork Drills | Badminton, Tennis, Pickleball, Table Tennis');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Comprehensive racket sports footwork training hub. Learn drills for badminton, tennis, pickleball, and table tennis.');
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

  const sports = [
    {
      name: "Badminton",
      description: "Master explosive movement and court coverage with specialized badminton footwork techniques.",
      highlights: ["Shadow footwork training", "Split-step timing", "6-point agility drills"],
      route: "/badminton",
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
      icon: <Target className="h-6 w-6" />
    },
    {
      name: "Tennis",
      description: "Develop powerful court positioning and speed with professional tennis footwork drills.",
      highlights: ["Cone agility patterns", "Baseline movement", "Crossover techniques"],
      route: "/tennis",
      color: "bg-green-500/10 border-green-500/20 text-green-600",
      icon: <Zap className="h-6 w-6" />
    },
    {
      name: "Pickleball",
      description: "Enhance balance and quick reactions with pickleball-specific movement patterns.",
      highlights: ["Multi-directional drills", "Net positioning", "Lateral shuffles"],
      route: "/pickleball",
      color: "bg-purple-500/10 border-purple-500/20 text-purple-600",
      icon: <Users className="h-6 w-6" />
    },
    {
      name: "Table Tennis",
      description: "Perfect rapid-fire footwork and positioning for competitive table tennis play.",
      highlights: ["Falkenberg drill", "Shuffle techniques", "Shadow practice"],
      route: "/table-tennis",
      color: "bg-orange-500/10 border-orange-500/20 text-orange-600",
      icon: <Clock className="h-6 w-6" />
    }
  ];

  const faqs = [
    {
      question: "What are racket sports footwork drills and why are they important?",
      answer: "Racket sports footwork drills are specialized movement exercises designed to improve agility, balance, and positioning across badminton, tennis, pickleball, and table tennis. These drills are crucial for developing sport-specific movement patterns."
    },
    {
      question: "How can I improve footwork for racket sports efficiently?",
      answer: "To improve footwork for racket sports, focus on fundamental movements like split-steps, lateral shuffles, and recovery steps that apply across all racket sports. Practice sport-specific drills 3-4 times per week for optimal results."
    },
    {
      question: "Is footwork training for multiple racket sports beneficial?",
      answer: "Yes, footwork training for multiple racket sports is highly beneficial as it develops versatile movement skills, improves overall athleticism, and creates transferable techniques that enhance performance across different sports."
    },
    {
      question: "Which racket sport has the most demanding footwork requirements?",
      answer: "Each racket sport has unique footwork demands. Badminton requires explosive multi-directional movement, tennis needs powerful lateral coverage, pickleball demands quick adjustments in tight spaces, and table tennis requires rapid-fire positioning."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              Footwork Drills for Racket Sports: Badminton, Tennis, Pickleball & Table Tennis
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master Movement Across All Racket Sports
            </p>
          </div>
        </div>

        {/* Intro Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border shadow-lg">
          <div className="mb-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome to the comprehensive hub for racket sports footwork drills. Whether you're looking to improve footwork for racket sports like badminton, tennis, pickleball, or table tennis, this central resource provides specialized training techniques for each sport. Our footwork training for multiple racket sports approach helps athletes develop versatile movement skills that translate across different court surfaces and game styles.
            </p>
          </div>
        </div>

        {/* Why Footwork Matters */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Why Footwork Matters Across Racket Sports</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Superior footwork is the foundation that separates recreational players from competitive athletes in all racket sports. 
            While each sport has unique movement demands, the fundamental principles of balance, agility, and positioning remain consistent across all racket sports.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-success/10 rounded-lg p-4 border border-success/20">
              <CheckCircle className="h-6 w-6 text-success mb-2" />
              <p className="text-sm font-medium text-success">Better shot preparation and balance</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <Target className="h-6 w-6 text-primary mb-2" />
              <p className="text-sm font-medium text-primary">Faster reaction times and recovery</p>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
              <Clock className="h-6 w-6 text-warning mb-2" />
              <p className="text-sm font-medium text-warning">Improved court coverage and positioning</p>
            </div>
            <div className="bg-info/10 rounded-lg p-4 border border-info/20">
              <Footprints className="h-6 w-6 text-info mb-2" />
              <p className="text-sm font-medium text-info">Enhanced endurance and efficiency</p>
            </div>
          </div>
        </div>

        {/* Common Techniques */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Common Techniques Across All Racket Sports</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Split-Step Foundation</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                The universal ready position technique that loads muscles for explosive movement. Essential timing varies by sport but the principle remains constant across all racket sports.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-success text-success-foreground rounded-full w-10 h-10 flex items-center justify-center">
                  <Footprints className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Agility Patterns</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Multi-directional movement drills that improve change of direction speed, lateral quickness, and forward/backward mobility essential for court sports.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-warning text-warning-foreground rounded-full w-10 h-10 flex items-center justify-center">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Recovery Systems</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Efficient return-to-position techniques that maintain optimal court positioning and prepare for the next shot. Critical for sustained rallies and defensive play.
              </p>
            </div>
          </div>
        </div>

        {/* Sport-Specific Drills */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Explore Sport-Specific Drills</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sports.map((sport, index) => (
              <div key={index} className={`rounded-lg p-6 border transition-all hover:shadow-lg ${sport.color}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="opacity-70">
                    {sport.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{sport.name} Footwork</h3>
                </div>
                <p className="text-sm opacity-80 mb-4">{sport.description}</p>
                <div className="space-y-2 mb-4">
                  {sport.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs opacity-70">
                      <CheckCircle className="h-3 w-3" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate(sport.route)}
                  className="w-full flex items-center justify-center gap-2 bg-background/80 hover:bg-background text-foreground px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <span>Explore {sport.name} Drills</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
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

        {/* Closing Motivational Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center border border-primary/20">
          <blockquote className="text-2xl md:text-3xl font-bold text-primary mb-4">
            "Excellence in racket sports begins with exceptional footwork."
          </blockquote>
          <p className="text-muted-foreground text-lg mb-6">
            Choose your sport and start mastering the movement patterns that will transform your game.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <button
              onClick={() => navigate('/how-it-works')}
              className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              How It Works
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {sports.map((sport, index) => (
              <button
                key={index}
                onClick={() => navigate(sport.route)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Start {sport.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RacketSportsFootwork;