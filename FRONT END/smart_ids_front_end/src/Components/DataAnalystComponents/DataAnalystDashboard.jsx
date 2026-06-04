import React, { useState, useEffect } from 'react';
import { Database, Home, FilePlus, FolderSearch, BarChart3, LogOut, PieChart, TrendingUp, FileSpreadsheet, Brain, Workflow, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnalystDashboard = () => {
  const [currentPath, setCurrentPath] = useState('/analystDB');
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({
    datasets: 0,
    queries: 0,
    reports: 0,
    insights: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Animate stats on mount
    const timer = setTimeout(() => {
      setStats({
        datasets: 156,
        queries: 2847,
        reports: 64,
        insights: 28
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
    { name: 'Home', path: '/analystDB', icon: Home },
    { name: 'Add Documents', path: '/addDocs', icon: FilePlus },
    { name: 'View Documents', path: '/viewDocs', icon: FolderSearch },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 }
  ];

  const features = [
    {
      icon: FileSpreadsheet,
      title: 'Dataset Management',
      description: 'Access and analyze large CSV, JSON, and Parquet files from S3. Automated data cataloging with AWS Glue integration for efficient queries.',
      color: 'from-indigo-400 to-blue-400',
      stats: '156 datasets',
      metric: '2.8 TB'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Machine learning models identify patterns in security logs. Anomaly detection flags unusual data access patterns in real-time.',
      color: 'from-purple-400 to-fuchsia-400',
      stats: '28 insights',
      metric: '94% accuracy'
    },
    {
      icon: PieChart,
      title: 'Interactive Dashboards',
      description: 'Build custom visualizations with Athena queries. Real-time charts update as new security events are logged to S3 buckets.',
      color: 'from-pink-400 to-rose-400',
      stats: '64 reports',
      metric: 'Live updates'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Historical data analysis reveals attack patterns over time. Predictive analytics forecast potential security threats before escalation.',
      color: 'from-amber-400 to-orange-400',
      stats: '30-day trends',
      metric: '↑ 23% accuracy'
    },
    {
      icon: Workflow,
      title: 'Data Pipeline',
      description: 'Automated ETL workflows process CloudTrail logs. Clean, transform, and aggregate security events for comprehensive analysis.',
      color: 'from-emerald-400 to-teal-400',
      stats: '2.8K queries/day',
      metric: '<2s response'
    },
    {
      icon: Shield,
      title: 'Compliance Reports',
      description: 'Generate audit-ready reports for security compliance. Track user access patterns and flag policy violations automatically.',
      color: 'from-cyan-400 to-sky-400',
      stats: 'ISO 27001',
      metric: '100% compliant'
    }
  ];

  const recentAnalytics = [
    { type: 'Query', name: 'Threat Pattern Analysis', dataset: 'CloudTrail Logs', time: '5 min ago', status: 'completed', result: '247 anomalies' },
    { type: 'Report', name: 'Monthly Security Audit', dataset: 'S3 Access Logs', time: '1 hour ago', status: 'completed', result: 'Generated PDF' },
    { type: 'Insight', name: 'Unusual Access Detected', dataset: 'User Activity', time: '2 hours ago', status: 'warning', result: 'Alert sent' },
    { type: 'Query', name: 'Data Volume Trends', dataset: 'Analytics Dataset', time: '3 hours ago', status: 'completed', result: '↑ 23% growth' }
  ];

  const dataMetrics = [
    { label: 'Datasets Analyzed', value: stats.datasets, icon: Database, color: 'from-indigo-500 to-blue-500', change: '+12 this week' },
    { label: 'Queries Executed', value: stats.queries.toLocaleString(), icon: BarChart3, color: 'from-purple-500 to-fuchsia-500', change: '+340 today' },
    { label: 'Reports Generated', value: stats.reports, icon: FileSpreadsheet, color: 'from-pink-500 to-rose-500', change: '+8 this month' },
    { label: 'AI Insights', value: stats.insights, icon: Brain, color: 'from-emerald-500 to-teal-500', change: '+5 today' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
                <Database className="w-10 h-10 text-indigo-600" />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Database className="w-10 h-10 text-indigo-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Analytics Hub
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
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-300/50'
                        : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
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

      {/* Hero Section - Analytics Theme */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Data Visualization Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-32 left-32 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-48 right-24 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-24 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Chart-like Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="analytics-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="60" height="60" fill="none" stroke="#6366f1" strokeWidth="0.5" opacity="0.3"/>
                <circle cx="30" cy="30" r="2" fill="#8b5cf6"/>
                <line x1="0" y1="30" x2="60" y2="30" stroke="#a855f7" strokeWidth="0.5" opacity="0.4"/>
                <line x1="30" y1="0" x2="30" y2="60" stroke="#a855f7" strokeWidth="0.5" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#analytics-grid)"/>
          </svg>
        </div>

        {/* Floating Data Points Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-bounce animation-delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-3000"></div>
          <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-pink-400 rounded-full animate-bounce animation-delay-5000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-indigo-100 border border-indigo-300 rounded-full text-indigo-700 text-sm font-medium mb-6">
              📊 Data Analytics Platform - Powered by AWS Athena
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in-up">
            Data-Driven Insights
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Transform security logs into actionable intelligence with AI-powered analytics
          </p>

          {/* Data Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fade-in-up animation-delay-400">
            {dataMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="bg-white/70 backdrop-blur-lg rounded-xl p-6 border border-purple-200 hover:border-indigo-400 transition-all duration-300 hover:scale-105 shadow-lg">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${metric.color} mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                  <div className="text-xs text-indigo-600 font-semibold">{metric.change}</div>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-600">
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg shadow-indigo-300/50 hover:shadow-indigo-400/70 hover:scale-105 transition-all duration-300">
              Run New Query
            </button>
            <button className="px-8 py-4 bg-white/80 backdrop-blur-lg text-indigo-700 rounded-lg font-semibold border border-indigo-300 hover:bg-white hover:scale-105 transition-all duration-300">
              View Dashboard
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-indigo-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Recent Analytics Activity */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-purple-200 mb-12 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Recent Analytics Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">Processing in real-time</span>
            </div>
          </div>
          <div className="space-y-3">
            {recentAnalytics.map((activity, idx) => (
              <div key={idx} className="group flex items-center justify-between p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activity.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {activity.type}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800 font-semibold">{activity.name}</div>
                    <div className="text-sm text-gray-600">{activity.dataset}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-indigo-600">{activity.result}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Analytics Capabilities
          </h2>
          <p className="text-xl text-gray-600">
            Advanced tools for security data analysis and visualization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-purple-200 hover:border-indigo-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-purple-200">
                  <div>
                    <div className="text-sm font-semibold text-indigo-600">{feature.stats}</div>
                    <div className="text-xs text-gray-500">{feature.metric}</div>
                  </div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Quality & Compliance */}
      <div className="max-w-7xl mx-auto px-6 py-12 mb-12">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-lg rounded-2xl p-8 border border-indigo-300 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Data Quality & Compliance</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">98.7%</div>
              <div className="text-sm text-gray-600">Data Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">2.8TB</div>
              <div className="text-sm text-gray-600">Total Data</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">&lt;2s</div>
              <div className="text-sm text-gray-600">Query Speed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Compliant</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
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
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-5000 {
          animation-delay: 5s;
        }
      `}</style>
    </div>
  );
};

export default AnalystDashboard;