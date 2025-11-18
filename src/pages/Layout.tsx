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
    <div>
      <Header />
      <Outlet />
      <Footer />
      {shouldShowChatbot && <Chatbot />}
    </div>
  );
}
