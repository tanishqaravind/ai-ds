import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, BarChart3, LogOut, Activity, Lock, AlertTriangle, CheckCircle, TrendingUp, Database, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [currentPath, setCurrentPath] = useState('/adminDB');
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({
    threats: 0,
    users: 0,
    blocked: 0,
    uptime: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const timer = setTimeout(() => {
      setStats({
        threats: 247,
        users: 156,
        blocked: 89,
        uptime: 99.97
      });
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);
    const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    setCurrentPath('/');
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/adminDB', icon: Shield },
    { name: 'Developer Directory', path: '/developer', icon: Users },
    { name: 'Analyst Directory', path: '/analyst', icon: Database },
    { name: 'View Reports', path: '/adnreports', icon: FileText },
    { name: 'Analytics', path: '/adnanalytics', icon: BarChart3 }
  ];

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'AI-powered Light Gradient Boosting Machine analyzes CloudTrail logs with <25ms latency, detecting anomalies across spatial and temporal dimensions.',
      color: 'from-emerald-400 to-teal-400',
      stats: '25ms latency'
    },
    {
      icon: Lock,
      title: 'Zero-Trust Architecture',
      description: 'Continuous verification of all users. Transformer models learn behavioral patterns across time, geography, and access patterns.',
      color: 'from-violet-400 to-purple-400',
      stats: '99.2% accuracy'
    },
    {
      icon: AlertTriangle,
      title: 'Threat Detection',
      description: 'Detects credential theft, insider threats, DDoS attacks, and zero-day exploits using spatio-temporal graph analysis.',
      color: 'from-rose-400 to-pink-400',
      stats: '247 blocked today'
    },
    {
      icon: CheckCircle,
      title: 'Automated Response',
      description: 'Lambda-based mitigation: auto-revoke IAM keys, quarantine IPs via WAF, and send SNS alerts to administrators.',
      color: 'from-lime-400 to-green-400',
      stats: 'Auto-mitigation'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics',
      description: 'LSTM and Transformer layers identify attack patterns before they escalate, providing proactive security posture.',
      color: 'from-amber-400 to-orange-400',
      stats: 'ROC-AUC: 0.98'
    },
    {
      icon: Globe,
      title: 'Multi-Cloud Support',
      description: 'Federated learning across AWS, Azure, and GCP. Scales horizontally with distributed graph processing.',
      color: 'from-cyan-400 to-sky-400',
      stats: 'Cloud-native'
    }
  ];

  const threatLevels = [
    { level: 'Critical', count: 3, color: 'bg-rose-500' },
    { level: 'High', count: 12, color: 'bg-orange-400' },
    { level: 'Medium', count: 45, color: 'bg-amber-400' },
    { level: 'Low', count: 187, color: 'bg-emerald-400' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-xl shadow-purple-200/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src='Logo.png' alt='Logo' className="w-10 h-10 text-violet-600" />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Shield className="w-10 h-10 text-violet-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Smart IDS
                </h1>
                <p className="text-xs text-gray-600">Intrusion Detection System</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {setCurrentPath(item.path);navigate(item.path)}}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-300/50'
                        : 'text-gray-700 hover:bg-purple-100 hover:text-violet-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg transition-all duration-300 border border-rose-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz4+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-violet-100 border border-violet-300 rounded-full text-violet-700 text-sm font-medium mb-6">
              🚀 Transformer-Based ST-GNN Architecture
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent animate-fade-in-up">
            AI-Driven Cloud Security
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Real-time intrusion detection using Light Gradient Boosting Machine for AWS S3 environments
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fade-in-up animation-delay-400">
            {[
              { label: 'Threats Detected', value: stats.threats, icon: AlertTriangle, color: 'from-rose-400 to-pink-400' },
              { label: 'Active Users', value: stats.users, icon: Users, color: 'from-teal-400 to-cyan-400' },
              { label: 'Attacks Blocked', value: stats.blocked, icon: Shield, color: 'from-emerald-400 to-green-400' },
              { label: 'System Uptime', value: `${stats.uptime}%`, icon: Activity, color: 'from-violet-400 to-purple-400' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white/70 backdrop-blur-lg rounded-xl p-6 border border-purple-200 hover:border-violet-400 transition-all duration-300 hover:scale-105 shadow-lg">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-600">
            <button className="px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-semibold shadow-lg shadow-violet-300/50 hover:shadow-violet-400/70 hover:scale-105 transition-all duration-300">
              View Live Dashboard
            </button>
            <button className="px-8 py-4 bg-white/80 backdrop-blur-lg text-violet-700 rounded-lg font-semibold border border-violet-300 hover:bg-white hover:scale-105 transition-all duration-300">
              Documentation
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-violet-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-violet-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Threat Level Overview */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-purple-200 mb-12 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Current Threat Levels</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {threatLevels.map((threat, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-16 h-16 ${threat.color} rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                  {threat.count}
                </div>
                <div className="text-gray-700 font-medium">{threat.level}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Advanced Security Features
          </h2>
          <p className="text-xl text-gray-600">
            Powered by Transformer-based Spatio-Temporal Graph Neural Networks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-purple-200 hover:border-violet-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-purple-200">
                  <span className="text-sm font-semibold text-violet-600">{feature.stats}</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Specs */}
      <div className="max-w-7xl mx-auto px-6 py-12 mb-12">
        <div className="bg-gradient-to-r from-violet-100 to-fuchsia-100 backdrop-blur-lg rounded-2xl p-8 border border-violet-300 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">System Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-violet-600 mb-2">99.2%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-fuchsia-600 mb-2">0.98</div>
              <div className="text-sm text-gray-600">ROC-AUC</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">25ms</div>
              <div className="text-sm text-gray-600">Latency</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">97.8%</div>
              <div className="text-sm text-gray-600">Precision</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">96.5%</div>
              <div className="text-sm text-gray-600">Recall</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;