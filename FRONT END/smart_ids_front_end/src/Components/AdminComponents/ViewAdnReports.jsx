import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, BarChart3, LogOut, Database, Sparkles, Loader2, CheckCircle, AlertTriangle, Clock, Filter, Search, Download, RefreshCw, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ViewAdnReports() {
    const [currentPath, setCurrentPath] = useState('/adnreports');
    const [scrolled, setScrolled] = useState(false);
    const [eventLogs, setEventLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('all');
    const [filterThreat, setFilterThreat] = useState('all');
    const navigate = useNavigate();
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        fetchEventLogs();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, filterRisk, filterThreat, eventLogs]);

    const fetchEventLogs = () => {
        setLoading(true);
        fetch("http://localhost:8082/api/eventlogs/all")
            .then(res => res.json())
            .then(data => {
                setEventLogs(data);
                setFilteredLogs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching event logs:", err);
                setLoading(false);
            });
    };

    const applyFilters = () => {
        let filtered = [...eventLogs];

        if (searchTerm) {
            filtered = filtered.filter(log => 
                log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    const handleNavigation = (path) => {
        setCurrentPath(path);
        navigate(path);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        setCurrentPath('/');
        navigate('/');
    };

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setMessage('');
        try {
            const response = await fetch("http://localhost:8082/api/ids/analyze-all", {
                method: "POST"
            });
            const result = await response.text();
            setMessage(result);
            setTimeout(() => fetchEventLogs(), 2000);
        } catch (err) {
            setMessage("❌ Error analyzing event logs. Please try again.");
        }
        setAnalyzing(false);
    };

    const navItems = [
        { name: 'Home', path: '/adminDB', icon: Shield },
        { name: 'Developer Directory', path: '/developer', icon: Users },
        { name: 'Analyst Directory', path: '/analyst', icon: Database },
        { name: 'View Reports', path: '/adnreports', icon: FileText },
        { name: 'Analytics', path: '/adnanalytics', icon: BarChart3 }
    ];

    const THREAT_COLORS = {
        'Normal_Traffic': 'bg-green-100 text-green-700 border-green-300',
        'Credential_Theft': 'bg-red-100 text-red-700 border-red-300',
        'DDoS_API_Flood': 'bg-orange-100 text-orange-700 border-orange-300',
        'Insider_Exfiltration': 'bg-purple-100 text-purple-700 border-purple-300'
    };

    const RISK_COLORS = {
        'Low': 'bg-green-500',
        'Medium': 'bg-yellow-500',
        'High': 'bg-red-500'
    };

    const stats = {
        total: eventLogs.length,
        highRisk: eventLogs.filter(log => log.riskLevel === 'High').length,
        threats: eventLogs.filter(log => log.predictedClass !== 'Normal_Traffic').length,
        avgRisk: (eventLogs.reduce((sum, log) => sum + (log.riskScore || 0), 0) / eventLogs.length).toFixed(2)
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-4"></div>
                    <p className="text-violet-600 font-medium text-lg">Loading Reports...</p>
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
            <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                            Security Event Reports
                        </h1>
                        <p className="text-gray-600">Monitor and analyze all security events in real-time</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={fetchEventLogs}
                            className="flex items-center space-x-2 px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-lg transition-all duration-300"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span className="text-sm font-medium">Refresh</span>
                        </button>
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 ${analyzing
                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white'
                                }`}
                        >
                            {analyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Analyze All</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
                        <div className="flex items-center justify-between mb-2">
                            <FileText className="w-8 h-8 text-violet-600" />
                            <div className="px-3 py-1 bg-violet-100 rounded-full">
                                <TrendingUp className="w-4 h-4 text-violet-600" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">Total Events</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100">
                        <div className="flex items-center justify-between mb-2">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                            <div className="px-3 py-1 bg-red-100 rounded-full">
                                <TrendingUp className="w-4 h-4 text-red-600" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">High Risk Events</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.highRisk}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
                        <div className="flex items-center justify-between mb-2">
                            <Shield className="w-8 h-8 text-orange-600" />
                            <div className="px-3 py-1 bg-orange-100 rounded-full">
                                <TrendingUp className="w-4 h-4 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">Threat Detections</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.threats}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                            <BarChart3 className="w-8 h-8 text-blue-600" />
                            <div className="px-3 py-1 bg-blue-100 rounded-full">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">Avg Risk Score</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.avgRisk}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <Filter className="w-5 h-5 mr-2 text-violet-600" />
                            Filter & Search
                        </h2>
                        <span className="text-sm text-gray-600">
                            Showing {filteredLogs.length} of {eventLogs.length} events
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by email, file, or event..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>

                        {/* Risk Filter */}
                        <select
                            value={filterRisk}
                            onChange={(e) => setFilterRisk(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                            <option value="all">All Risk Levels</option>
                            <option value="Low">Low Risk</option>
                            <option value="Medium">Medium Risk</option>
                            <option value="High">High Risk</option>
                        </select>

                        {/* Threat Filter */}
                        <select
                            value={filterThreat}
                            onChange={(e) => setFilterThreat(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                            <option value="all">All Threat Types</option>
                            <option value="Normal_Traffic">Normal Traffic</option>
                            <option value="Credential_Theft">Credential Theft</option>
                            <option value="DDoS_API_Flood">DDoS API Flood</option>
                            <option value="Insider_Exfiltration">Insider Exfiltration</option>
                        </select>
                    </div>
                </div>

                {/* Event Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLogs.length === 0 ? (
                        <div className="col-span-full text-center py-20">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No events found matching your filters</p>
                        </div>
                    ) : (
                        filteredLogs.map((log) => {
                            const threatClass = log.predictedClass || 'Unknown';
                            const isNormal = threatClass === 'Normal_Traffic';
                            const threatColor = THREAT_COLORS[threatClass] || 'bg-gray-100 text-gray-700 border-gray-300';
                            
                            return (
                                <div key={log.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 relative overflow-hidden">
                                    {/* Risk Indicator Bar */}
                                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${RISK_COLORS[log.riskLevel] || 'bg-gray-400'}`}></div>
                                    
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <div className={`p-2 rounded-lg ${isNormal ? 'bg-green-100' : 'bg-red-100'}`}>
                                                {isNormal ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Event ID</p>
                                                <p className="text-sm font-bold text-gray-800">#{log.id}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${threatColor}`}>
                                            {threatClass.replace('_', ' ')}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="mb-4 pb-4 border-b border-gray-100">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Users className="w-4 h-4 text-violet-600" />
                                            <span className="text-sm font-semibold text-gray-800">{log.userEmail}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Database className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs text-gray-600">{log.userRole}</span>
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Event Type</span>
                                            <span className="text-sm font-medium text-gray-800">{log.eventName}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Data Size</span>
                                            <span className="text-sm font-medium text-gray-800">
                                                {(log.bytesTransferred / 1024).toFixed(2)} KB
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Risk Score</span>
                                            <span className="text-sm font-bold text-orange-600">{log.riskScore}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Request Rate</span>
                                            <span className="text-sm font-medium text-gray-800">{log.requestRatePerMin}/min</span>
                                        </div>
                                    </div>

                                    {/* File Name */}
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                        <p className="text-xs text-gray-500 mb-1">File Name</p>
                                        <p className="text-xs text-gray-800 truncate font-medium">{log.fileName}</p>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                            log.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                                            log.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {log.riskLevel}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Message Banner */}
                {message && (
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                        <div className="bg-white border-2 border-violet-300 rounded-2xl shadow-2xl px-6 py-4 flex items-center space-x-3">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            <p className="text-violet-700 font-semibold">{message}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewAdnReports;