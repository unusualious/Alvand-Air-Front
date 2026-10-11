import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { trackPageView } from './utils/analytics'
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import PassengerPage from './pages/PassengerPage';
import PaymentPage from './pages/PaymentPage';
import TicketPage from './pages/TicketPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import useAuthStore from './stores/authStore';
import AirlineTemplateTest from './components/test/AirlineTemplateTest';
import AboutUsPage from './pages/AboutUs';
import ContactPage from './pages/ContactUs';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import FeedbackPage from './pages/FeedbackPage';
import SafetyFormsLanding from './pages/safety/SafetyFormsLanding';
import SafetyReportPage from './pages/SafetyReportPage';
import MandatoryReportForm from './pages/safety/MandatoryReportForm';
import VoluntaryReportForm from './pages/safety/VoluntaryReportForm';
import DownloadForms from './pages/safety/DownloadForms';
import ChatWidget from './components/chat/ChatWidget'


function RouteTracker() {
  const location = useLocation()
  useEffect(() => { trackPageView(location.pathname) }, [location.pathname])
  return null
}

function App() {
  const { initAuth, loading } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#a51c20] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      dir="rtl"
    >
      <Navbar />
      <RouteTracker />
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/search"
          element={<SearchResultsPage />}
        />
        <Route
          path="/passenger"
          element={<PassengerPage />}
        />
        <Route
          path="/payment"
          element={<PaymentPage />}
        />
        <Route
          path="/ticket/:pnr"
          element={<TicketPage />}
        />
        <Route
          path="/profile"
          element={<ProfilePage />}
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
        />
        <Route path="/feedback" element={<FeedbackPage />} />
        {/* <Route
          path="/ui-test"
          element={<AirlineTemplateTest />}
        /> */}
        <Route
          path="/blog"
          element={<BlogListPage />}
        />
        <Route
          path="/about"
          element={<AboutUsPage />}
        />
        <Route
          path="/contact"
          element={<ContactPage />}
        />
        <Route
          path="/blog/:slug"
          element={<BlogDetailPage />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/safety-report" element={<SafetyReportPage />} />

        <Route path="/safety-reports" element={<SafetyFormsLanding />} />
        <Route path="/safety-reports/mandatory" element={<MandatoryReportForm />} />
        <Route path="/safety-reports/voluntary" element={<VoluntaryReportForm />} />
        <Route path="/safety-reports/download" element={<DownloadForms />} />
      </Routes>
        <ChatWidget />
      <Footer />
    </div>
  );
}

export default App;
