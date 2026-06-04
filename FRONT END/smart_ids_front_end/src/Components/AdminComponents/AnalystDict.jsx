import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, BarChart3, LogOut, Database, Mail, Phone, MapPin, UserPlus, X, CheckCircle, AlertCircle } from 'lucide-react';

function AnalystDict() {
    const [currentPath, setCurrentPath] = useState('/analyst');
    const [scrolled, setScrolled] = useState(false);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [analysts, setAnalysts] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [availableDevelopers, setAvailableDevelopers] = useState([]);
    const [selectedDevelopers, setSelectedDevelopers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        developerEmails: []
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetchAnalysts();
        fetchDevelopers();
    }, []);

    const fetchAnalysts = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/analyst/getAllEmployees');
            const data = await response.json();
            setAnalysts(data);
        } catch (error) {
            console.error('Error fetching analysts:', error);
        }
    };

    const fetchDevelopers = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/devp/getAllEmployees');
            const data = await response.json();
            setDevelopers(data);
            // Filter developers where analystsAssigned is false
            const available = data.filter(dev => dev.analystsAssigned === false);
            setAvailableDevelopers(available);
        } catch (error) {
            console.error('Error fetching developers:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeveloperSelect = (e) => {
        const selectedEmail = e.target.value;
        if (selectedEmail && !selectedDevelopers.includes(selectedEmail) && selectedDevelopers.length < 3) {
            setSelectedDevelopers(prev => [...prev, selectedEmail]);
        }
    };

    const removeDeveloper = (emailToRemove) => {
        setSelectedDevelopers(prev => prev.filter(email => email !== emailToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const registrationData = {
            ...formData,
            developerEmails: selectedDevelopers
        };

        try {
            const response = await fetch('http://localhost:8082/api/analyst/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: '✅ Analyst registered successfully!' });
                setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    phoneNumber: '',
                    address: '',
                    developerEmails: []
                });
                setSelectedDevelopers([]);
                setTimeout(() => {
                    setShowRegistrationForm(false);
                    fetchAnalysts();
                    fetchDevelopers();
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.message || data || '❌ Registration failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Error connecting to server' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        setCurrentPath('/');
        window.location.href = '/';
    };

    const navItems = [
        { name: 'Home', path: '/adminDB', icon: Shield },
        { name: 'Developer Directory', path: '/developer', icon: Users },
        { name: 'Analyst Directory', path: '/analyst', icon: Database },
        { name: 'View Reports', path: '/adnreports', icon: FileText },
        { name: 'Analytics', path: '/adnanalytics', icon: BarChart3 }
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
                                        onClick={() => { setCurrentPath(item.path); window.location.href = item.path }}
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

            {/* Main Content */}
            <div className='pt-24 px-6 pb-12'>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                                Analyst Directory
                            </h1>
                            <p className="text-gray-600">Manage and view all security analysts</p>
                        </div>
                        <button
                            onClick={() => setShowRegistrationForm(true)}
                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <UserPlus className="w-5 h-5" />
                            <span className="font-medium">Register Analyst</span>
                        </button>
                    </div>

                    {/* Analysts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analysts.map((analyst, index) => (
                            <div
                                key={analyst.id || index}
                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                {analyst.fullName}
                                            </h3>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                analyst.active 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {analyst.active ? '● Active' : '● Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <Mail className="w-4 h-4 text-violet-500" />
                                            <span className="text-sm">{analyst.email}</span>
                                        </div>
                                        {analyst.phoneNumber && (
                                            <div className="flex items-center space-x-3 text-gray-600">
                                                <Phone className="w-4 h-4 text-fuchsia-500" />
                                                <span className="text-sm">{analyst.phoneNumber}</span>
                                            </div>
                                        )}
                                        {analyst.address && (
                                            <div className="flex items-center space-x-3 text-gray-600">
                                                <MapPin className="w-4 h-4 text-teal-500" />
                                                <span className="text-sm">{analyst.address}</span>
                                            </div>
                                        )}
                                        {analyst.developers && analyst.developers.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-xs font-semibold text-gray-500 mb-2">
                                                    ASSIGNED DEVELOPERS ({analyst.developers.length})
                                                </p>
                                                <div className="space-y-1">
                                                    {analyst.developers.map((dev, idx) => (
                                                        <div key={idx} className="text-xs text-gray-600 flex items-center space-x-2">
                                                            <Users className="w-3 h-3 text-purple-400" />
                                                            <span>{dev.fullName}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {analysts.length === 0 && (
                        <div className="text-center py-12">
                            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No analysts registered yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Registration Modal */}
            {showRegistrationForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Register New Analyst</h2>
                                <p className="text-violet-100 text-sm">Fill in the details below</p>
                            </div>
                            <button
                                onClick={() => setShowRegistrationForm(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div onSubmit={handleSubmit} className="p-6 space-y-6">
                            {message.text && (
                                <div className={`flex items-center space-x-3 p-4 rounded-lg ${
                                    message.type === 'success' 
                                        ? 'bg-green-50 text-green-700 border border-green-200' 
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                    {message.type === 'success' ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5" />
                                    )}
                                    <span className="text-sm font-medium">{message.text}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    placeholder="123 Main St, City, State"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Assign Developers (Max 3)
                                </label>
                                <select
                                    onChange={handleDeveloperSelect}
                                    disabled={selectedDevelopers.length >= 3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all disabled:bg-gray-100"
                                >
                                    <option value="">Select a developer...</option>
                                    {availableDevelopers
                                        .filter(dev => !selectedDevelopers.includes(dev.email))
                                        .map((dev) => (
                                            <option key={dev.id} value={dev.email}>
                                                {dev.fullName} ({dev.email})
                                            </option>
                                        ))
                                    }
                                </select>
                                <p className="text-xs text-gray-500 mt-2">
                                    {selectedDevelopers.length}/3 developers selected
                                </p>
                            </div>

                            {selectedDevelopers.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-700">Selected Developers:</p>
                                    {selectedDevelopers.map((email) => {
                                        const dev = availableDevelopers.find(d => d.email === email);
                                        return (
                                            <div key={email} className="flex items-center justify-between bg-violet-50 px-4 py-3 rounded-lg border border-violet-200">
                                                <div className="flex items-center space-x-3">
                                                    <Users className="w-4 h-4 text-violet-600" />
                                                    <span className="text-sm text-gray-700">{dev?.fullName || email}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDeveloper(email)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowRegistrationForm(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button onClick={handleSubmit}
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Registering...' : 'Register Analyst'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnalystDict;