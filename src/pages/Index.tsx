
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Check, ArrowRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Index: React.FC = () => {
  const { user } = useAuth();
  
  const features = [
    {
      title: "Smart Scheduling",
      description: "Our AI-powered system helps find the perfect time for your appointments.",
      icon: <Calendar className="h-8 w-8 text-primary" />
    },
    {
      title: "Efficient Time Management",
      description: "Save time with automated appointment bookings and reminders.",
      icon: <Clock className="h-8 w-8 text-primary" />
    },
    {
      title: "Seamless Experience",
      description: "Enjoy a hassle-free booking process for both providers and customers.",
      icon: <Check className="h-8 w-8 text-primary" />
    }
  ];

  const testimonials = [
    {
      quote: "This scheduling system has completely transformed how I manage my appointments!",
      author: "Sarah Johnson",
      role: "Fitness Instructor"
    },
    {
      quote: "The AI recommendations consistently find times that work perfectly with my schedule.",
      author: "Michael Chen",
      role: "Business Consultant"
    },
    {
      quote: "Setting my availability took minutes, and now clients book themselves in. Amazing!",
      author: "Emma Rodriguez",
      role: "Therapist"
    }
  ];

  return (
    <Layout>
      {/* Hero section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-primary/5 to-background rounded-b-3xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Smart Appointment Scheduling
                <span className="text-primary block mt-2">Made Simple</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Schedule appointments effortlessly with our AI-powered system that optimizes time for both providers and customers.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="px-8">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="px-8">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="px-8">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur-lg opacity-30"></div>
                <div className="relative bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xl">
                  <AspectRatio ratio={16/10}>
                    <div className="rounded-md overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                        alt="Calendar scheduling" 
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </AspectRatio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Scheduling Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to streamline your appointment booking process.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. See what our users have experienced.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="pt-6">
                  <div className="mb-4 text-primary">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="mb-4 italic">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 container mx-auto px-4">
        <div className="bg-primary rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your scheduling?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied users who have transformed their appointment booking process.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="px-8">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="px-8">
                    Create an Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
