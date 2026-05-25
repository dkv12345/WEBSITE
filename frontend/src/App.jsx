import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MainWebPage from "./pages/MainWebPage";

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
    </Routes>
  );
}

export default App;
