import React, { useState, useEffect } from 'react';
import { Database, Home, FilePlus, FolderSearch, BarChart3, LogOut, TrendingUp, FileSpreadsheet, Brain, Workflow, Shield, Activity, Upload, Download, AlertTriangle, Clock, Calendar, RefreshCw, CheckCircle, Filter, Search, FileText } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useNavigate } from 'react-router-dom';

function AnalystAnalytics() {
    const [currentPath, setCurrentPath] = useState('/analytics');
    const [scrolled, setScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('reports');
    const [eventLogs, setEventLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('all');
    const [filterThreat, setFilterThreat] = useState('all');

    const analystEmail = sessionStorage.getItem('analystEmail');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        fetchAnalystData();
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchAnalystData, 30000);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, filterRisk, filterThreat, eventLogs]);

    const fetchAnalystData = async () => {
        setRefreshing(true);
        try {
            const response = await fetch(`http://localhost:8082/api/eventlogs/by-analyst/${analystEmail}`);
            const data = await response.json();
            setEventLogs(data);
            setFilteredLogs(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analyst data:', error);
            setLoading(false);
        } finally {
            setRefreshing(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...eventLogs];

        if (searchTerm) {
            filtered = filtered.filter(log => 
                log.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.eventName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterRisk !== 'all') {
            filtered = filtered.filter(log => log.riskLevel === filterRisk);
        }

        if (filterThreat !== 'all') {
            filtered = filtered.filter(log => log.predictedClass === filterThreat);
        }

        setFilteredLogs(filtered);
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
        { name: 'Home', path: '/analystDB', icon: Home },
        { name: 'Add Documents', path: '/addDocs', icon: FilePlus },
        { name: 'View Documents', path: '/viewDocs', icon: FolderSearch },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 }
    ];

    // Analytics Calculations
    const totalEvents = eventLogs.length;
    const uploadEvents = eventLogs.filter(log => log.eventName === 'PutObject').length;
    const downloadEvents = eventLogs.filter(log => log.eventName === 'GetObject').length;
    const highRiskEvents = eventLogs.filter(log => log.riskLevel === 'High').length;
    const avgRiskScore = eventLogs.length > 0 
        ? (eventLogs.reduce((sum, log) => sum + (log.riskScore || 0), 0) / eventLogs.length).toFixed(2)
        : 0;

    // Threat Distribution
    const threatDistribution = eventLogs.reduce((acc, log) => {
        const threat = log.predictedClass || 'Unknown';
        acc[threat] = (acc[threat] || 0) + 1;
        return acc;
    }, {});

    const threatData = Object.entries(threatDistribution).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value
    }));

    // Risk Level Distribution
    const riskDistribution = eventLogs.reduce((acc, log) => {
        const risk = log.riskLevel || 'Unknown';
        acc[risk] = (acc[risk] || 0) + 1;
        return acc;
    }, {});

    const riskData = Object.entries(riskDistribution).map(([name, value]) => ({
        name,
        value
    }));

    // Event Type Distribution
    const eventTypeData = [
        { name: 'Uploads', value: uploadEvents },
        { name: 'Downloads', value: downloadEvents }
    ];

    // Hourly Activity
    const hourlyActivity = eventLogs.reduce((acc, log) => {
        const hour = log.hourOfDay || 0;
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
    }, {});

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        events: hourlyActivity[i] || 0
    }));

    // Daily Activity (Last 7 days)
    const dailyActivity = eventLogs.reduce((acc, log) => {
        const date = new Date(log.timestamp).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const dailyData = Object.entries(dailyActivity)
        .map(([date, count]) => ({ date, events: count }))
        .slice(-7);

    // Risk Score Over Time
    const riskOverTime = eventLogs
        .map(log => ({
            time: new Date(log.timestamp).toLocaleTimeString(),
            riskScore: log.riskScore
        }))
        .slice(-20);

    // Activity Metrics for Radar Chart
    const activityMetrics = [
        { metric: 'Upload Activity', value: (uploadEvents / totalEvents * 100) || 0 },
        { metric: 'Download Activity', value: (downloadEvents / totalEvents * 100) || 0 },
        { metric: 'High Risk %', value: (highRiskEvents / totalEvents * 100) || 0 },
        { metric: 'Avg Risk Score', value: (avgRiskScore * 20) || 0 },
        { metric: 'Weekend Activity', value: (eventLogs.filter(log => log.isWeekend === 1).length / totalEvents * 100) || 0 }
    ];

    const THREAT_COLORS = {
        'Normal Traffic': '#10b981',
        'Credential Theft': '#ef4444',
        'DDoS API Flood': '#f59e0b',
        'Insider Exfiltration': '#8b5cf6',
        'Unknown': '#6b7280'
    };

    const CHART_COLORS = ['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-indigo-600 font-medium text-lg">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
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
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive
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

            {/* Main Content */}
            <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Analyst Dashboard
                        </h1>
                        <p className="text-gray-600">Monitoring activity for {analystEmail}</p>
                    </div>
                    <button
                        onClick={fetchAnalystData}
                        disabled={refreshing}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="text-sm font-medium">Refresh</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            activeTab === 'reports'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FileText className="w-5 h-5" />
                        <span>My Reports</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            activeTab === 'analytics'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <BarChart3 className="w-5 h-5" />
                        <span>Analytics</span>
                    </button>
                </div>

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                    <div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100">
                                <div className="flex items-center justify-between mb-2">
                                    <Activity className="w-8 h-8 text-indigo-600" />
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Total Events</p>
                                <p className="text-3xl font-bold text-gray-800">{totalEvents}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                                <div className="flex items-center justify-between mb-2">
                                    <Upload className="w-8 h-8 text-green-600" />
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Uploads</p>
                                <p className="text-3xl font-bold text-gray-800">{uploadEvents}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                                <div className="flex items-center justify-between mb-2">
                                    <Download className="w-8 h-8 text-blue-600" />
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Downloads</p>
                                <p className="text-3xl font-bold text-gray-800">{downloadEvents}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100">
                                <div className="flex items-center justify-between mb-2">
                                    <AlertTriangle className="w-8 h-8 text-red-600" />
                                </div>
                                <p className="text-gray-600 text-sm mb-1">High Risk</p>
                                <p className="text-3xl font-bold text-gray-800">{highRiskEvents}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="w-8 h-8 text-orange-600" />
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Avg Risk Score</p>
                                <p className="text-3xl font-bold text-gray-800">{avgRiskScore}</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <Filter className="w-5 h-5 mr-2 text-indigo-600" />
                                    Filter Reports
                                </h2>
                                <span className="text-sm text-gray-600">
                                    Showing {filteredLogs.length} of {eventLogs.length} events
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by file or event..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <select
                                    value={filterRisk}
                                    onChange={(e) => setFilterRisk(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="all">All Risk Levels</option>
                                    <option value="Low">Low Risk</option>
                                    <option value="Medium">Medium Risk</option>
                                    <option value="High">High Risk</option>
                                </select>

                                <select
                                    value={filterThreat}
                                    onChange={(e) => setFilterThreat(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="all">All Threat Types</option>
                                    <option value="Normal_Traffic">Normal Traffic</option>
                                    <option value="Credential_Theft">Credential Theft</option>
                                    <option value="DDoS_API_Flood">DDoS API Flood</option>
                                    <option value="Insider_Exfiltration">Insider Exfiltration</option>
                                </select>
                            </div>
                        </div>

                        {/* Reports List */}
                        <div className="space-y-4">
                            {filteredLogs.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No reports found matching your filters</p>
                                </div>
                            ) : (
                                filteredLogs.map((log) => {
                                    const threatClass = log.predictedClass || 'Unknown';
                                    const isNormal = threatClass === 'Normal_Traffic';
                                    
                                    return (
                                        <div key={log.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4" 
                                             style={{ borderLeftColor: isNormal ? '#10b981' : '#ef4444' }}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className={`p-2 rounded-lg ${isNormal ? 'bg-green-100' : 'bg-red-100'}`}>
                                                            {isNormal ? (
                                                                <CheckCircle className="w-6 h-6 text-green-600" />
                                                            ) : (
                                                                <AlertTriangle className="w-6 h-6 text-red-600" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-800">{log.fileName}</h3>
                                                            <p className="text-sm text-gray-500">Event ID: #{log.id}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500">Event Type</p>
                                                            <p className="text-sm font-semibold text-gray-800">{log.eventName}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Data Size</p>
                                                            <p className="text-sm font-semibold text-gray-800">
                                                                {(log.bytesTransferred / 1024).toFixed(2)} KB
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Risk Score</p>
                                                            <p className="text-sm font-bold text-orange-600">{log.riskScore}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Request Rate</p>
                                                            <p className="text-sm font-semibold text-gray-800">{log.requestRatePerMin}/min</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                threatClass === 'Normal_Traffic' ? 'bg-green-100 text-green-700' :
                                                                threatClass === 'Credential_Theft' ? 'bg-red-100 text-red-700' :
                                                                threatClass === 'DDoS_API_Flood' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-purple-100 text-purple-700'
                                                            }`}>
                                                                {threatClass.replace('_', ' ')}
                                                            </span>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                log.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                                                                log.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-green-100 text-green-700'
                                                            }`}>
                                                                {log.riskLevel}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div>
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 shadow-lg text-white">
                                <Activity className="w-10 h-10 mb-3 opacity-80" />
                                <p className="text-indigo-100 text-sm mb-1">Total Events</p>
                                <p className="text-4xl font-bold">{totalEvents}</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg text-white">
                                <Upload className="w-10 h-10 mb-3 opacity-80" />
                                <p className="text-green-100 text-sm mb-1">Uploads</p>
                                <p className="text-4xl font-bold">{uploadEvents}</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg text-white">
                                <Download className="w-10 h-10 mb-3 opacity-80" />
                                <p className="text-blue-100 text-sm mb-1">Downloads</p>
                                <p className="text-4xl font-bold">{downloadEvents}</p>
                            </div>

                            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-lg text-white">
                                <AlertTriangle className="w-10 h-10 mb-3 opacity-80" />
                                <p className="text-red-100 text-sm mb-1">High Risk</p>
                                <p className="text-4xl font-bold">{highRiskEvents}</p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg text-white">
                                <TrendingUp className="w-10 h-10 mb-3 opacity-80" />
                                <p className="text-orange-100 text-sm mb-1">Avg Risk</p>
                                <p className="text-4xl font-bold">{avgRiskScore}</p>
                            </div>
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Threat Distribution Donut */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                                    Threat Classification
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={threatData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {threatData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={THREAT_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Activity Radar Chart */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                                    Activity Profile
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={activityMetrics}>
                                        <PolarGrid stroke="#e5e7eb" />
                                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                                        <Radar name="Activity" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Charts Row 2 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Risk Level Distribution */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                                    Risk Level Breakdown
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={riskData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis type="number" stroke="#6b7280" />
                                        <YAxis dataKey="name" type="category" stroke="#6b7280" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        />
                                        <Bar dataKey="value" fill="#f59e0b" radius={[0, 8, 8, 0]}>
                                            {riskData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={
                                                    entry.name === 'High' ? '#ef4444' :
                                                    entry.name === 'Medium' ? '#f59e0b' :
                                                    '#10b981'
                                                } />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Upload vs Download */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Workflow className="w-5 h-5 mr-2 text-green-600" />
                                    Upload vs Download Activity
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={eventTypeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill="#10b981" />
                                            <Cell fill="#06b6d4" />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Charts Row 3 */}
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            {/* Hourly Activity Pattern */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                    24-Hour Activity Pattern
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={hourlyData}>
                                        <defs>
                                            <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="hour" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        />
                                        <Area type="monotone" dataKey="events" stroke="#6366f1" fillOpacity={1} fill="url(#colorHourly)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Charts Row 4 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Daily Activity Trend */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-pink-600" />
                                    Weekly Activity Trend
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={dailyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="events" 
                                            stroke="#ec4899" 
                                            strokeWidth={3}
                                            dot={{ fill: '#ec4899', r: 6 }}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Risk Score Timeline */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
                                    Risk Score Timeline (Last 20)
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={riskOverTime}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="time" stroke="#6b7280" hide />
                                        <YAxis stroke="#6b7280" domain={[0, 1]} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="riskScore" 
                                            stroke="#ef4444" 
                                            strokeWidth={2}
                                            dot={{ fill: '#ef4444', r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Activity Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Peak Activity Time */}
                            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="p-3 bg-purple-500 rounded-xl">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-700 font-medium">Peak Activity Hour</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {Object.entries(hourlyActivity).sort((a, b) => b[1] - a[1])[0]?.[0] || '0'}:00
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Most Common Event */}
                            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="p-3 bg-blue-500 rounded-xl">
                                        <FileSpreadsheet className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-700 font-medium">Most Common Event</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {uploadEvents > downloadEvents ? 'Upload' : 'Download'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Security Status */}
                            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="p-3 bg-green-500 rounded-xl">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-700 font-medium">Security Status</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            {highRiskEvents === 0 ? 'Secure' : highRiskEvents < 5 ? 'Monitor' : 'Alert'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnalystAnalytics;