import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, BarChart3, LogOut, Database, Plus, Mail, Phone, MapPin, Briefcase, Eye, EyeOff, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function DeveloperDict() {
    const [currentPath, setCurrentPath] = useState('/developer');
    const [scrolled, setScrolled] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingDevs, setLoadingDevs] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [developers, setDevelopers] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        designation: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetchDevelopers();
    }, []);

    const fetchDevelopers = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/devp/getAllEmployees');
            if (response.ok) {
                const data = await response.json();
                setDevelopers(data);
                console.log(data);
                
            }
        } catch (error) {
            console.error('Error fetching developers:', error);
        } finally {
            setLoadingDevs(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        setCurrentPath('/');
        navigate('/');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:8082/api/devp/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: '✓ Developer registered successfully!' });
                setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    phoneNumber: '',
                    address: '',
                    designation: ''
                });
                setTimeout(() => {
                    setShowForm(false);
                    fetchDevelopers();
                }, 1500);
            } else {
                const error = await response.text();
                setMessage({ type: 'error', text: error || 'Registration failed. Please try again.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
        } finally {
            setLoading(false);
        }
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
            {/* Navbar - SAME AS BEFORE */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
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
                                        onClick={() => { setCurrentPath(item.path); navigate(item.path) }}
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
            <div className='relative pt-24 pb-12 px-6'>
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-block p-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl mb-4 shadow-lg shadow-violet-300/50">
                            <Users className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
                            Developer Directory
                        </h2>
                        <p className="text-gray-600 text-lg">Register and manage development team members</p>
                    </div>

                    {/* Registration Form */}
                    <div className="mb-12">
                        {!showForm ? (
                            <button
                                onClick={() => setShowForm(true)}
                                className="mx-auto flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl shadow-xl shadow-violet-300/50 hover:shadow-2xl hover:shadow-violet-400/50 transform hover:scale-105 transition-all duration-300"
                            >
                                <Plus className="w-6 h-6" />
                                <span className="text-lg font-semibold">Register New Developer</span>
                            </button>
                        ) : (
                            <div className="bg-white rounded-3xl shadow-2xl shadow-purple-200/50 p-8 border border-purple-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                        Developer Registration
                                    </h3>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {message.text && (
                                    <div className={`mb-6 p-4 rounded-xl ${
                                        message.type === 'success' 
                                            ? 'bg-green-50 text-green-700 border border-green-200' 
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                        {message.text}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">Designation</label>
                                            <input
                                                type="text"
                                                name="designation"
                                                value={formData.designation}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="Senior Developer"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="123 Main St, City"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader className="w-5 h-5 animate-spin" />
                                                    <span>Registering...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    <span>Register Developer</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Developers List */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Registered Developers ({developers.length})
                            </h3>
                        </div>

                        {loadingDevs ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader className="w-8 h-8 animate-spin text-violet-500" />
                            </div>
                        ) : developers.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No developers registered yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {developers.map((dev) => (
                                    <div
                                        key={dev.id}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 transform hover:scale-105"
                                    >
                                        <div className="h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                                        <div className="p-6">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                                    {dev.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-800">{dev.fullName}</h4>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                        dev.active 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {dev.active ? '● Active' : '● Inactive'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3 text-gray-600">
                                                    <Briefcase className="w-4 h-4 text-violet-500" />
                                                    <span className="text-sm">{dev.designation}</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-gray-600">
                                                    <Mail className="w-4 h-4 text-violet-500" />
                                                    <span className="text-sm truncate">{dev.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-gray-600">
                                                    <Phone className="w-4 h-4 text-violet-500" />
                                                    <span className="text-sm">{dev.phoneNumber}</span>
                                                </div>
                                                <div className="flex items-start space-x-3 text-gray-600">
                                                    <MapPin className="w-4 h-4 text-violet-500 mt-1" />
                                                    <span className="text-sm">{dev.address}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-xs text-gray-400">ID: #{dev.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeveloperDict;