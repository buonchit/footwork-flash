import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Settings, Eye, Trophy, ArrowRight, Users } from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // SEO meta tags
    document.title = "How It Works - Step-by-Step Guide | Master Footwork";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Learn how to use our footwork training app step-by-step. Master racket sports footwork with our comprehensive training guide for badminton, tennis, pickleball, and table tennis.");
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = "Master Footwork";
      if (metaDescription) {
        metaDescription.setAttribute("content", "");
      }
    };
  }, []);

  const steps = [
    {
      icon: Play,
      title: "Start the App",
      description: "Press the Start button to begin your footwork training session. The app will immediately start showing you movement patterns on the virtual court."
    },
    {
      icon: Settings,
      title: "Customize Timing or Settings",
      description: "Adjust the delay between movements and overall session duration using the slider controls. Choose from different training modes to match your skill level."
    },
    {
      icon: Eye,
      title: "Follow the Drills on Screen",
      description: "Watch the highlighted positions on the court and move accordingly. The app displays numbered positions and movement patterns that you should follow step by step."
    },
    {
      icon: Trophy,
      title: "Track Progress",
      description: "Monitor your score and total moves completed during each session. The app tracks your performance to help you measure improvement over time."
    }
  ];

  const sports = [
    { name: "Badminton", path: "/badminton", description: "Master fast-paced badminton footwork patterns" },
    { name: "Tennis", path: "/tennis", description: "Improve court coverage and positioning in tennis" },
    { name: "Pickleball", path: "/pickleball", description: "Perfect your pickleball split-step and agility" },
    { name: "Table Tennis", path: "/table-tennis", description: "Enhance quick lateral movements for table tennis" },
    { name: "Multi-Sport Hub", path: "/multi-sport", description: "Access all racket sports training in one place" }
  ];

  const faqs = [
    {
      question: "How do I use this website to practice footwork?",
      answer: "Simply select your sport, press Start, and follow the highlighted positions on the virtual court. The app guides you through each movement pattern step-by-step."
    },
    {
      question: "Do I need equipment to follow these drills?",
      answer: "No equipment needed! You can practice these footwork drills in any open space. Just follow the on-screen patterns and move your feet accordingly."
    },
    {
      question: "Can I use this app for tennis, badminton, pickleball, and table tennis?",
      answer: "Absolutely! Our app supports dedicated footwork training for badminton, tennis, pickleball, and table tennis, each with sport-specific movement patterns."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works – Step-by-Step Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Learn how to use our comprehensive footwork training app to improve your performance across all racket sports. 
            This step-by-step guide will help you maximize your training sessions and track your progress effectively.
          </p>
        </header>

        {/* Steps Section */}
        <section className="mb-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Step {index + 1}</CardTitle>
                  <CardTitle className="text-lg font-medium">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Explore More Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Explore More</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dive deeper into sport-specific footwork training with our dedicated pages for each racket sport.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sports.map((sport, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(sport.path)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {sport.name}
                    <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription>{sport.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-left">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Closing Section */}
        <section className="text-center bg-primary/5 rounded-lg p-8">
          <div className="max-w-2xl mx-auto">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Start Training?</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Now that you know how it works, jump into your first footwork session and feel the difference. 
              Consistent practice with our guided drills will transform your court movement and reaction time.
            </p>
            <Button 
              onClick={() => navigate("/")} 
              size="lg"
              className="font-semibold"
            >
              Start Training Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;