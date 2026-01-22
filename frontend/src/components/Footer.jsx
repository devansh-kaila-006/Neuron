import { Brain, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-2xl font-black tracking-tighter text-gradient">NEURON</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Neural Network of Innovation. Empowering students to explore AI, ML, and DL through hands-on learning and collaboration.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-about">
                About Us
              </Link>
              <Link to="/team" className="block text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-team">
                Our Team
              </Link>
              <Link to="/hackathon" className="block text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-hackathon">
                Hackathon
              </Link>
              <Link to="/register" className="block text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-register">
                Register Now
              </Link>
              <Link to="/admin" className="block text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-admin">
                Admin Login
              </Link>
            </div>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Connect With Us</h3>
            <div className="space-y-2">
              <a href="mailto:contact@neuronclub.edu" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-email">
                <Mail className="w-4 h-4" />
                contact@neuronclub.edu
              </a>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter" data-testid="footer-social-twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn" data-testid="footer-social-linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub" data-testid="footer-social-github">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Neuron Club. All rights reserved. Built with passion for AI & ML.
          </p>
        </div>
      </div>
    </footer>
  );
};