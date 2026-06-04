import React, { useState, useEffect } from 'react';
import { Database, Home, FilePlus, FolderSearch, BarChart3, LogOut, Upload, FileText, Shield, Activity, Globe, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

function UploadFiles() {
    const [currentPath, setCurrentPath] = useState('/addDocs');
    const [scrolled, setScrolled] = useState(false);

    const analystEmail = sessionStorage.getItem("analystEmail");

    const [requestRatePerMin, setRequestRatePerMin] = useState(30);
    const [riskScore, setRiskScore] = useState(0.5);
    const [usualIP, setUsualIP] = useState(1);
    const [usualBucket, setUsualBucket] = useState(1);
    const [unusualTime, setUnusualTime] = useState(0);
    const [highVolume, setHighVolume] = useState(0);
    const [crossBucketFlow, setCrossBucketFlow] = useState(1);
    const [isNormalPattern, setIsNormalPattern] = useState(1);
    const [mitigationTriggered, setMitigationTriggered] = useState(0);
    const [geoLocationCountry, setGeoLocationCountry] = useState(1);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        setCurrentPath('/');
        window.location.href = '/';
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage("Please select a PDF file.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("analystEmail", analystEmail);
        formData.append("requestRatePerMin", requestRatePerMin);
        formData.append("riskScore", riskScore);
        formData.append("usualIP", usualIP);
        formData.append("usualBucket", usualBucket);
        formData.append("unusualTime", unusualTime);
        formData.append("highVolume", highVolume);
        formData.append("crossBucketFlow", crossBucketFlow);
        formData.append("isNormalPattern", isNormalPattern);
        formData.append("mitigationTriggered", mitigationTriggered);
        formData.append("geoLocationCountry", geoLocationCountry);

        try {
            const res = await fetch("http://localhost:8082/api/files/upload", {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(`✅ ${data.message}\n📄 File: ${data.fileName}`);
            } else {
                setMessage(`❌ ${data.error || "File upload failed."}`);
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Network or server error while uploading file.");
        } finally {
            setIsUploading(false);
            setTimeout(() => setMessage(""), 5000);
        }
    };


    const navItems = [
        { name: 'Home', path: '/analystDB', icon: Home },
        { name: 'Add Documents', path: '/addDocs', icon: FilePlus },
        { name: 'View Documents', path: '/viewDocs', icon: FolderSearch },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 }
    ];

    const binaryOptions = [
        { label: "Usual IP", state: usualIP, setter: setUsualIP, icon: Shield, color: "indigo" },
        { label: "Usual Bucket", state: usualBucket, setter: setUsualBucket, icon: Database, color: "purple" },
        { label: "Unusual Time", state: unusualTime, setter: setUnusualTime, icon: Clock, color: "pink" },
        { label: "High Volume", state: highVolume, setter: setHighVolume, icon: TrendingUp, color: "blue" },
        { label: "Cross Bucket Flow", state: crossBucketFlow, setter: setCrossBucketFlow, icon: Activity, color: "violet" },
        { label: "Is Normal Pattern", state: isNormalPattern, setter: setIsNormalPattern, icon: CheckCircle, color: "green" },
        { label: "Mitigation Triggered", state: mitigationTriggered, setter: setMitigationTriggered, icon: AlertTriangle, color: "orange" },
        { label: "Geo Location Country", state: geoLocationCountry, setter: setGeoLocationCountry, icon: Globe, color: "teal" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/80 backdrop-blur-lg shadow-xl shadow-purple-200/50'
                : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Database className="w-10 h-10 text-indigo-600" />
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
                                        onClick={() => { setCurrentPath(item.path); window.location.href = item.path; }}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-300/50'
                                            : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                                            }`}>
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg transition-all duration-300 border border-rose-300">
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-28 px-6 pb-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                            <Upload className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Upload Security Document
                        </h1>
                        <p className="text-gray-600 text-lg">Upload PDF files with security metrics and analytics data</p>
                    </div>

                    {/* Success/Error Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl border-2 flex items-start space-x-3 ${message.includes('failed') || message.includes('Please')
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-green-50 border-green-200 text-green-700'
                            } animate-pulse`}>
                            {message.includes('failed') || message.includes('Please') ? (
                                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            ) : (
                                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            )}
                            <p className="font-medium">{message}</p>
                        </div>
                    )}

                    {/* Upload Form */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                            <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                                <FileText className="w-6 h-6" />
                                <span>Document Upload Form</span>
                            </h2>
                            <p className="text-indigo-100 mt-1">Complete all fields to upload your security document</p>
                        </div>

                        <div className="p-8">
                            <div className="space-y-6">
                                {/* Analyst Email */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Analyst Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="analyst@company.com"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                                        value={analystEmail}
                                        style={{ cursor: "no-drop" }}
                                        disabled
                                    />
                                </div>

                                {/* Metrics Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Request Rate */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                                            <Activity className="w-4 h-4 text-indigo-600" />
                                            <span>Request Rate (per min) *</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="30"
                                            step="0.1"
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                                            value={requestRatePerMin}
                                            onChange={(e) => setRequestRatePerMin(e.target.value)}
                                        />
                                    </div>

                                    {/* Risk Score */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>Risk Score *</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0.5"
                                            step="0.01"
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all outline-none"
                                            value={riskScore}
                                            onChange={(e) => setRiskScore(e.target.value)}
                                        />
                                        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                                            <span>Low Risk (0)</span>
                                            <span>High Risk (1)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Indicators Section */}
                                <div className="border-t-2 border-gray-100 pt-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                                        <Shield className="w-5 h-5 text-indigo-600" />
                                        <span>Security Indicators</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {binaryOptions.map((item, idx) => {
                                            const Icon = item.icon;
                                            return (
                                                <div key={idx} className={`p-4 border-2 rounded-xl transition-all ${item.state == 1
                                                        ? `bg-${item.color}-50 border-${item.color}-300`
                                                        : 'bg-gray-50 border-gray-200'
                                                    }`}>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                                                        <Icon className={`w-4 h-4 text-${item.color}-600`} />
                                                        <span>{item.label}</span>
                                                    </label>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => item.setter(0)}
                                                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${item.state == 0
                                                                    ? 'bg-red-500 text-white shadow-lg'
                                                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                                }`}
                                                        >
                                                            No
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => item.setter(1)}
                                                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${item.state == 1
                                                                    ? 'bg-green-500 text-white shadow-lg'
                                                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                                }`}
                                                        >
                                                            Yes
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* File Upload Section */}
                                <div className="border-t-2 border-gray-100 pt-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                                        <FileText className="w-4 h-4 text-indigo-600" />
                                        <span>Upload PDF Document *</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            required
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="w-full px-4 py-4 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:font-medium hover:border-indigo-500 transition-all"
                                        />
                                        {file && (
                                            <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg flex items-center space-x-3">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <span className="text-sm text-green-700 font-medium">{file.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isUploading}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            <span>Upload Document</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-indigo-100">
                            <Shield className="w-8 h-8 text-indigo-600 mb-2" />
                            <h3 className="font-bold text-gray-800">Secure Upload</h3>
                            <p className="text-sm text-gray-600">Your files are encrypted and secure</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-purple-100">
                            <Activity className="w-8 h-8 text-purple-600 mb-2" />
                            <h3 className="font-bold text-gray-800">Real-time Analysis</h3>
                            <p className="text-sm text-gray-600">Instant security metrics processing</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-pink-100">
                            <CheckCircle className="w-8 h-8 text-pink-600 mb-2" />
                            <h3 className="font-bold text-gray-800">Validated Data</h3>
                            <p className="text-sm text-gray-600">All inputs are validated automatically</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadFiles;