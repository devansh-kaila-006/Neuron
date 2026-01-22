import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function Team() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };
  
  const mentor = {
    name: 'Dr. Sarah Mitchell',
    role: 'Faculty Mentor',
    department: 'Computer Science Department',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    bio: 'PhD in Machine Learning with 15+ years of research experience in AI and Neural Networks',
    social: {
      email: 'sarah.mitchell@college.edu',
      linkedin: '#',
      twitter: '#'
    }
  };
  
  const coreTeam = [
    {
      name: 'Alex Kumar',
      role: 'President',
      year: 'Final Year, CS',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Leading Neuron\'s vision for AI education and community building',
      social: {
        email: 'alex.kumar@college.edu',
        linkedin: '#',
        github: '#',
        twitter: '#'
      }
    },
    {
      name: 'Priya Sharma',
      role: 'Vice President',
      year: 'Third Year, AI/ML',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Organizing workshops and coordinating with industry partners',
      social: {
        email: 'priya.sharma@college.edu',
        linkedin: '#',
        github: '#',
        twitter: '#'
      }
    },
    {
      name: 'Rahul Verma',
      role: 'Technical Lead',
      year: 'Third Year, CS',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Managing technical projects and hackathon infrastructure',
      social: {
        email: 'rahul.verma@college.edu',
        linkedin: '#',
        github: '#',
        twitter: '#'
      }
    },
    {
      name: 'Ananya Patel',
      role: 'Events Coordinator',
      year: 'Second Year, Data Science',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      bio: 'Planning and executing club events, workshops, and meetups',
      social: {
        email: 'ananya.patel@college.edu',
        linkedin: '#',
        github: '#',
        twitter: '#'
      }
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
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none" data-testid="team-title">
              Meet Our <span className="text-gradient">Team</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="team-subtitle">
              The brilliant minds behind Neuron, dedicated to fostering AI/ML excellence and innovation
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Mentor Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" data-testid="mentor-section-title">
              Faculty <span className="text-gradient">Mentor</span>
            </h2>
            <p className="text-muted-foreground">Guiding our journey with expertise and wisdom</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Mentor Image */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="relative w-48 h-48 rounded-2xl object-cover border-2 border-white/10"
                      data-testid="mentor-image"
                    />
                  </div>
                </div>
                
                {/* Mentor Info */}
                <div className="md:col-span-2 space-y-4 text-center md:text-left">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2" data-testid="mentor-name">{mentor.name}</h3>
                    <p className="text-xl text-primary font-semibold mb-1">{mentor.role}</p>
                    <p className="text-muted-foreground">{mentor.department}</p>
                  </div>
                  
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {mentor.bio}
                  </p>
                  
                  <div className="flex items-center gap-4 justify-center md:justify-start pt-4">
                    <a
                      href={`mailto:${mentor.social.email}`}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all"
                      aria-label="Email"
                      data-testid="mentor-email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <a
                      href={mentor.social.linkedin}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all"
                      aria-label="LinkedIn"
                      data-testid="mentor-linkedin"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={mentor.social.twitter}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all"
                      aria-label="Twitter"
                      data-testid="mentor-twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Core Team Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" data-testid="core-team-title">
              Core <span className="text-gradient">Team</span>
            </h2>
            <p className="text-muted-foreground">Student leaders driving innovation and excellence</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreTeam.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
                data-testid={`team-member-${index}`}
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:border-primary/50">
                  {/* Member Image */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Member Info */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white" data-testid={`member-name-${index}`}>{member.name}</h3>
                      <p className="text-primary font-semibold">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.year}</p>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                    
                    {/* Social Links */}
                    <div className="flex items-center gap-3 pt-2">
                      <a
                        href={`mailto:${member.social.email}`}
                        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all"
                        aria-label="Email"
                        data-testid={`member-email-${index}`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      <a
                        href={member.social.linkedin}
                        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all"
                        aria-label="LinkedIn"
                        data-testid={`member-linkedin-${index}`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a
                        href={member.social.github}
                        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all"
                        aria-label="GitHub"
                        data-testid={`member-github-${index}`}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a
                        href={member.social.twitter}
                        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all"
                        aria-label="Twitter"
                        data-testid={`member-twitter-${index}`}
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Join CTA */}
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
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="join-cta-title">
                Want to <span className="text-gradient">Join Us?</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                We're always looking for passionate students to join our team and contribute to the AI/ML community
              </p>
              
              <div className="pt-4">
                <a
                  href="mailto:contact@neuronclub.edu"
                  className="inline-block bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all duration-300 hover:scale-105 rounded-full px-8 py-4 text-lg font-bold tracking-wide"
                  data-testid="join-contact-btn"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}