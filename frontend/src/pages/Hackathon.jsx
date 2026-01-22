import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Trophy, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hackathon() {
  const timeline = [
    { phase: 'Registration', date: 'Jan 15 - Feb 10', desc: 'Register your team and confirm payment' },
    { phase: 'Kickoff', date: 'Feb 15, 8:00 PM', desc: 'Opening ceremony and problem statement reveal' },
    { phase: 'Hack Time', date: 'Feb 15, 9:00 PM - Feb 16, 9:00 AM', desc: '12 hours of intense coding' },
    { phase: 'Submission', date: 'Feb 16, 9:00 AM', desc: 'Submit your projects and presentations' },
    { phase: 'Judging', date: 'Feb 16, 10:00 AM - 2:00 PM', desc: 'Expert panel reviews all submissions' },
    { phase: 'Results', date: 'Feb 16, 3:00 PM', desc: 'Winners announcement and closing ceremony' }
  ];
  
  const prizes = [
    { position: '1st Place', amount: '₹50,000', icon: Trophy, color: 'text-yellow-400' },
    { position: '2nd Place', amount: '₹30,000', icon: Award, color: 'text-gray-300' },
    { position: '3rd Place', amount: '₹20,000', icon: Award, color: 'text-orange-400' }
  ];
  
  const rules = [
    'Team size: 2-4 members',
    'All team members must be currently enrolled students',
    'Original work only - no plagiarism',
    'Use any programming language or framework',
    'Projects must incorporate AI/ML techniques',
    'Code must be submitted via GitHub',
    'Final presentation (5 minutes) is mandatory',
    'Judges\' decision is final'
  ];
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="fixed inset-0 grid-background opacity-50" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="inline-block">
                <span className="text-sm font-mono uppercase tracking-widest text-accent bg-accent/10 px-4 py-2 rounded-full border border-accent/20" data-testid="hackathon-badge">
                  Overnight Hackathon 2025
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none" data-testid="hackathon-title">
                <span className="text-gradient">12 Hours</span>
                <br />
                <span className="text-white">of Pure</span>
                <br />
                <span className="text-accent">Innovation</span>
              </h1>
              
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground" data-testid="hackathon-description">
                Push your limits, collaborate with brilliant minds, and build AI-powered solutions that matter. Join us for an unforgettable overnight coding experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" data-testid="hackathon-register-btn">
                  <Button className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-lg font-bold tracking-wide group">
                    Register Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src="https://images.pexels.com/photos/6424590/pexels-photo-6424590.jpeg"
                alt="Students coding at hackathon"
                className="relative rounded-3xl w-full h-auto border border-white/10"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Event Details */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8" data-testid="details-title">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4" data-testid="detail-duration">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Duration</h3>
                  <p className="text-muted-foreground">12 Hours Overnight<br />Feb 15, 8 PM - Feb 16, 8 AM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4" data-testid="detail-mode">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mode</h3>
                  <p className="text-muted-foreground">Hybrid<br />In-person + Virtual Participation</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4" data-testid="detail-eligibility">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
                  <p className="text-muted-foreground">College Students<br />Team Size: 2-4 Members</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Timeline */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" data-testid="timeline-title">
              Event <span className="text-gradient">Timeline</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">Mark your calendars for these important milestones</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300"
                data-testid={`timeline-item-${index}`}
              >
                <div className="text-4xl font-black text-primary/20 mb-4">{`0${index + 1}`}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.phase}</h3>
                <p className="text-sm text-accent mb-2 font-mono">{item.date}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Prizes */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" data-testid="prizes-title">
              Prizes & <span className="text-gradient">Rewards</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">Total prize pool worth ₹1,00,000</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {prizes.map((prize, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-3xl p-8 text-center space-y-6"
                data-testid={`prize-card-${index}`}
              >
                <prize.icon className={`w-16 h-16 mx-auto ${prize.color}`} />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{prize.position}</h3>
                  <p className="text-4xl font-black text-gradient">{prize.amount}</p>
                </div>
                <p className="text-sm text-muted-foreground">+ Certificates & Goodies</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Rules */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8" data-testid="rules-title">
              Rules & <span className="text-gradient">Code of Conduct</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-3" data-testid={`rule-item-${index}`}>
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">{rule}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-muted-foreground">
                Registration fee: <span className="text-white font-semibold">₹500 per team</span> (covers refreshments, swag, and event logistics)
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="cta-title">
                Ready to <span className="text-gradient">Compete?</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Secure your spot now. Limited teams only!
              </p>
              
              <div className="pt-4">
                <Link to="/register" data-testid="cta-register-btn">
                  <Button className="bg-accent hover:bg-accent/90 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-lg font-bold tracking-wide group">
                    Register Your Team
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}