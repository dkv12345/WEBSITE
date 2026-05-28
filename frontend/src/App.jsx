import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MainWebPage from "./pages/MainWebPage";
import BookDetailPage from "./pages/BookDetailPage"; 
import OnboardingPage from "./pages/OnBoardingPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/mainwebpage" element={<MainWebPage />} />
      <Route path="/book/:id" element={<BookDetailPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

    </Routes>
  );
}

export default App;