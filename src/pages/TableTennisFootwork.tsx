import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle, Users, Clock, Target, Footprints, Zap, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TableTennisFootwork = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // SEO meta tags
    document.title = "Table Tennis Footwork Drills | Improve Speed & Consistency";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Practical table tennis footwork drills to improve movement, positioning, and balance for better rallies.');
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Table Tennis Footwork Drills | Improve Speed & Consistency');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Practical table tennis footwork drills to improve movement, positioning, and balance for better rallies.');
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
      name: "Falkenberg Drill",
      description: "Rapid forehand and backhand alternation to develop quick lateral movement.",
      benefit: "Improves reaction time & footwork coordination",
      icon: <ArrowLeftRight className="h-6 w-6" />
    },
    {
      name: "Forehand/Backhand Shuffle", 
      description: "Practice side-to-side movement with proper stance adjustments.",
      benefit: "Builds lateral agility & balance",
      icon: <Users className="h-6 w-6" />
    },
    {
      name: "Shadow Drill Practice",
      description: "Practice footwork movements without the ball to focus on technique.",
      benefit: "Enhances muscle memory & movement precision", 
      icon: <Footprints className="h-6 w-6" />
    }
  ];

  const faqs = [
    {
      question: "What are the most effective table tennis footwork drills for beginners?",
      answer: "Shadow drill practice is ideal for beginners as it allows you to focus purely on table tennis footwork movement without worrying about ball placement. Start with basic side-to-side shuffles."
    },
    {
      question: "How to improve footwork in table tennis quickly?",
      answer: "Focus on small, quick steps rather than large movements. Practice table tennis footwork drills daily for 15-20 minutes, emphasizing proper weight transfer and balance recovery."
    },
    {
      question: "How often should I practice table tennis footwork drills?",
      answer: "For noticeable improvement, practice table tennis footwork movement exercises 4-5 times per week. Consistency is more important than duration."
    },
    {
      question: "What is the correct stance for table tennis footwork?",
      answer: "Maintain a slightly crouched position with feet shoulder-width apart, weight on the balls of your feet, and knees slightly bent for quick directional changes during table tennis footwork drills."
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
              Table Tennis Footwork Drills to Improve Speed & Consistency
            </h1>
            <p className="text-xl text-muted-foreground">
              Master Movement for Better Rallies
            </p>
          </div>
        </div>

        {/* Intro Section */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border shadow-lg">
          <div className="mb-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Effective table tennis footwork drills are essential for developing the quick, precise movements needed for competitive play. 
              These proven exercises will help you improve positioning, balance, and reaction time, leading to more consistent and powerful shots.
            </p>
          </div>
        </div>

        {/* Why Footwork is Key */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Why Footwork is Key in Table Tennis</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            In table tennis, superior footwork makes the difference between reaching shots comfortably versus being caught off-balance. 
            Good footwork enables you to maintain optimal position for both attacking and defensive shots.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-success/10 rounded-lg p-4 border border-success/20">
              <CheckCircle className="h-6 w-6 text-success mb-2" />
              <p className="text-sm font-medium text-success">Better positioning for power shots</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <Target className="h-6 w-6 text-primary mb-2" />
              <p className="text-sm font-medium text-primary">Faster recovery between strokes</p>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
              <Clock className="h-6 w-6 text-warning mb-2" />
              <p className="text-sm font-medium text-warning">Improved balance and stability</p>
            </div>
          </div>
        </div>

        {/* Core Movements */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Core Movements Every Player Must Master</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Side-to-Side Movement</h3>
                <p className="text-muted-foreground">Quick lateral shuffles to cover the table width efficiently.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Recovery Steps</h3>
                <p className="text-muted-foreground">Return to ready position after each shot for optimal balance.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Adjustment Steps</h3>
                <p className="text-muted-foreground">Fine-tune position with small, precise movements for optimal stroke execution.</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Improve Footwork */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">How to Improve Footwork in Table Tennis</h2>
          <div className="flex items-start gap-4 mb-6">
            <div className="text-primary">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Learning how to improve footwork in table tennis requires consistent practice of specific movement patterns. 
                Focus on developing quick, efficient steps rather than large movements that can throw off your balance.
              </p>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">Key Principles for Improvement:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Keep steps small and controlled</li>
                  <li>• Maintain low center of gravity</li>
                  <li>• Practice weight transfer between feet</li>
                  <li>• Always return to ready position</li>
                  <li>• Focus on rhythm and timing</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-success/10 rounded-md p-4 border border-success/20">
            <p className="text-sm font-medium text-success">
              <span className="font-semibold">Pro Tip:</span> Practice footwork without the ball first to master the movement patterns
            </p>
          </div>
        </div>

        {/* Specific Drills */}
        <div className="bg-card rounded-2xl p-8 mb-8 border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Essential Table Tennis Footwork Drills</h2>
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
            "Perfect footwork creates perfect opportunities."
          </blockquote>
          <p className="text-muted-foreground">
            Master your table tennis footwork drills, and watch your consistency soar.
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableTennisFootwork;