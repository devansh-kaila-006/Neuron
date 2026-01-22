import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Brain, Target, Lightbulb, Rocket, Users2, Code2 } from 'lucide-react';

export default function About() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };
  
  const focusAreas = [
    {
      icon: Brain,
      title: 'Artificial Intelligence',
      description: 'Exploring intelligent systems that can learn, reason, and make decisions'
    },
    {
      icon: Code2,
      title: 'Machine Learning',
      description: 'Building models that improve from experience without explicit programming'
    },
    {
      icon: Lightbulb,
      title: 'Deep Learning',
      description: 'Advanced neural networks for complex pattern recognition and prediction'
    },
    {
      icon: Target,
      title: 'Data Science',
      description: 'Extracting insights from structured and unstructured data using scientific methods'
    }
  ];
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="fixed inset-0 grid-background opacity-50" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div {...fadeInUp} className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none" data-testid="about-title">
              About <span className="text-gradient">Neuron</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="about-subtitle">
              A student-driven initiative to democratize AI & ML education through hands-on learning, research, and collaboration
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Vision & Mission */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-3xl p-8 md:p-12 space-y-6"
              data-testid="vision-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Vision</h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                To create a thriving ecosystem where students can explore, experiment, and excel in artificial intelligence and machine learning, becoming the next generation of AI innovators.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-3xl p-8 md:p-12 space-y-6"
              data-testid="mission-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Mission</h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                To provide accessible, high-quality AI/ML education through workshops, hackathons, and research projects while fostering a collaborative community of learners and innovators.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Focus Areas */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" data-testid="focus-areas-title">
              Core <span className="text-gradient">Focus Areas</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              We specialize in cutting-edge technologies that are shaping the future
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {focusAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 hover:from-primary/20 transition-all duration-500 group"
                data-testid={`focus-area-${index}`}
              >
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300">
                    <area.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{area.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Founding Story */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 md:p-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Users2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight" data-testid="story-title">
                  Our <span className="text-gradient">Story</span>
                </h2>
                <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Neuron was founded by a group of passionate students who recognized the growing importance of AI and ML in shaping our future. What started as informal study groups quickly evolved into a full-fledged technical club.
                  </p>
                  <p>
                    Today, we're a vibrant community of learners, builders, and innovators dedicated to making AI education accessible to everyone. Through our events, workshops, and collaborative projects, we've helped hundreds of students kickstart their journey in artificial intelligence.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
                <img
                  src="https://images.pexels.com/photos/6424590/pexels-photo-6424590.jpeg"
                  alt="Students coding at hackathon"
                  className="relative rounded-3xl w-full h-auto border border-white/10"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Roadmap */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" data-testid="roadmap-title">
              Future <span className="text-gradient">Roadmap</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Our ambitious plans for the coming years
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Monthly Workshops', desc: 'Expert-led sessions on trending AI/ML topics' },
              { title: 'Research Collaborations', desc: 'Partner with industry and academia on cutting-edge projects' },
              { title: 'Global Hackathons', desc: 'Organize international AI competitions with real-world challenges' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8 space-y-4"
                data-testid={`roadmap-item-${index}`}
              >
                <div className="text-5xl font-black text-primary/20">{`0${index + 1}`}</div>
                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}