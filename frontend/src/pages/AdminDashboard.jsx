import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Users, DollarSign, Clock, Download, LogOut, Loader2, CheckCircle, XCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      toast.error('Please login to access dashboard');
      navigate('/admin');
      return;
    }
    
    fetchData();
  }, [navigate]);
  
  const fetchData = async () => {
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      const [regsResponse, statsResponse] = await Promise.all([
        axios.get(`${API}/registrations`, { headers }),
        axios.get(`${API}/registrations/stats`, { headers })
      ]);
      
      setRegistrations(regsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('admin_token');
        navigate('/admin');
      } else {
        toast.error('Failed to fetch data');
      }
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = async () => {
    const token = localStorage.getItem('admin_token');
    
    try {
      const response = await axios.get(`${API}/registrations/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `neuron_registrations_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logged out successfully');
    navigate('/admin');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 grid-background opacity-50" />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 glass-card border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black tracking-tighter text-gradient">NEURON</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
        </div>
        
        <div className="flex-1 p-6">
          <nav className="space-y-2">
            <div className="px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium">
              Registrations
            </div>
          </nav>
        </div>
        
        <div className="p-6 border-t border-white/10">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-white"
            data-testid="logout-btn"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="md:ml-64 relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 glass-card">
          <div className="p-6 md:p-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight" data-testid="dashboard-title">Registrations</h2>
              <p className="text-muted-foreground mt-1">Manage hackathon participants</p>
            </div>
            <Button
              onClick={handleExport}
              className="bg-accent hover:bg-accent/90 text-black rounded-full px-6"
              data-testid="export-btn"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        {stats && (
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6"
                data-testid="stat-total"
              >
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <p className="text-3xl font-bold">{stats.total_registrations}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Registrations</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6"
                data-testid="stat-paid"
              >
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-3xl font-bold">{stats.paid_registrations}</p>
                <p className="text-sm text-muted-foreground mt-1">Paid</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6"
                data-testid="stat-pending"
              >
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold">{stats.pending_registrations}</p>
                <p className="text-sm text-muted-foreground mt-1">Pending</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6"
                data-testid="stat-revenue"
              >
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-accent" />
                </div>
                <p className="text-3xl font-bold">₹{stats.total_revenue_inr.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Revenue</p>
              </motion.div>
            </div>
            
            {/* Registrations Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="registrations-table">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Reg ID</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Name</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Email</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">College</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Team</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center p-12 text-muted-foreground">
                          No registrations yet
                        </td>
                      </tr>
                    ) : (
                      registrations.map((reg, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors" data-testid={`registration-row-${index}`}>
                          <td className="p-4">
                            <code className="text-xs bg-white/5 px-2 py-1 rounded">{reg.registration_id}</code>
                          </td>
                          <td className="p-4 text-white">{reg.full_name}</td>
                          <td className="p-4 text-sm text-muted-foreground">{reg.email}</td>
                          <td className="p-4 text-sm text-muted-foreground">{reg.college}</td>
                          <td className="p-4 text-sm text-muted-foreground">{reg.team_name || '-'}</td>
                          <td className="p-4">
                            {reg.payment_status === 'completed' ? (
                              <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20" data-testid="status-paid">
                                <CheckCircle className="w-3 h-3" />
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20" data-testid="status-pending">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(reg.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}