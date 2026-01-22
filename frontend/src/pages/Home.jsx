import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Brain, Zap, Users, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
  };
  
  const features = [
    {
      icon: Brain,
      title: 'AI & ML Research',
      description: 'Dive deep into cutting-edge artificial intelligence and machine learning concepts'
    },
    {
      icon: Zap,
      title: 'Hackathons',
      description: 'Compete in intense coding challenges and build innovative AI-powered solutions'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with like-minded students and industry experts in AI/ML domain'
    },
    {
      icon: Trophy,
      title: 'Workshops',
      description: 'Learn from hands-on workshops on Deep Learning, NLP, Computer Vision & more'
    }
  ];
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      {/* Grid Background */}
      <div className="fixed inset-0 grid-background opacity-50" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div {...fadeInUp} className="space-y-8">
              <div className="inline-block">
                <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-accent bg-accent/10 px-4 py-2 rounded-full border border-accent/20" data-testid="hero-badge">
                  <Sparkles className="w-3 h-3 inline mr-2" />
                  AI • ML • DL • Innovation
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none" data-testid="hero-title">
                <span className="text-gradient">NEURON</span>
                <br />
                <span className="text-white">The Neural</span>
                <br />
                <span className="text-white">Network of</span>
                <br />
                <span className="text-accent">Innovation</span>
              </h1>
              
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl" data-testid="hero-description">
                Join a vibrant community of AI enthusiasts. Build cutting-edge projects, participate in hackathons, and shape the future of artificial intelligence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register" data-testid="hero-register-btn">
                  <Button className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-lg font-bold tracking-wide group">
                    Register for Hackathon
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/about" data-testid="hero-learn-more-btn">
                  <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 rounded-full px-8 py-6 text-lg font-medium">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1764336312138-14a5368a6cd3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwbmV1cmFsJTIwbmV0d29yayUyMGFic3RyYWN0JTIwcHVycGxlfGVufDB8fHx8MTc2OTA2OTE0MHww&ixlib=rb-4.1.0&q=85"
                alt="Abstract Neural Network"
                className="relative rounded-3xl w-full h-auto border border-white/10"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6" data-testid="features-title">
              What We <span className="text-gradient">Offer</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering students with knowledge, skills, and opportunities in AI & ML
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all duration-500 hover:border-primary/50"
                data-testid={`feature-card-${index}`}
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl glass-card p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="cta-title">
                Ready to Join the <span className="text-gradient">AI Revolution?</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Register now for our Overnight Hackathon and showcase your AI/ML skills
              </p>
              
              <div className="pt-4">
                <Link to="/hackathon" data-testid="cta-explore-btn">
                  <Button className="bg-accent hover:bg-accent/90 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-lg font-bold tracking-wide group">
                    Explore Hackathon
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