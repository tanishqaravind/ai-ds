import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SmartIDSHomepage from './Components/HomeComponents/HomePage';
import Login from './Components/HomeComponents/Login';
import AdminDashboard from './Components/AdminComponents/AdminDashboard';
import DataAnalystDashboard from './Components/DataAnalystComponents/DataAnalystDashboard';
import DeveloperDashboard from './Components/DeveloperComponents/DeveloperDashboard';
import DeveloperDict from './Components/AdminComponents/DeveloperDict';
import AnalystDict from './Components/AdminComponents/AnalystDict';
import ViewAdnReports from './Components/AdminComponents/ViewAdnReports';
import ViewAdnAnalytics from './Components/AdminComponents/ViewAnalytics';
import UploadFiles from './Components/DataAnalystComponents/UploadFiles';
import ViewFiles from './Components/DataAnalystComponents/ViewFiles';
import AnalystAnalytics from './Components/DataAnalystComponents/AnalystAnalytics';
import FilesDirectory from './Components/DeveloperComponents/FilesDirectory';
import DevpAnalytics from './Components/DeveloperComponents/DevpAnalytics';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" index element={<SmartIDSHomepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminDB" element={<AdminDashboard />} />
        <Route path="/analystDB" element={<DataAnalystDashboard />} />
        <Route path="/devpDB" element={<DeveloperDashboard />} />
        <Route path="/developer" element={<DeveloperDict />} />
        <Route path="/analyst" element={<AnalystDict />} />
        <Route path='/adnreports' element={<ViewAdnReports />} />
        <Route path='/adnanalytics' element={<ViewAdnAnalytics />} />
        <Route path='/addDocs' element={<UploadFiles />} />
        <Route path='/viewDocs' element={<ViewFiles />} />
        <Route path='/analytics' element={<AnalystAnalytics />} />
        <Route path='/dwnFiles' element={<FilesDirectory />} />
        <Route path='/devpAnalytics' element={<DevpAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;
