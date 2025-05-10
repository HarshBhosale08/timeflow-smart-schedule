
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="h-8 w-8" />
              <span className="ml-2 text-2xl font-bold">Smart Scheduler</span>
            </div>
            <div>
              {user ? (
                <Link to="/dashboard">
                  <Button className="bg-white text-primary hover:bg-gray-100">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="space-x-2">
                  <Link to="/login">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-white text-primary hover:bg-gray-100">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Smart Appointment Scheduling Made Simple
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Streamline your booking process with our AI-powered scheduling system.
              Save time and reduce no-shows with automated reminders.
            </p>
            <div className="space-x-4">
              <Link to="/register">
                <Button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-6 py-3 text-lg">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-1 opacity-90">
              <div className="bg-primary bg-opacity-10 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="ml-2 font-medium">Next Appointment</span>
                  </div>
                  <span className="text-sm bg-primary text-white px-2 py-1 rounded-full">Confirmed</span>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-lg">Design Consultation</div>
                  <div className="text-gray-600">with Sarah Provider</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Tomorrow, 2:00 PM - 3:00 PM</span>
                  </div>
                </div>
                <Button className="w-full mt-4">View Details</Button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <span>AI suggested this time based on your preferences</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Scheduling That Works For Everyone</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent scheduling system adapts to your needs whether you're a customer, 
              service provider, or administrator.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg transform transition-all duration-300 hover:-translate-y-2">
              <CardContent className="pt-8">
                <div className="rounded-full bg-primary bg-opacity-10 p-3 w-12 h-12 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Customers</h3>
                <p className="text-gray-600 mb-4">
                  Easily book appointments with your preferred service providers. 
                  Receive smart time suggestions based on your history and preferences.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="bg-green-100 p-1 rounded-full mr-2">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm">Quick and easy booking</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-100 p-1 rounded-full mr-2">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm">AI-suggested appointment times</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-100 p-1 rounded-full mr-2">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm">Automatic email reminders</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg transform transition-all duration-300 hover:-translate-y-2">
              <CardContent className="pt-8">
                <div className="rounded-full bg-primary bg-opacity-10 p-3 w-12 h-12 flex items-center justify-center mb-6">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Service Providers</h3>
                <p className="text-gray-600 mb-4">
                  Manage your schedule efficiently with a comprehensive 
                  view of all your appointments and customer details.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="bg-green-100 p-1 rounded-full mr-2">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm">Complete calendar management</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-100 p-1 rounded-full mr-2">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm">Set your availability preferences</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-100 p-1 rounded-full mr-2">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm">Approve or decline requests</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg transform transition-all duration-300 hover:-translate-y-2">
              <CardContent className="pt-8">
                <div className="rounded-full bg-primary bg-opacity-10 p-3 w-12 h-12 flex items-center justify-center mb-6">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">For Administrators</h3>
                <p className="text-gray-600 mb-4">
                  Gain complete oversight of the scheduling system with 
                  powerful tools to manage users and monitor performance.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="bg-green-100 p-1 rounded-full mr-2">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm">Comprehensive analytics dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-100 p-1 rounded-full mr-2">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm">User management tools</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-100 p-1 rounded-full mr-2">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm">System settings configuration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your scheduling?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of businesses and professionals who trust Smart Scheduler
            to manage their appointments efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg w-full sm:w-auto">
                Log In
              </Button>
            </Link>
          </div>
          <div className="mt-8 text-sm opacity-75">
            No credit card required. Free for personal use.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="ml-2 text-xl font-bold text-white">Smart Scheduler</span>
              </div>
              <p className="text-sm">
                Intelligent appointment scheduling for businesses and professionals.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>© 2025 Smart Scheduler. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
