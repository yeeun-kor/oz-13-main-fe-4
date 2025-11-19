import { Route, Routes } from 'react-router-dom';
import './App.css';
import LogIn from './pages/auth/LogIn';
import SignUp from './pages/auth/SignUp';
import Layout from './pages/Layout';
import { MainPage } from './pages/main/MainPage';
import Mypage from './pages/Mypage';
import Diary from './pages/diary/diary';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    /*
    createTheme. 으로 프리텐타드로 섷ㄹ정하기
     */

    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route
          path='/diary'
          element={
            <ProtectedRoute>
              <Diary />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
