import React, { useEffect, useState } from "react"
import {
  Shield,
  Zap,
  Brain,
  Lock,
  Eye,
  TrendingUp,
  CheckCircle,
  Users,
  Cloud,
  AlertTriangle,
  Activity,
  Database,
  Network,
  Menu,
  X,
  EyeOff,
} from "lucide-react"
import "aos/dist/aos.css"
import AOS from "aos"


export default function SignInApp() {
  const [activeTab, setActiveTab] = useState("admin")
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const tabs = [
    { id: "admin", label: "Admin" },
    { id: "developer", label: "Developer" },
    { id: "dataanalyst", label: "Data Analyst" },
  ]

  const tabDescriptions = {
    admin: "Welcome back! Manage your system with full control.",
    developer: "Welcome back! Build and deploy with confidence.",
    dataanalyst: "Welcome back! Analyze and drive insights.",
  }

 const handleApiCall = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    console.log(`[v0] Logging in as ${activeTab}: ${email}`);

    if (activeTab === "admin") {
      if (email === "admin@gmail.com" && password === "123") {
        alert("Login successful");
        setMessage("Welcome Admin! Login successful.");
        console.log("[v0] Admin login successful");
        setEmail("");
        setPassword("");
        window.location.href = "/adminDB";
      } else {
        setMessage("Invalid admin credentials.");
        alert("Invalid admin credentials");
        setLoading(false)
      }
    } else {
      let apiUrl = "";

      if (activeTab === "developer") {
        apiUrl = "http://localhost:8082/api/devp/login";
      } else if (activeTab === "dataanalyst") {
        apiUrl = "http://localhost:8082/api/analyst/login"; 
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.text(); 
        console.log(`[v0] ${activeTab} login response:`, result);
        alert("Login successful");
        setMessage(`Welcome ${activeTab}! Login successful.`);
        if (activeTab === "developer") {
          sessionStorage.setItem("developerEmail", email);
          window.location.href = "/devpDB";
        } else if (activeTab === "dataanalyst") {
          sessionStorage.setItem("analystEmail", email);
          window.location.href = "/analystDB";
        }

        setEmail("");
        setPassword("");
      } else {
        const errorText = await response.text();
        console.log("[v0] Login error:", response.status, errorText);
        alert(errorText || "Login failed. Please check your credentials.");
        setMessage("Login failed. Please check your credentials.");
      }
    }
  } catch (error) {
    console.error(error);
  }
}
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 parallax-bg"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1526374965328-7f5ae4e8b08f?w=1400&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-blue-500/50 to-blue-600/40"></div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              background:
                i % 3 === 0
                  ? "rgba(59, 130, 246, 0.1)"
                  : i % 3 === 1
                    ? "rgba(99, 102, 241, 0.08)"
                    : "rgba(147, 51, 234, 0.08)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 15}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              filter: "blur(40px)",
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .sign-in-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25), 0 0 80px rgba(37, 99, 235, 0.2);
          animation: slideUp 0.6s ease-out;
          border: 1px solid rgba(255, 255, 255, 0.8);
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.4), inset 0 0 20px rgba(37, 99, 235, 0.1); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), inset 0 0 30px rgba(59, 130, 246, 0.2); }
        }
        
        .tab-button {
          position: relative;
          padding-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .tab-button.active {
          color: #2563eb;
        }
        
        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%);
          border-radius: 2px;
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
          }
        }
        
        .input-underline {
          border: none;
          border-bottom: 1.5px solid #e5e7eb;
          padding-bottom: 12px;
          font-size: 16px;
          width: 100%;
          background: transparent;
          color: #111827;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        
        .input-underline::placeholder {
          color: #d1d5db;
        }
        
        .input-underline:focus {
          outline: none;
          border-bottom-color: #2563eb;
          box-shadow: 0 1px 0 #2563eb;
        }
        
        .input-container {
          position: relative;
        }
        
        .eye-toggle {
          position: absolute;
          right: 0;
          bottom: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          transition: color 0.3s ease;
        }
        
        .eye-toggle:hover {
          color: #6b7280;
        }

        /* Updated button styling to match the Login button instead of Google */
        .login-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 14px 24px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .login-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
          transform: translateY(-2px);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0px);
        }

        .success-message {
          padding: 12px 16px;
          background: #d1fae5;
          color: #065f46;
          border-radius: 8px;
          border-left: 4px solid #10b981;
          font-weight: 500;
          animation: slideIn 0.3s ease;
        }

        .error-message {
          padding: 12px 16px;
          background: #fee2e2;
          color: #7f1d1d;
          border-radius: 8px;
          border-left: 4px solid #ef4444;
          font-weight: 500;
          animation: slideIn 0.3s ease;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Main Sign-In Card */}
      <div className="sign-in-card w-full max-w-2xl p-8 md:p-12 relative z-10">
        {/* Header with Title and Tabs */}
        <div className="flex justify-between items-start mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Sign-in</h1>

          {/* Tab Navigation */}
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? "active" : "text-gray-400"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-base mb-8 leading-relaxed">{tabDescriptions[activeTab]}</p>

        {/* Form */}
        <form onSubmit={handleApiCall} className="space-y-8">
          {/* Email Field */}
          <div>
            <label className="block text-gray-600 text-sm mb-3 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="input-underline"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-600 text-sm mb-3 font-medium">Password</label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-underline pr-8"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-toggle">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={
                message.includes("successful") || message.includes("Welcome") ? "success-message" : "error-message"
              }
            >
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="login-button mt-8">
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
