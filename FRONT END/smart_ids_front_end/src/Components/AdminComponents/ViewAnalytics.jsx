import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, BarChart3, LogOut, Activity, Lock, AlertTriangle, CheckCircle, TrendingUp, Database, Globe, Download, Upload, Clock, Calendar, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

function ViewAdnAnalytics() {
    const [currentPath, setCurrentPath] = useState('/adnanalytics');
    const [scrolled, setScrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // Analytics State
    const [summary, setSummary] = useState({
        totalEvents: 0,
        totalUploadsCount: 0,
        totalDownloadsCount: 0,
        averageRiskScore: 0,
        averageRequestRate: 0
    });
    const [eventTypeStats, setEventTypeStats] = useState([]);
    const [roleStats, setRoleStats] = useState([]);
    const [dateStats, setDateStats] = useState([]);
    const [allLogs, setAllLogs] = useState([]);
    const [threatDistribution, setThreatDistribution] = useState([]);

    const API_BASE = 'http://localhost:8082/api/eventlogs';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetchAllAnalytics();
        const interval = setInterval(fetchAllAnalytics, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllAnalytics = async () => {
        setRefreshing(true);
        try {
            // Fetch summary analytics
            const summaryRes = await fetch(`${API_BASE}/analytics/summary`);
            const summaryData = await summaryRes.json();
            setSummary(summaryData);

            // Fetch event type stats
            const eventTypeRes = await fetch(`${API_BASE}/analytics/by-event`);
            const eventTypeData = await eventTypeRes.json();
            setEventTypeStats(eventTypeData.map(([eventName, count]) => ({
                name: eventName,
                count: count
            })));

            // Fetch role stats
            const roleRes = await fetch(`${API_BASE}/analytics/by-role`);
            const roleData = await roleRes.json();
            setRoleStats(roleData.map(([role, count]) => ({
                role: role,
                count: count
            })));

            // Fetch date stats
            const dateRes = await fetch(`${API_BASE}/analytics/by-date`);
            const dateData = await dateRes.json();
            setDateStats(dateData.map(([date, count]) => ({
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                events: count
            })).slice(-14)); // Last 14 days

            // Fetch all logs for threat analysis
            const logsRes = await fetch(`${API_BASE}/all`);
            const logsData = await logsRes.json();
            setAllLogs(logsData);

            // Calculate threat distribution
            const threats = logsData.reduce((acc, log) => {
                const threat = log.predictedClass || 'Unknown';
                acc[threat] = (acc[threat] || 0) + 1;
                return acc;
            }, {});

            setThreatDistribution(Object.entries(threats).map(([name, value]) => ({
                name,
                value
            })));

            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setLoading(false);
        } finally {
            setRefreshing(false);
        }
    };
    const navigate = useNavigate();
    const handleNavigation = (path) => {
        setCurrentPath(path);
        navigate(path);
    };

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

    // Colors for charts
    const THREAT_COLORS = {
        'Normal_Traffic': '#10b981',
        'Credential_Theft': '#ef4444',
        'DDoS_API_Flood': '#f59e0b',
        'Insider_Exfiltration': '#8b5cf6',
        'Unknown': '#6b7280'
    };

    const CHART_COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

    // Calculate risk distribution
    const riskLevels = allLogs.reduce((acc, log) => {
        const level = log.riskLevel || 'Unknown';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});

    const riskData = Object.entries(riskLevels).map(([name, value]) => ({ name, value }));

    // Recent activity (last 10 events)
    const recentActivity = allLogs.slice(-10).reverse();

    // Calculate hourly activity distribution
    const hourlyActivity = allLogs.reduce((acc, log) => {
        const hour = log.hourOfDay || 0;
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
    }, {});

    const hourlyData = Object.entries(hourlyActivity)
        .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
        .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-4"></div>
                    <p className="text-violet-600 font-medium text-lg">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                    ? 'bg-white/80 backdrop-blur-lg shadow-xl shadow-purple-200/50'
                    : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <img src='Logo.png' className="w-10 h-10 text-violet-600" />
                                <div className="absolute inset-0 animate-ping opacity-20">
                                    <img src='Logo.png' className="w-10 h-10 text-violet-600" />
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
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive
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

            {/* Main Content */}
            <div className='pt-24 px-6 pb-12 max-w-7xl mx-auto'>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                            Security Analytics Dashboard
                        </h1>
                        <p className="text-gray-600">Real-time monitoring and threat analysis</p>
                    </div>
                    <button
                        onClick={fetchAllAnalytics}
                        disabled={refreshing}
                        className="flex items-center space-x-2 px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="text-sm font-medium">Refresh</span>
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-violet-100 rounded-xl">
                                <Activity className="w-6 h-6 text-violet-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm mb-1">Total Events</h3>
                        <p className="text-3xl font-bold text-gray-800">{summary.totalEvents.toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Upload className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm mb-1">Total Uploads</h3>
                        <p className="text-3xl font-bold text-gray-800">{summary.totalUploadsCount.toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Download className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm mb-1">Total Downloads</h3>
                        <p className="text-3xl font-bold text-gray-800">{summary.totalDownloadsCount.toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm mb-1">Avg Risk Score</h3>
                        <p className="text-3xl font-bold text-gray-800">{summary.averageRiskScore?.toFixed(2) || '0.00'}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-pink-100 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-pink-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm mb-1">Avg Request Rate</h3>
                        <p className="text-3xl font-bold text-gray-800">{summary.averageRequestRate?.toFixed(1) || '0.0'}/min</p>
                    </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Threat Distribution */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-violet-600" />
                            Threat Distribution
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={threatDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name.replace('_', ' ')}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {threatDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={THREAT_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {threatDistribution.map((threat, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THREAT_COLORS[threat.name] || CHART_COLORS[index % CHART_COLORS.length] }}></div>
                                    <span className="text-xs text-gray-600">{threat.name.replace('_', ' ')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Risk Level Distribution */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Lock className="w-5 h-5 mr-2 text-orange-600" />
                            Risk Level Distribution
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={riskData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Event Type Statistics */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-blue-600" />
                            Event Type Statistics
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={eventTypeStats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* User Role Activity */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-green-600" />
                            Activity by User Role
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={roleStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ role, percent }) => `${role}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {roleStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Events Timeline */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-pink-600" />
                        Events Timeline (Last 14 Days)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={dateStats}>
                            <defs>
                                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            />
                            <Area type="monotone" dataKey="events" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorEvents)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Hourly Activity Pattern */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-teal-600" />
                        Hourly Activity Pattern
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={hourlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="hour" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            />
                            <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-violet-600" />
                        Recent Activity (Last 10 Events)
                    </h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {recentActivity.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No recent activity</p>
                        ) : (
                            recentActivity.map((log) => {
                                const threatColor = THREAT_COLORS[log.predictedClass] || '#6b7280';
                                const ThreatIcon = log.predictedClass === 'Normal_Traffic' ? CheckCircle : AlertTriangle;
                                
                                return (
                                    <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${threatColor}20` }}>
                                                <ThreatIcon className="w-5 h-5" style={{ color: threatColor }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1 flex-wrap">
                                                    <span className="font-semibold text-gray-800 truncate">{log.userEmail}</span>
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                                        {log.userRole}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {log.eventName} - {log.fileName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {(log.bytesTransferred / 1024).toFixed(2)} KB | Risk: {log.riskScore}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className="px-3 py-1 rounded-lg text-xs font-semibold mb-1 whitespace-nowrap" 
                                                 style={{ backgroundColor: `${threatColor}20`, color: threatColor }}>
                                                {log.predictedClass != null ? log.predictedClass.replace('_', ' ') : "Processing ur File"}
                                            </div>
                                            <p className="text-xs text-gray-500 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewAdnAnalytics;