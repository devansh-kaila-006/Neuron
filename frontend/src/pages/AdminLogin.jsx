import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2, Lock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/auth/admin-login`, credentials);
      const { access_token } = response.data;
      
      // Store token
      localStorage.setItem('admin_token', access_token);
      
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <Navbar />
      
      <div className="fixed inset-0 grid-background opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-auto px-6"
      >
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" data-testid="admin-login-title">
              Admin <span className="text-gradient">Login</span>
            </h1>
            <p className="text-muted-foreground">Access the dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-xl h-12 text-white"
                data-testid="input-username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-xl h-12 text-white"
                data-testid="input-password"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all duration-300 rounded-full py-6 text-lg font-bold"
              data-testid="submit-login-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Default credentials: <code className="text-xs bg-white/5 px-2 py-1 rounded">admin / NeuronAdmin@2025</code>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}