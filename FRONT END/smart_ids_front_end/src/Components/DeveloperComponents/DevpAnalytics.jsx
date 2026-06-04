import React, { useState, useEffect } from 'react';
import { Code, Home, Download, BarChart3, LogOut, Terminal, Package, Zap, Clock, CheckCircle2, AlertCircle, FileDown, Activity, TrendingDown, Shield, Filter, Search, Calendar, RefreshCw, Eye, AlertTriangle, Lock, Unlock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ComposedChart } from 'recharts';
import { useNavigate } from 'react-router-dom';

function DevpAnalytics() {
    const [currentPath, setCurrentPath] = useState('/devpAnalytics');
    const [scrolled, setScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [eventLogs, setEventLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('all');
    const [filterThreat, setFilterThreat] = useState('all');

    // Get developer email from session storage
    const developerEmail = sessionStorage.getItem('developerEmail') || 'developer@gmail.com';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        fetchDeveloperData();
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDeveloperData, 30000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, filterRisk, filterThreat, eventLogs]);

    const fetchDeveloperData = async () => {
        setRefreshing(true);
        try {
            const response = await fetch(`http://localhost:8082/api/eventlogs/by-developer/${developerEmail}`);
            const data = await response.json();
            setEventLogs(data);
            setFilteredLogs(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching developer data:', error);
            setLoading(false);
        } finally {
            setRefreshing(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...eventLogs];

        if (searchTerm) {
            filtered = filtered.filter(log => 
                log.fileName.toLowerCase().includes(searchTerm.toLowerCase())
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
        { name: 'Home', path: '/devpDB', icon: Home },
        { name: 'Files Directory', path: '/dwnFiles', icon: Download },
        { name: 'Analytics', path: '/devpAnalytics', icon: BarChart3 }
    ];

    // Analytics Calculations
    const totalDownloads = eventLogs.length;
    const totalBytes = eventLogs.reduce((sum, log) => sum + (log.bytesTransferred || 0), 0);
    const highRiskDownloads = eventLogs.filter(log => log.riskLevel === 'High').length;
    const avgRiskScore = eventLogs.length > 0 
        ? (eventLogs.reduce((sum, log) => sum + (log.riskScore || 0), 0) / eventLogs.length).toFixed(2)
        : '0.00';
    const avgRequestRate = eventLogs.length > 0
        ? (eventLogs.reduce((sum, log) => sum + (log.requestRatePerMin || 0), 0) / eventLogs.length).toFixed(1)
        : '0.0';

    // Threat Distribution
    const threatDistribution = eventLogs.reduce((acc, log) => {
        const threat = log.predictedClass || 'Unknown';
        acc[threat] = (acc[threat] || 0) + 1;
        return acc;
    }, {});

    const threatData = Object.entries(threatDistribution).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value,
        percentage: ((value / totalDownloads) * 100).toFixed(1)
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

    // Hourly Download Pattern
    const hourlyDownloads = eventLogs.reduce((acc, log) => {
        const hour = log.hourOfDay || 0;
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
    }, {});

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        downloads: hourlyDownloads[i] || 0
    }));

    // File Size Distribution
    const fileSizeData = eventLogs.map((log, index) => ({
        index: index + 1,
        size: parseFloat((log.bytesTransferred / 1024).toFixed(2)),
        riskScore: log.riskScore
    })).slice(-30);

    // Risk Score vs Request Rate Scatter
    const scatterData = eventLogs.map(log => ({
        riskScore: log.riskScore,
        requestRate: log.requestRatePerMin,
        size: log.bytesTransferred / 1024
    }));

    // Daily Activity
    const dailyActivity = eventLogs.reduce((acc, log) => {
        const date = new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const dailyData = Object.entries(dailyActivity)
        .map(([date, count]) => ({ date, downloads: count }))
        .slice(-10);

    const THREAT_COLORS = {
        'Normal Traffic': '#10b981',
        'Credential Theft': '#ef4444',
        'DDoS API Flood': '#f59e0b',
        'Insider Exfiltration': '#8b5cf6',
        'Unknown': '#6b7280'
    };

    const CHART_COLORS = ['#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'];

    const peakHour = Object.entries(hourlyDownloads).sort((a, b) => b[1] - a[1])[0]?.[0] || '0';
    const normalTrafficCount = eventLogs.filter(log => log.predictedClass === 'Normal_Traffic').length;
    const credentialTheftCount = eventLogs.filter(log => log.predictedClass === 'Credential_Theft').length;
    const ddosCount = eventLogs.filter(log => log.predictedClass === 'DDoS_API_Flood').length;
    const insiderCount = eventLogs.filter(log => log.predictedClass === 'Insider_Exfiltration').length;
    const securityScore = ((1 - parseFloat(avgRiskScore)) * 100).toFixed(0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-teal-600 font-medium text-lg">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
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
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive
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

            {/* Main Content */}
            <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                            Developer Analytics
                        </h1>
                        <p className="text-gray-600">Download activity monitoring for {developerEmail}</p>
                        <div className="flex items-center space-x-2 mt-2">
                            <Lock className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600 font-medium">Upload Restricted - Download Only Access</span>
                        </div>
                    </div>
                    <button
                        onClick={fetchDeveloperData}
                        disabled={refreshing}
                        className="flex items-center space-x-2 px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="text-sm font-medium">Refresh</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            activeTab === 'overview'
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-teal-200'
                        }`}
                    >
                        <Activity className="w-5 h-5" />
                        <span>Overview</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('downloads')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            activeTab === 'downloads'
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-teal-200'
                        }`}
                    >
                        <FileDown className="w-5 h-5" />
                        <span>Downloads</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            activeTab === 'security'
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-teal-200'
                        }`}
                    >
                        <Shield className="w-5 h-5" />
                        <span>Security</span>
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div>
                        {/* Hero Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                            <div className="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-teal-500 hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <FileDown className="w-10 h-10 text-teal-600" />
                                    <div className="px-3 py-1 bg-teal-100 rounded-full">
                                        <TrendingDown className="w-4 h-4 text-teal-600" />
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Total Downloads</p>
                                <p className="text-4xl font-bold text-teal-600">{totalDownloads}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-blue-500 hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <Package className="w-10 h-10 text-blue-600" />
                                    <div className="px-3 py-1 bg-blue-100 rounded-full">
                                        <Zap className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Data Downloaded</p>
                                <p className="text-4xl font-bold text-blue-600">{(totalBytes / (1024 * 1024)).toFixed(1)}<span className="text-xl">MB</span></p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-red-500 hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <AlertCircle className="w-10 h-10 text-red-600" />
                                    <div className="px-3 py-1 bg-red-100 rounded-full">
                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-1">High Risk</p>
                                <p className="text-4xl font-bold text-red-600">{highRiskDownloads}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-orange-500 hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <Shield className="w-10 h-10 text-orange-600" />
                                    <div className="px-3 py-1 bg-orange-100 rounded-full">
                                        <Eye className="w-4 h-4 text-orange-600" />
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Avg Risk Score</p>
                                <p className="text-4xl font-bold text-orange-600">{avgRiskScore}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-purple-500 hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <Activity className="w-10 h-10 text-purple-600" />
                                    <div className="px-3 py-1 bg-purple-100 rounded-full">
                                        <Zap className="w-4 h-4 text-purple-600" />
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Avg Request Rate</p>
                                <p className="text-4xl font-bold text-purple-600">{avgRequestRate}<span className="text-xl">/min</span></p>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Download Timeline */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-teal-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-teal-600" />
                                    Download Timeline
                                </h2>
                                <ResponsiveContainer width="100%" height={280}>
                                    <AreaChart data={dailyData}>
                                        <defs>
                                            <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #14b8a6', borderRadius: '12px' }} />
                                        <Area type="monotone" dataKey="downloads" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorDownloads)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Hourly Pattern */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-teal-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-cyan-600" />
                                    Hourly Download Pattern
                                </h2>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={hourlyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="hour" stroke="#6b7280" tick={{ fontSize: 12 }} />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #06b6d4', borderRadius: '12px' }} />
                                        <Bar dataKey="downloads" radius={[8, 8, 0, 0]}>
                                            {hourlyData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* File Size Trend */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-teal-100 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2 text-blue-600" />
                                File Size Trend (Last 30 Downloads)
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={fileSizeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="index" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #3b82f6', borderRadius: '12px' }} />
                                    <Line type="monotone" dataKey="size" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Risk Analysis Scatter */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-teal-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Terminal className="w-5 h-5 mr-2 text-purple-600" />
                                Risk Score vs Request Rate Analysis
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <ScatterChart>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="riskScore" stroke="#6b7280" name="Risk Score" />
                                    <YAxis dataKey="requestRate" stroke="#6b7280" name="Request Rate" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#fff', border: '2px solid #8b5cf6', borderRadius: '12px' }} />
                                    <Scatter name="Downloads" data={scatterData} fill="#8b5cf6">
                                        {scatterData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.riskScore > 0.7 ? '#ef4444' : entry.riskScore > 0.4 ? '#f59e0b' : '#10b981'} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Downloads Tab */}
                {activeTab === 'downloads' && (
                    <div>
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 shadow-xl text-white">
                                <FileDown className="w-12 h-12 mb-3 opacity-80" />
                                <p className="text-teal-100 text-sm mb-1">Total Files Downloaded</p>
                                <p className="text-5xl font-bold">{totalDownloads}</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl text-white">
                                <Package className="w-12 h-12 mb-3 opacity-80" />
                                <p className="text-blue-100 text-sm mb-1">Average File Size</p>
                                <p className="text-5xl font-bold">{totalDownloads > 0 ? ((totalBytes / totalDownloads) / 1024).toFixed(1) : 0}<span className="text-2xl">KB</span></p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-xl text-white">
                                <Zap className="w-12 h-12 mb-3 opacity-80" />
                                <p className="text-purple-100 text-sm mb-1">Peak Hour</p>
                                <p className="text-5xl font-bold">{peakHour}:00</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-teal-100 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <Filter className="w-5 h-5 mr-2 text-teal-600" />
                                    Filter Downloads
                                </h2>
                                <span className="text-sm text-gray-600">
                                    Showing {filteredLogs.length} of {eventLogs.length} downloads
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by file name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>

                                <select
                                    value={filterRisk}
                                    onChange={(e) => setFilterRisk(e.target.value)}
                                    className="px-4 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="all">All Risk Levels</option>
                                    <option value="Low">Low Risk</option>
                                    <option value="Medium">Medium Risk</option>
                                    <option value="High">High Risk</option>
                                </select>

                                <select
                                    value={filterThreat}
                                    onChange={(e) => setFilterThreat(e.target.value)}
                                    className="px-4 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="all">All Threat Types</option>
                                    <option value="Normal_Traffic">Normal Traffic</option>
                                    <option value="Credential_Theft">Credential Theft</option>
                                    <option value="DDoS_API_Flood">DDoS API Flood</option>
                                    <option value="Insider_Exfiltration">Insider Exfiltration</option>
                                </select>
                            </div>
                        </div>
                        {/* Download History Timeline */}
                        <div className="space-y-4">
                            {filteredLogs.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-xl">
                                    <FileDown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No downloads match your filters</p>
                                </div>
                            ) : (
                                filteredLogs.map((log, index) => {
                                    const riskColor = log.riskLevel === 'High' ? 'red' : log.riskLevel === 'Medium' ? 'orange' : 'green';
                                    const threatColor = THREAT_COLORS[log.predictedClass] || '#6b7280';
                                    
                                    return (
                                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4" style={{ borderLeftColor: threatColor }}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <FileDown className="w-6 h-6 text-teal-600" />
                                                        <h3 className="text-lg font-bold text-gray-800">{log.fileName}</h3>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Package className="w-4 h-4 text-blue-500" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">File Size</p>
                                                                <p className="text-sm font-semibold text-gray-700">{(log.bytesTransferred / 1024).toFixed(2)} KB</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-2">
                                                            <Clock className="w-4 h-4 text-purple-500" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">Time</p>
                                                                <p className="text-sm font-semibold text-gray-700">{log.hourOfDay}:00</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-2">
                                                            <Activity className="w-4 h-4 text-indigo-500" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">Request Rate</p>
                                                                <p className="text-sm font-semibold text-gray-700">{log.requestRatePerMin}/min</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-4 h-4 text-cyan-500" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">Date</p>
                                                                <p className="text-sm font-semibold text-gray-700">
                                                                    {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${riskColor}-100 text-${riskColor}-700 border border-${riskColor}-200`}>
                                                            {log.riskLevel} Risk
                                                        </span>
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${threatColor}20`, color: threatColor, border: `1px solid ${threatColor}` }}>
                                                            {log.predictedClass != null ? log.predictedClass.replace('_', ' ') : "Processing ur File"}
                                                        </span>
                                                        {log.mitigationTriggered === 1 && (
                                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center">
                                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                                Mitigation Active
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="ml-4 text-right">
                                                    <div className="mb-2">
                                                        <p className="text-xs text-gray-500 mb-1">Risk Score</p>
                                                        <div className="relative w-20 h-20">
                                                            <svg className="transform -rotate-90 w-20 h-20">
                                                                <circle cx="40" cy="40" r="32" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                                                                <circle 
                                                                    cx="40" 
                                                                    cy="40" 
                                                                    r="32" 
                                                                    stroke={log.riskScore > 0.7 ? '#ef4444' : log.riskScore > 0.4 ? '#f59e0b' : '#10b981'}
                                                                    strokeWidth="8" 
                                                                    fill="none"
                                                                    strokeDasharray={`${log.riskScore * 201} 201`}
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="text-lg font-bold" style={{ color: log.riskScore > 0.7 ? '#ef4444' : log.riskScore > 0.4 ? '#f59e0b' : '#10b981' }}>
                                                                    {(log.riskScore * 100).toFixed(0)}
                                                                </span>
                                                            </div>
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

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div>
                        {/* Security Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-white">
                                <CheckCircle2 className="w-12 h-12 mb-3 opacity-80" />
                                <p className="text-green-100 text-sm mb-1">Normal Traffic</p>
                                <p className="text-5xl font-bold">{normalTrafficCount}</p>
                                <p className="text-green-100 text-xs mt-2">{((normalTrafficCount / totalDownloads) * 100).toFixed(1)}% of total</p>
                            </div>

                            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 shadow-xl text-white">
                                <AlertCircle className="w-12 h-12 mb-3 opacity-80" />
                                <p className="text-red-100 text-sm mb-1">Credential Theft</p>
                                <p className="text-5xl font-bold">{credentialTheftCount}</p>
                                <p className="text-red-100 text-xs mt-2">{((credentialTheftCount / totalDownloads) * 100).toFixed(1)}% of total</p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 shadow-xl text-white">
                                <Zap className="w-12 h-12 mb-3 opacity-80" />
                                <p className="text-orange-100 text-sm mb-1">DDoS API Flood</p>
                                <p className="text-5xl font-bold">{ddosCount}</p>
                                <p className="text-orange-100 text-xs mt-2">{((ddosCount / totalDownloads) * 100).toFixed(1)}% of total</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 shadow-xl text-white">
                                <Shield className="w-12 h-12 mb-3 opacity-80" />
                                <p className="text-purple-100 text-sm mb-1">Insider Threat</p>
                                <p className="text-5xl font-bold">{insiderCount}</p>
                                <p className="text-purple-100 text-xs mt-2">{((insiderCount / totalDownloads) * 100).toFixed(1)}% of total</p>
                            </div>
                        </div>

                        {/* Security Score */}
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-teal-100 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Security Score</h2>
                                    <p className="text-gray-600">Overall security health based on download patterns</p>
                                </div>
                                <div className="relative w-32 h-32">
                                    <svg className="transform -rotate-90 w-32 h-32">
                                        <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                                        <circle 
                                            cx="64" 
                                            cy="64" 
                                            r="56" 
                                            stroke={securityScore >= 70 ? '#10b981' : securityScore >= 40 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth="12" 
                                            fill="none"
                                            strokeDasharray={`${(securityScore / 100) * 352} 352`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold" style={{ color: securityScore >= 70 ? '#10b981' : securityScore >= 40 ? '#f59e0b' : '#ef4444' }}>
                                            {securityScore}
                                        </span>
                                        <span className="text-xs text-gray-500">Score</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Threat Distribution Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Threat Type Distribution */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-teal-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Shield className="w-5 h-5 mr-2 text-teal-600" />
                                    Threat Distribution
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={threatData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {threatData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={THREAT_COLORS[entry.name] || '#6b7280'} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #14b8a6', borderRadius: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Risk Level Distribution */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-teal-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                                    Risk Level Distribution
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={riskData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #ef4444', borderRadius: '12px' }} />
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                            {riskData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.name === 'High' ? '#ef4444' : entry.name === 'Medium' ? '#f59e0b' : '#10b981'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Security Alerts */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-red-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                                Recent Security Alerts
                            </h2>
                            <div className="space-y-3">
                                {eventLogs
                                    .filter(log => log.riskLevel === 'High' || log.mitigationTriggered === 1)
                                    .slice(0, 5)
                                    .map((log, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                                    <AlertCircle className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{log.predictedClass != null ? log.predictedClass.replace('_', ' ') : "Processing ur File"}</p>
                                                    <p className="text-sm text-gray-600">{log.fileName}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
                                                    Risk: {(log.riskScore * 100).toFixed(0)}%
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                }
                                {eventLogs.filter(log => log.riskLevel === 'High' || log.mitigationTriggered === 1).length === 0 && (
                                    <div className="text-center py-8">
                                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                                        <p className="text-gray-600">No security alerts - All downloads are secure!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DevpAnalytics