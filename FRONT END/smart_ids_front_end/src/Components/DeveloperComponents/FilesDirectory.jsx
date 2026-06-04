"use client"

import { useState, useEffect } from "react"
import {
  Code,
  Home,
  FolderOpen,
  Download,
  FileText,
  BarChart3,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

function FilesDirectory() {
  const [currentPath, setCurrentPath] = useState("/dwnFiles")
  const [scrolled, setScrolled] = useState(false)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloadingFile, setDownloadingFile] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true)
        const devpEmail = sessionStorage.getItem("developerEmail")

        if (!devpEmail) {
          setError("Developer email not found. Please login first.")
          setLoading(false)
          return
        }

        const response = await fetch(`http://localhost:8082/api/files/devp/${devpEmail}`)

        if (!response.ok) {
          throw new Error("Failed to fetch files")
        }

        const data = await response.json()
        setFiles(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        setError(err.message || "Error fetching files")
        setFiles([])
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [])

  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.clear()
    setCurrentPath("/")
    navigate("/")
  }

  const handleDownloadFile = async (fileName) => {
    try {
      const devpEmail = sessionStorage.getItem("developerEmail")
      setDownloadingFile(fileName)

      const encodedEmail = encodeURIComponent(devpEmail)
      const encodedFileName = encodeURIComponent(fileName)
      const downloadUrl = `http://localhost:8082/api/files/download/dev/${encodedEmail}/${encodedFileName}`

      const response = await fetch(downloadUrl)

      if (!response.ok) {
        throw new Error("Failed to download file")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert("Error downloading file: " + err.message)
    } finally {
      setDownloadingFile(null)
    }
  }

  const navItems = [
    { name: "Home", path: "/devpDB", icon: Home },
    { name: "Files Directory", path: "/dwnFiles", icon: Download },
    { name: "Analytics", path: "/devpAnalytics", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "bg-white/80 backdrop-blur-lg shadow-xl shadow-teal-200/50" : "bg-transparent"
        }`}
      >
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
                const Icon = item.icon
                const isActive = currentPath === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      setCurrentPath(item.path)
                      navigate(item.path)
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-300/50"
                        : "text-gray-700 hover:bg-teal-100 hover:text-teal-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                )
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
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Your Files
            </h2>
            <p className="text-gray-600">Manage and download your development files securely</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading your files...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 flex items-center space-x-4 mb-6">
              <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-rose-900">Error</h3>
                <p className="text-rose-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && files.length === 0 && (
            <div className="text-center py-20">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Files Found</h3>
              <p className="text-gray-500">You don't have any files yet</p>
            </div>
          )}

          {/* Files Grid - Unique Staggered Design */}
          {!loading && !error && files.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-2 ${
                    index % 3 === 1 ? "md:translate-y-8" : index % 3 === 2 ? "md:translate-y-4" : ""
                  }`}
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative p-6 h-full flex flex-col">
                    {/* File Icon */}
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-6 h-6 text-teal-600" />
                      </div>
                    </div>

                    {/* File Details */}
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                        {file.fileName || "Unnamed File"}
                      </h3>

                      <div className="space-y-2 text-sm">
                        {file.email && (
                          <p className="text-gray-600">
                            <span className="font-semibold text-gray-700">Email:</span> {file.email}
                          </p>
                        )}

                        {file.secretKey && (
                          <p className="text-gray-600">
                            <span className="font-semibold text-gray-700">Key:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs ml-2 text-gray-700 break-all">
                              {file.secretKey.substring(0, 20)}...
                            </code>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleDownloadFile(file.fileName)}
                        disabled={downloadingFile === file.fileName}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                      >
                        {downloadingFile === file.fileName ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ready</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilesDirectory
