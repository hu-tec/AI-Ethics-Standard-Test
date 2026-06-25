import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Fields from './pages/Fields'
import Process from './pages/Process'
import Status from './pages/Status'
import Diagnosis from './pages/Diagnosis'
import Education from './pages/Education'
import Certificate from './pages/Certificate'
import Pricing from './pages/Pricing'
import ExpertRecruit from './pages/ExpertRecruit'
import Community from './pages/Community'
import ExamRegistration from './pages/ExamRegistration'
import PaidDiagnosisHub from './pages/PaidDiagnosisHub'
import PaidDiagnosis1 from './pages/PaidDiagnosis1'
import PaidDiagnosis2 from './pages/PaidDiagnosis2'
import PaidDiagnosis3 from './pages/PaidDiagnosis3'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import AdminDB from './pages/AdminDB'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <HashRouter>
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ExamRegistration />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/fields" element={<Fields />} />
            <Route path="/process" element={<Process />} />
            <Route path="/status" element={<Status />} />
            <Route path="/diagnosis" element={<ProtectedRoute><Diagnosis /></ProtectedRoute>} />
            <Route path="/education" element={<Education />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/exams" element={<ExamRegistration />} />
            <Route path="/exam-registration" element={<ExamRegistration />} />
            <Route path="/expert" element={<ExpertRecruit />} />
            <Route path="/community" element={<Community />} />
            <Route path="/paid-diagnosis" element={<ProtectedRoute><PaidDiagnosisHub /></ProtectedRoute>} />
            <Route path="/paid-diagnosis/1" element={<ProtectedRoute><PaidDiagnosis1 /></ProtectedRoute>} />
            <Route path="/paid-diagnosis/2" element={<ProtectedRoute><PaidDiagnosis2 /></ProtectedRoute>} />
            <Route path="/paid-diagnosis/3" element={<ProtectedRoute><PaidDiagnosis3 /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="/admin/db" element={<ProtectedRoute adminOnly><AdminDB /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
    </HashRouter>
  )
}
