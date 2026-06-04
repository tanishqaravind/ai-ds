"use client"

import { useState, useEffect } from "react"
import {
  Database,
  Home,
  FilePlus,
  FolderSearch,
  BarChart3,
  LogOut,
  Download,
  Loader,
  AlertCircle,
  File,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

function ViewFiles() {
  const [currentPath, setCurrentPath] = useState("/viewDocs")
  const [scrolled, setScrolled] = useState(false)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloading, setDownloading] = useState({})
  const navigate = useNavigate()

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
        const analystEmail = sessionStorage.getItem("analystEmail")
        if (!analystEmail) {
          setError("Analyst email not found. Please log in again.")
          setLoading(false)
          return
        }

        const response = await fetch(`http://localhost:8082/api/files/analyst/${analystEmail}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.statusText}`)
        }

        const data = await response.json()
        setFiles(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching files:", err)
        setError(err.message || "Failed to load files")
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [])

  const handleLogout = () => {
    sessionStorage.clear()
    setCurrentPath("/")
    navigate("/")
  }

  const handleDownload = async (fileName) => {
    try {
      const analystEmail = sessionStorage.getItem("analystEmail")
      if (!analystEmail) {
        setError("Analyst email not found")
        return
      }

      setDownloading((prev) => ({ ...prev, [fileName]: true }))

      const encodedEmail = encodeURIComponent(analystEmail)
      const encodedFileName = encodeURIComponent(fileName)

      const response = await fetch(
        `http://localhost:8082/api/files/download/analyst/${encodedEmail}/${encodedFileName}`,
        { method: "GET" },
      )

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`)
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
      console.error("Download error:", err)
      setError(`Download failed: ${err.message}`)
    } finally {
      setDownloading((prev) => ({ ...prev, [fileName]: false }))
    }
  }

  const navItems = [
    { name: "Home", path: "/analystDB", icon: Home },
    { name: "Add Documents", path: "/addDocs", icon: FilePlus },
    { name: "View Documents", path: "/viewDocs", icon: FolderSearch },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "bg-white/80 backdrop-blur-lg shadow-xl shadow-purple-200/50" : "bg-transparent"
        }`}
      >
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
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-300/50"
                        : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
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
      <div className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Your Documents
            </h2>
            <p className="text-gray-600">Manage and download your secure files</p>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <p className="text-rose-700 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Loading your files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-20">
              <FolderSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No documents found</p>
              <p className="text-gray-500 text-sm mt-2">Start by adding new documents</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-300"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex items-center justify-between">
                    <File className="w-6 h-6 text-white" />
                    <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">
                      ID: {file.id}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* File Name */}
                    <h3 className="font-semibold text-gray-800 mb-4 line-clamp-2 text-sm break-words">
                      {file.fileName}
                    </h3>

                    {/* File Details */}
                    <div className="space-y-3 mb-6">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 font-medium">Email</p>
                        <p className="text-sm text-gray-800 break-all">{file.email}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 font-medium truncate">Secret Key</p>
                          <p className="text-xs text-gray-700 font-mono truncate">
                            {file.secretKey.substring(0, 12)}...
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 font-medium truncate">Encrypted</p>
                          <p className="text-xs text-gray-700 font-mono truncate">
                            {file.encryptedKeyStore.substring(0, 12)}...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(file.fileName)}
                      disabled={downloading[file.fileName]}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-2 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
                    >
                      {downloading[file.fileName] ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
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

export default ViewFiles
