import React, { useState, useEffect } from 'react';
import { Code, Home, FolderOpen, Download, FileText, BarChart3, LogOut, Terminal, GitBranch, Package, Zap, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeveloperDashboard = () => {
  const [currentPath, setCurrentPath] = useState('/devpDB');
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({
    deployments: 0,
    apiCalls: 0,
    filesAccessed: 0,
    activeProjects: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Animate stats on mount
    const timer = setTimeout(() => {
      setStats({
        deployments: 42,
        apiCalls: 15847,
        filesAccessed: 328,
        activeProjects: 8
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
    { name: 'Home', path: '/devpDB', icon: Home },
    { name: 'Files Directory', path: '/dwnFiles', icon: Download },
    { name: 'Analytics', path: '/devpAnalytics', icon: BarChart3 }
  ];

  const features = [
    {
      icon: Code,
      title: 'S3 Bucket Access',
      description: 'Secure access to project assets, build artifacts, and configuration files stored in AWS S3 with automatic encryption.',
      color: 'from-cyan-400 to-teal-400',
      stats: 'IAM Protected',
      status: 'active'
    },
    {
      icon: Terminal,
      title: 'API Integration',
      description: 'Connect EC2, Lambda, and ECS containers to S3. Use AWS SDK/CLI for seamless read-write operations across services.',
      color: 'from-violet-400 to-purple-400',
      stats: '15.8K calls/day',
      status: 'active'
    },
    {
      icon: GitBranch,
      title: 'Version Control',
      description: 'Automated versioning for all S3 objects. Track changes, rollback deployments, and maintain code integrity effortlessly.',
      color: 'from-emerald-400 to-green-400',
      stats: 'v2.4.1',
      status: 'active'
    },
    {
      icon: Package,
      title: 'Build Artifacts',
      description: 'Store and retrieve compiled builds, Docker images, and deployment packages with lifecycle policies for optimization.',
      color: 'from-orange-400 to-amber-400',
      stats: '2.3 GB stored',
      status: 'active'
    },
    {
      icon: Zap,
      title: 'Real-Time Sync',
      description: 'Automatic synchronization between local development and cloud storage. Changes propagate instantly across your team.',
      color: 'from-pink-400 to-rose-400',
      stats: '<50ms latency',
      status: 'active'
    },
    {
      icon: Clock,
      title: 'Activity Monitoring',
      description: 'AI-powered IDS tracks all your access patterns. Ensures security compliance while maintaining development velocity.',
      color: 'from-sky-400 to-cyan-400',
      stats: 'Monitored 24/7',
      status: 'active'
    }
  ];

  const recentActivities = [
    { action: 'Uploaded', file: 'build-v2.4.1.zip', bucket: 's3://project-logs/', time: '2 min ago', status: 'success' },
    { action: 'Downloaded', file: 'config.json', bucket: 's3://app-configs/', time: '15 min ago', status: 'success' },
    { action: 'Modified', file: 'deployment.yaml', bucket: 's3://k8s-configs/', time: '1 hour ago', status: 'success' },
    { action: 'Access Denied', file: 'customer-records/', bucket: 's3://restricted/', time: '2 hours ago', status: 'warning' }
  ];

  const quickStats = [
    { label: 'Today\'s Deployments', value: stats.deployments, change: '+12%', trend: 'up' },
    { label: 'API Calls', value: stats.apiCalls.toLocaleString(), change: '+8%', trend: 'up' },
    { label: 'Files Accessed', value: stats.filesAccessed, change: '+23%', trend: 'up' },
    { label: 'Active Projects', value: stats.activeProjects, change: '+2', trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-xl shadow-teal-200/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Code className="w-10 h-10 text-teal-600" />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Code className="w-10 h-10 text-teal-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Developer Portal
                </h1>
                <p className="text-xs text-gray-600">CloudSecure AI Platform</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {setCurrentPath(item.path);navigate(item.path);}}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-300/50'
                        : 'text-gray-700 hover:bg-teal-100 hover:text-teal-700'
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

      {/* Hero Section - Developer Theme */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Code Matrix Background Effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-60 right-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dev-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#14b8a6" opacity="0.3"/>
                <path d="M 20 0 L 20 40 M 0 20 L 40 20" stroke="#14b8a6" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dev-grid)"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-teal-100 border border-teal-300 rounded-full text-teal-700 text-sm font-medium mb-6">
              💻 Developer Workspace - AWS S3 Integration
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent animate-fade-in-up">
            Build. Deploy. Secure.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Access your cloud resources securely with AI-monitored development environment
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fade-in-up animation-delay-400">
            {quickStats.map((stat, idx) => (
              <div key={idx} className="bg-white/70 backdrop-blur-lg rounded-xl p-6 border border-teal-200 hover:border-teal-400 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                <div className="flex items-center justify-center space-x-1 text-emerald-600 text-xs font-semibold">
                  <span>{stat.change}</span>
                  <span>↑</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-600">
            <button className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg shadow-teal-300/50 hover:shadow-teal-400/70 hover:scale-105 transition-all duration-300">
              Access S3 Buckets
            </button>
            <button className="px-8 py-4 bg-white/80 backdrop-blur-lg text-teal-700 rounded-lg font-semibold border border-teal-300 hover:bg-white hover:scale-105 transition-all duration-300">
              View Documentation
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-teal-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-teal-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-teal-200 mb-12 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Recent Activity</h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              Live
            </span>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200 hover:border-teal-400 transition-all">
                <div className="flex items-center space-x-4">
                  {activity.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <div className="text-gray-800 font-medium">{activity.action} <span className="text-teal-600">{activity.file}</span></div>
                    <div className="text-sm text-gray-600">{activity.bucket}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Developer Features
          </h2>
          <p className="text-xl text-gray-600">
            Powerful tools for cloud-native application development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-teal-200 hover:border-teal-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-teal-200">
                  <span className="text-sm font-semibold text-teal-600">{feature.stats}</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Status */}
      <div className="max-w-7xl mx-auto px-6 py-12 mb-12">
        <div className="bg-gradient-to-r from-teal-100 to-cyan-100 backdrop-blur-lg rounded-2xl p-8 border border-teal-300 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Security & Compliance Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🔒</div>
              <div className="text-lg font-bold text-gray-800">IAM Secured</div>
              <div className="text-sm text-gray-600">Multi-factor auth</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-lg font-bold text-gray-800">Compliant</div>
              <div className="text-sm text-gray-600">All policies met</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-lg font-bold text-gray-800">Monitored</div>
              <div className="text-sm text-gray-600">AI-powered IDS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🚀</div>
              <div className="text-lg font-bold text-gray-800">Normal Access</div>
              <div className="text-sm text-gray-600">No anomalies</div>
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

export default DeveloperDashboard;