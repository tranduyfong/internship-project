import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './app/store';
import Layout from './container/Layout';

import HomePage from './pages/HomePage';
// CHÚ Ý CHỖ NÀY: Import trực tiếp file ProductPage mới tạo
import ProductPage from './pages/ProductPage';
import { AboutPage, ContactPage } from './pages/Pages';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import ReceiptPage from './pages/ReceiptPage';
import VNPayReturnPage from './pages/VNPayReturnPage';

const theme = createTheme({
  typography: { fontFamily: "'Quicksand', sans-serif" },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />

              {/* Route trỏ tới Component ProductPage thực tế */}
              <Route path="san-pham" element={<ProductPage />} />
              <Route path="san-pham/:id" element={<ProductDetailPage />} />

              <Route path="gioi-thieu" element={<AboutPage />} />
              <Route path="lien-he" element={<ContactPage />} />
              <Route path="kiem-tra-don-hang" element={<ReceiptPage />} />
              <Route path="tai-khoan" element={<ProfilePage />} />
              <Route path="vnpay-return" element={<VNPayReturnPage />} />

              <Route path="dang-nhap" element={<LoginPage />} />
              <Route path="dang-ky" element={<RegisterPage />} />
              <Route path="quen-mat-khau" element={<ForgotPasswordPage />} />

              <Route path="gio-hang" element={<CartPage />} />
              <Route path="thanh-toan" element={<CheckoutPage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;