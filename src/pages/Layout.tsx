import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { useAuthStore } from '../features/auth/store/authStore';
import Chatbot from '../features/chat/components/Chatbot';

export default function Layout() {
  const { user } = useAuthStore();
  const location = useLocation();

  const chatbotPages = ['/', '/mypage', '/diary'];
  const shouldShowChatbot = user && chatbotPages.includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        {' '}
        {/* 컨텐츠 영역이 남은 공간 차지 */}
        <Outlet />
      </main>
      <Footer />
      {shouldShowChatbot && <Chatbot />}
    </div>
  );
}
