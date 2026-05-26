import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Đảm bảo bạn đã cài đặt gói này

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Plugin Tailwind cần nằm trong mảng plugins
  ],
  server: {
    port: 5173, // Cổng mặc định của Vite
    proxy: {
      "/api": {
        target: "http://localhost:5001", // Backend của bạn đang chạy ở đây
        changeOrigin: true, // Quan trọng: Đổi origin để tránh lỗi CORS
        secure: false,      // Vì chạy localhost nên không cần xác thực HTTPS
      },
    },
  },
});