import React, { useEffect, useState } from 'react';
import { Shield, Zap, Brain, Lock, Eye, TrendingUp, CheckCircle, Users, Cloud, AlertTriangle, Activity, Server, Database, Network } from 'lucide-react';

const SmartIDSHomepage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.aos-init').forEach(el => observer.observe(el));

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'services', 'features', 'about'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-gray-800 overflow-x-hidden">
      <style>{`
        .aos-init { opacity: 0; transform: translateY(50px); transition: opacity 1s ease, transform 1s ease; }
        .aos-animate { opacity: 1; transform: translateY(0); }
        .gradient-text { background: linear-gradient(135deg, #059669 0%, #0891b2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .bg-cyber { background-image: url('https://cf-assets.www.cloudflare.com/zkvhlag99gkb/1aRh3bYrMalEcfeBy9hvbT/9a6b9404cc7ce952904f0688274cd76e/image1-21.png'); background-size: cover; background-position: center; background-attachment: fixed; }
        
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-30px) rotate(5deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        @keyframes slideInLeft { from { transform: translateX(-100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(5, 150, 105, 0.3), 0 0 40px rgba(5, 150, 105, 0.2); } 50% { box-shadow: 0 0 40px rgba(5, 150, 105, 0.6), 0 0 80px rgba(5, 150, 105, 0.4); } }
        @keyframes wave { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        
        .float-animation { animation: float 6s ease-in-out infinite; }
        .pulse-animation { animation: pulse 3s ease-in-out infinite; }
        .slide-in-left { animation: slideInLeft 1s ease-out; }
        .slide-in-right { animation: slideInRight 1s ease-out; }
        .rotate-animation { animation: rotate 20s linear infinite; }
        .glow-animation { animation: glow 2s ease-in-out infinite; }
        
        .hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
        .parallelogram { transform: skewY(-3deg); }
        .diagonal-line { background: linear-gradient(135deg, transparent 48%, #059669 48%, #059669 52%, transparent 52%); }
        
        .service-blob { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transition: all 0.5s ease; }
        .service-blob:hover { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; transform: scale(1.05); }
        
        .wave-bg { position: relative; overflow: hidden; }
        .wave-bg::before { content: ''; position: absolute; width: 200%; height: 100%; background: linear-gradient(90deg, transparent, rgba(5, 150, 105, 0.1), transparent); animation: wave 3s linear infinite; }
        
        .mesh-gradient { background: radial-gradient(circle at 20% 50%, rgba(5, 150, 105, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(8, 145, 178, 0.15) 0%, transparent 50%); }
      `}</style>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-xl' : 'bg-white/70 backdrop-blur-sm'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="./Logo.png" alt="Smart IDS Logo" className="h-14 w-14 object-contain float-animation" onError={(e) => e.target.style.display = 'none'} />
              <span className="text-3xl font-bold gradient-text">Smart IDS</span>
            </div>
            
            <div className="hidden md:flex space-x-8 items-center">
              {['Home', 'Services', 'Features', 'About'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`relative px-4 py-2 transition-all duration-300 font-semibold text-lg ${
                    activeSection === item.toLowerCase() ? 'text-emerald-600 scale-110' : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  {item}
                  {activeSection === item.toLowerCase() && (
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></span>
                  )}
                </button>
              ))}
              <button
                onClick={() => window.location.href = '/login'}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-2xl glow-animation"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-cyber overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-teal-800/70 to-cyan-900/80"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="aos-init">
              <div className="inline-block mb-6 px-6 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full text-emerald-300 font-semibold">
                🚀 Next-Gen Cloud Security
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight text-white">
                <span className="inline-block slide-in-left">AI-Driven</span>
                <br />
                <span className="inline-block slide-in-right bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Intrusion Detection
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-emerald-100 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
                Protect your cloud infrastructure with <span className="font-bold text-cyan-300">Light Gradient Boosting Machine</span>. 
                Real-time threat detection in <span className="font-bold text-emerald-300">25ms</span>.
              </p>
              
              <div className="flex flex-wrap gap-6 justify-center mb-16">
                <button
                  onClick={() => scrollToSection('services')}
                  className="group px-10 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold text-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 flex items-center space-x-3"
                >
                  <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>Start Protection</span>
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="group px-10 py-5 border-3 border-emerald-400 text-white rounded-full font-bold text-lg hover:bg-emerald-400/20 transition-all duration-300 backdrop-blur-sm flex items-center space-x-3"
                >
                  <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Explore AI</span>
                </button>
              </div>
              
              {/* Floating stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  { value: '99.7%', label: 'Accuracy Rate', icon: <CheckCircle className="w-8 h-8" />, delay: '0s' },
                  { value: '25ms', label: 'Detection Speed', icon: <Zap className="w-8 h-8" />, delay: '0.2s' },
                  { value: '24/7', label: 'Active Protection', icon: <Shield className="w-8 h-8" />, delay: '0.4s' }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-white/10 backdrop-blur-xl border-2 border-emerald-400/40 rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 hover:scale-110 hover:rotate-2"
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className="text-emerald-300 mb-4 group-hover:scale-125 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="text-5xl font-black bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-emerald-200 font-semibold">{stat.label}</div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Organic Flow */}
      <section id="services" className="py-32 bg-gradient-to-br from-white via-emerald-50/30 to-cyan-50/30 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 aos-init">
            <div className="inline-block px-6 py-2 bg-emerald-100 rounded-full text-emerald-700 font-bold mb-4">
              ⚡ OUR CAPABILITIES
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-gray-900">
              Security <span className="gradient-text">Services</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive protection powered by advanced AI
            </p>
          </div>
          
          {/* Organic flowing services */}
          <div className="space-y-32">
            {[
              {
                icon: <Shield className="w-20 h-20" />,
                title: "Real-Time Threat Detection",
                description: "Our advanced ST-GNN models continuously monitor AWS S3, instantly detecting credential theft, insider threats, and zero-day attacks with millisecond precision.",
                features: ["Credential Compromise Detection", "Insider Threat Analysis", "Zero-Day Exploit Identification"],
                position: 'left',
                color: 'emerald'
              },
              {
                icon: <Brain className="w-20 h-20" />,
                title: "AI-Powered Intelligence",
                description: "Transformer-based models learn and adapt to user behavior patterns across time and geography, creating a dynamic security baseline that evolves with your infrastructure.",
                features: ["Behavioral Pattern Learning", "Geographic Anomaly Detection", "Temporal Sequence Analysis"],
                position: 'right',
                color: 'cyan'
              },
              {
                icon: <Zap className="w-20 h-20" />,
                title: "Automated Response System",
                description: "Lightning-fast mitigation integrates seamlessly with AWS Lambda, IAM, and WAF to neutralize threats before data loss occurs, with zero human intervention required.",
                features: ["AWS Lambda Integration", "Instant IAM Revocation", "Real-time IP Blocking"],
                position: 'left',
                color: 'teal'
              }
            ].map((service, index) => (
              <div key={index} className="aos-init" style={{ transitionDelay: `${index * 200}ms` }}>
                <div className={`flex flex-col lg:flex-row items-center gap-16 ${service.position === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Content Side */}
                  <div className="flex-1 space-y-6">
                    <div className={`inline-flex p-6 bg-gradient-to-br from-${service.color}-500 to-${service.color}-600 text-white rounded-3xl shadow-2xl transform hover:rotate-6 transition-all duration-500 service-blob`}>
                      {service.icon}
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="space-y-4 pt-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-4 group">
                          <div className={`mt-1 p-2 bg-${service.color}-100 rounded-lg group-hover:scale-110 transition-transform`}>
                            <CheckCircle className={`w-5 h-5 text-${service.color}-600`} />
                          </div>
                          <span className="text-lg text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Side */}
                  <div className="flex-1">
                    <div className={`relative h-96 bg-gradient-to-br from-${service.color}-100 to-${service.color}-200 rounded-[4rem] overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-${service.color}-300 opacity-30 rotate-animation`}>
                          {React.cloneElement(service.icon, { className: 'w-64 h-64' })}
                        </div>
                      </div>
                      {/* Animated circles */}
                      <div className={`absolute top-10 right-10 w-32 h-32 bg-${service.color}-300/30 rounded-full pulse-animation`}></div>
                      <div className={`absolute bottom-10 left-10 w-24 h-24 bg-${service.color}-400/30 rounded-full pulse-animation`} style={{ animationDelay: '1s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Services - Floating Cards */}
          <div className="mt-32 aos-init">
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { icon: <Cloud className="w-16 h-16" />, title: "Cloud-Native", desc: "Built for AWS, Azure, GCP", color: 'emerald' },
                { icon: <Eye className="w-16 h-16" />, title: "Zero-Trust", desc: "Continuous verification", color: 'cyan' },
                { icon: <TrendingUp className="w-16 h-16" />, title: "Auto-Adaptive", desc: "Federated learning", color: 'teal' }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`group relative text-center p-10 bg-gradient-to-br from-white to-${item.color}-50 rounded-[3rem] shadow-xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-3 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className={`relative inline-flex p-6 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 text-white rounded-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    {item.icon}
                  </div>
                  <h4 className="relative text-2xl font-black text-gray-900 mb-3">{item.title}</h4>
                  <p className="relative text-lg text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Interactive Grid */}
      <section id="features" className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 aos-init">
            <div className="inline-block px-6 py-2 bg-cyan-100 rounded-full text-cyan-700 font-bold mb-4">
              🧠 ADVANCED TECHNOLOGY
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-gray-900">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade capabilities powered by cutting-edge AI
            </p>
          </div>

          {/* Hexagonal Feature Grid */}
          <div className="space-y-20">
            {[
              {
                category: "Multi-Layer Protection",
                icon: <Lock className="w-16 h-16" />,
                items: [
                  { icon: <Network />, title: "Light Gradient Boosting Machine", desc: "Decision tree-based ensemble model" },
                  { icon: <Brain />, title: "Transformer Encoders", desc: "Contextual understanding" },
                  { icon: <Activity />, title: "Behavioral Detection", desc: "Time-window anomalies" },
                  { icon: <Database />, title: "Topology Analysis", desc: "Threat correlation" }
                ]
              },
              {
                category: "Threat Intelligence",
                icon: <AlertTriangle className="w-16 h-16" />,
                items: [
                  { icon: <Shield />, title: "Credential Protection", desc: "Theft detection" },
                  { icon: <Eye />, title: "Insider Monitoring", desc: "Data exfiltration prevention" },
                  { icon: <Zap />, title: "DDoS Mitigation", desc: "Attack identification" },
                  { icon: <Lock />, title: "Zero-Day Defense", desc: "Pattern learning" }
                ]
              }
            ].map((section, sIdx) => (
              <div key={sIdx} className="aos-init" style={{ transitionDelay: `${sIdx * 200}ms` }}>
                <div className="text-center mb-12">
                  <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full shadow-xl">
                    {section.icon}
                    <span className="text-2xl font-black">{section.category}</span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 overflow-hidden border-2 border-transparent hover:border-emerald-300"
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative">
                        <div className="inline-flex p-4 bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-600 rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          {React.cloneElement(item.icon, { className: 'w-10 h-10' })}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stats Dashboard */}
          <div className="mt-32 aos-init">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[4rem] p-12 shadow-2xl">
              <div className="grid md:grid-cols-4 gap-10 text-center">
                {[
                  { value: '3', label: 'User Modules', sublabel: 'Admin • Developer • Analyst', icon: <Users /> },
                  { value: '5', label: 'ML Models', sublabel: 'LightGBM • CNN • LSTM • IF • GNN', icon: <Brain /> },
                  { value: '3', label: 'Datasets', sublabel: 'NSL-KDD • CICIDS2017 • Custom', icon: <Database /> },
                  { value: '∞', label: 'Scalability', sublabel: 'Auto-adaptive learning', icon: <TrendingUp /> }
                ].map((stat, idx) => (
                  <div key={idx} className="group p-8 bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-500 transform hover:scale-110">
                    <div className="text-emerald-400 group-hover:text-white mb-4 group-hover:scale-125 transition-transform">
                      {React.cloneElement(stat.icon, { className: 'w-12 h-12 mx-auto' })}
                    </div>
                    <div className="text-6xl font-black text-white mb-2">{stat.value}</div>
                    <div className="text-emerald-400 group-hover:text-white font-bold text-lg mb-2">{stat.label}</div>
                    <div className="text-gray-400 group-hover:text-gray-200 text-sm">{stat.sublabel}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Enhanced with Background Image */}
      <section id="about" className="relative min-h-screen py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://media.licdn.com/dms/image/v2/C5612AQEZGS4juHU6_g/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520138609984?e=2147483647&v=beta&t=4YFE0H9Bs98--GC4xjI2WLxT9gKIY1bx3IKikEonbsM')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-emerald-900/90 to-cyan-900/95"></div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 aos-init">
            <div className="inline-flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl border-2 border-emerald-400/30 rounded-full text-emerald-300 font-bold mb-8 shadow-2xl">
              <Shield className="w-6 h-6" />
              <span className="text-xl">ABOUT SMART IDS</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                Redefining Cybersecurity
              </span>
            </h2>
            <p className="text-2xl text-emerald-100 max-w-4xl mx-auto leading-relaxed">
              Where artificial intelligence meets enterprise security – protecting the world's most critical infrastructure
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            
            {/* Left Column - Story & Stats */}
            <div className="space-y-8 aos-init">
              {/* Mission Statement */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-2xl p-10 rounded-[3rem] border-2 border-emerald-400/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white">Our Mission</h3>
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    Smart IDS harnesses the power of <span className="text-emerald-400 font-bold">Light Gradient Boosting Machine based on Decision Tree</span> to deliver 
                    unparalleled threat detection. We don't just monitor – we <span className="text-cyan-400 font-bold">predict, adapt, and neutralize</span> cyber threats 
                    before they compromise your infrastructure.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                      <div className="text-4xl font-black text-emerald-400">99.7%</div>
                      <div className="text-sm text-gray-400">Detection Accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                      <div className="text-4xl font-black text-cyan-400">25ms</div>
                      <div className="text-sm text-gray-400">Response Time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technology Stack */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-2xl p-10 rounded-[3rem] border-2 border-cyan-400/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl">
                      <Server className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white">Tech Stack</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'LGBM', value: 'Gradient Boosting', icon: <Network className="w-6 h-6" /> },
                      { label: 'Decision Tree', value: 'Context Engine', icon: <Brain className="w-6 h-6" /> },
                      { label: 'AWS Integration', value: 'Cloud Native', icon: <Cloud className="w-6 h-6" /> },
                      { label: 'Real-Time', value: 'Streaming Data', icon: <Activity className="w-6 h-6" /> }
                    ].map((tech, idx) => (
                      <div key={idx} className="p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group/item">
                        <div className="text-cyan-400 mb-2 group-hover/item:scale-110 transition-transform">
                          {tech.icon}
                        </div>
                        <div className="text-white font-bold text-sm">{tech.label}</div>
                        <div className="text-gray-400 text-xs">{tech.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Features & Differentiators */}
            <div className="space-y-8 aos-init" style={{ transitionDelay: '200ms' }}>
              {/* Core Capabilities */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-2xl p-10 rounded-[3rem] border-2 border-teal-400/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white">Core Capabilities</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: "🎯", title: "Behavioral Analysis", desc: "Pattern recognition beyond traditional signatures", color: "emerald" },
                      { icon: "⚡", title: "Lightning Response", desc: "Sub-second threat neutralization", color: "cyan" },
                      { icon: "🛡️", title: "Zero-Day Defense", desc: "Identifies unknown attack vectors", color: "teal" },
                      { icon: "🧠", title: "Adaptive Learning", desc: "Evolves with emerging threats", color: "emerald" }
                    ].map((cap, idx) => (
                      <div key={idx} className="group/cap flex items-start space-x-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/5">
                        <div className="text-4xl group-hover/cap:scale-125 transition-transform">{cap.icon}</div>
                        <div className="flex-1">
                          <h4 className={`text-${cap.color}-400 font-black text-lg mb-1`}>{cap.title}</h4>
                          <p className="text-gray-400 text-sm">{cap.desc}</p>
                        </div>
                        <div className={`w-2 h-2 bg-${cap.color}-400 rounded-full group-hover/cap:scale-150 transition-transform`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Unique Advantages */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-2xl p-10 rounded-[3rem] border-2 border-emerald-400/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white">Why Choose Us</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { text: "Graph-based threat correlation", icon: "🔗" },
                      { text: "Multi-cloud deployment ready", icon: "☁️" },
                      { text: "Federated learning architecture", icon: "🌐" },
                      { text: "Enterprise-grade scalability", icon: "📈" },
                      { text: "Compliance-ready framework", icon: "✅" },
                      { text: "24/7 autonomous protection", icon: "🔄" }
                    ].map((adv, idx) => (
                      <div key={idx} className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group/adv border border-white/5">
                        <span className="text-2xl group-hover/adv:scale-125 transition-transform">{adv.icon}</span>
                        <span className="text-white font-semibold flex-1">{adv.text}</span>
                        <CheckCircle className="w-5 h-5 text-emerald-400 group-hover/adv:scale-110 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Banner */}
          <div className="aos-init">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 rounded-[3rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-2xl p-12 rounded-[3rem] border-2 border-emerald-400/20">
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  {[
                    { value: '500+', label: 'Enterprise Clients', sublabel: 'Fortune 500 companies', icon: <Users className="w-12 h-12" />, color: 'emerald' },
                    { value: '3', label: 'User Modules', sublabel: 'Admin · Developer · Analyst', icon: <Shield className="w-12 h-12" />, color: 'cyan' },
                    { value: '5', label: 'ML Models', sublabel: 'ST-GNN · CNN · LSTM · IF · GNN', icon: <Brain className="w-12 h-12" />, color: 'teal' },
                    { value: '∞', label: 'Scalability', sublabel: 'Auto-adaptive architecture', icon: <TrendingUp className="w-12 h-12" />, color: 'emerald' }
                  ].map((stat, idx) => (
                    <div key={idx} className="group/stat">
                      <div className={`text-${stat.color}-400 mb-4 mx-auto group-hover/stat:scale-125 transition-transform`}>
                        {stat.icon}
                      </div>
                      <div className={`text-6xl font-black bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-300 bg-clip-text text-transparent mb-2`}>
                        {stat.value}
                      </div>
                      <div className="text-white font-bold text-xl mb-2">{stat.label}</div>
                      <div className="text-gray-400 text-sm">{stat.sublabel}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 7}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="aos-init max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Ready to Secure Your Cloud?
            </h2>
            <p className="text-2xl text-emerald-100 mb-12 leading-relaxed">
              Join enterprise leaders protecting their infrastructure with AI-driven security. 
              Start your free trial today and experience <span className="font-bold text-white">next-generation threat detection</span>.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <button className="group px-12 py-6 bg-white text-emerald-600 rounded-full font-black text-xl hover:bg-emerald-50 transition-all duration-300 shadow-2xl hover:shadow-white/50 hover:scale-110 flex items-center space-x-3">
                <Shield className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                <span>Get Started Free</span>
              </button>
              <button className="group px-12 py-6 border-3 border-white text-white rounded-full font-black text-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center space-x-3">
                <Brain className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span>Schedule Demo</span>
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-12 text-white/80">
              <div className="text-center">
                <div className="text-4xl font-black text-white">500+</div>
                <div className="text-sm">Enterprise Clients</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-4xl font-black text-white">99.9%</div>
                <div className="text-sm">Uptime SLA</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-4xl font-black text-white">24/7</div>
                <div className="text-sm">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img src="./Logo.png" alt="Smart IDS" className="h-12 w-12 float-animation" onError={(e) => e.target.style.display = 'none'} />
                <span className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Smart IDS
                </span>
              </div>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Next-generation AI-driven intrusion detection for modern cloud infrastructure. 
                Protecting enterprises worldwide with cutting-edge LGBM.
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-black text-white text-lg mb-6">Solutions</h4>
              <ul className="space-y-3">
                {['AWS Security', 'Azure Protection', 'GCP Defense', 'Threat Detection', 'Compliance'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-lg">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-white text-lg mb-6">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'Research Paper', 'API Reference', 'Case Studies', 'Webinars'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-lg">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-white text-lg mb-6">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Contact', 'Partners', 'Press Kit'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-lg">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-center md:text-left">
                &copy; 2025 Smart IDS. All rights reserved. | Powered by LGBM Technology
              </p>
              <div className="flex space-x-6 text-gray-400">
                <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SmartIDSHomepage;