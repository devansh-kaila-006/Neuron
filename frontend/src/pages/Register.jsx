import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2, CheckCircle2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    college: '',
    team_name: '',
    honeypot: '' // Hidden field for bot detection
  });
  
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  const handlePayment = async (registrationId) => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }
      
      // Create payment order
      const orderResponse = await axios.post(`${API}/payment/create-order`, {
        amount: 50000, // 500 INR in paise
        registration_id: registrationId,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone
      });
      
      const { order_id, amount, currency, key_id } = orderResponse.data;
      
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: 'Neuron Club',
        description: 'Overnight Hackathon Registration',
        order_id: order_id,
        handler: async (response) => {
          try {
            // Verify payment
            await axios.post(`${API}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registration_id: registrationId
            });
            
            setRegistrationComplete(true);
            toast.success('Payment successful! Registration complete.');
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#7c3aed'
        },
        modal: {
          ondismiss: () => {
            toast.warning('Payment cancelled. You can complete payment later.');
          }
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
      console.error('Payment error:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.phone || !formData.college) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create registration
      const response = await axios.post(`${API}/registrations`, formData);
      const regId = response.data.registration_id;
      setRegistrationId(regId);
      
      toast.success('Registration created! Proceeding to payment...');
      
      // Initiate payment
      await handlePayment(regId);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(errorMsg);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <Navbar />
        <div className="fixed inset-0 grid-background opacity-50" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-2xl mx-auto px-6 text-center"
        >
          <div className="glass-card rounded-3xl p-12 space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="success-title">
              Registration <span className="text-gradient">Complete!</span>
            </h1>
            
            <div className="space-y-3">
              <p className="text-lg text-muted-foreground">
                Your registration ID is:
              </p>
              <div className="glass-card rounded-xl p-4 inline-block">
                <code className="text-2xl font-mono font-bold text-primary" data-testid="registration-id">{registrationId}</code>
              </div>
            </div>
            
            <p className="text-muted-foreground">
              A confirmation email has been sent to <span className="text-white">{formData.email}</span>.
              Please save your registration ID for future reference.
            </p>
            
            <div className="pt-4">
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-primary hover:bg-primary/90 rounded-full px-8 py-6"
                data-testid="back-home-btn"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="fixed inset-0 grid-background opacity-50" />
      
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-6" data-testid="register-title">
              <span className="text-gradient">Register</span> for Hackathon
            </h1>
            <p className="text-lg text-muted-foreground">
              Fill in your details to secure your spot. Registration fee: <span className="text-white font-semibold">₹500 per team</span>
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-3xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-white">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-xl h-12 text-white"
                  data-testid="input-full-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-xl h-12 text-white"
                  data-testid="input-email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-xl h-12 text-white"
                  data-testid="input-phone"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="college" className="text-white">College / University *</Label>
                <Input
                  id="college"
                  name="college"
                  type="text"
                  placeholder="Your college name"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-xl h-12 text-white"
                  data-testid="input-college"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team_name" className="text-white">Team Name (Optional)</Label>
                <Input
                  id="team_name"
                  name="team_name"
                  type="text"
                  placeholder="Your awesome team name"
                  value={formData.team_name}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-xl h-12 text-white"
                  data-testid="input-team-name"
                />
              </div>
              
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />
              
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all duration-300 rounded-full py-6 text-lg font-bold"
                  data-testid="submit-registration-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                By registering, you agree to follow the hackathon rules and code of conduct.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}