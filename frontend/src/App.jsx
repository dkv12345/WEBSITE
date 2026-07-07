import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MainWebPage from "./pages/MainWebPage";
import BookDetailPage from "./pages/BookDetailPage"; 
import OnboardingPage from "./pages/OnBoardingPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import YearlyLookbackPage from "./pages/YearlyLookbackPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainWebPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/mainwebpage" element={<MainWebPage />} />
      <Route path="/book/:id" element={<BookDetailPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/lookback" element={<YearlyLookbackPage />} />
      <Route path="/lookback/share/:token" element={<YearlyLookbackPage />} />
    </Routes>
  );
}

export default App;