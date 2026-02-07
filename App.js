import React from 'react';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import LocationSelectScreen from './src/screens/LocationSelectScreen';
import OfficeListScreen from './src/screens/OfficeListScreen';
import OfficeCalendarScreen from './src/screens/OfficeCalendarScreen';
import ReservationConfirmScreen from './src/screens/ReservationConfirmScreen';
import ReservationSuccessScreen from './src/screens/ReservationSuccessScreen';
import MyReservationsScreen from './src/screens/MyReservationsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import AdminReservationsScreen from './src/screens/admin/AdminReservationsScreen';
import AdminUsersScreen from './src/screens/admin/AdminUsersScreen';
import AdminOfficesScreen from './src/screens/admin/AdminOfficesScreen';
import AdminReportsScreen from './src/screens/admin/AdminReportsScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen'; 
import ResetPasswordScreen from './src/screens/ResetPasswordScreen'; 

// Ana uygulama bileşeni
const AppContent = () => {
  const [currentScreen, setCurrentScreen] = React.useState('welcome');
  const [screenParams, setScreenParams] = React.useState({});
  const { user } = useAuth();

  // Kullanıcı giriş yapmışsa ve ekran welcome ise home'a yönlendir
  React.useEffect(() => {
    if (user && currentScreen === 'welcome') {
      setCurrentScreen('home');
    }
  }, [user, currentScreen]);

  const navigateTo = (screen, params = {}) => {
    setScreenParams(params);
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    const commonProps = { onNavigate: navigateTo, route: { params: screenParams } }; // route objesi eklendi
    
    switch (currentScreen) {
      case 'welcome': 
        return <WelcomeScreen {...commonProps} />;
      case 'login': 
        return <LoginScreen {...commonProps} />;
      case 'home': 
        return <HomeScreen {...commonProps} />;
      case 'location-select': 
        return <LocationSelectScreen {...commonProps} />;
      case 'office-list': 
        return <OfficeListScreen {...commonProps} />;
      case 'office-calendar': 
        return <OfficeCalendarScreen {...commonProps} />;
      case 'reservation-confirm': 
        return <ReservationConfirmScreen {...commonProps} />;
      case 'reservation-success': 
        return <ReservationSuccessScreen {...commonProps} />;
      case 'my-reservations': 
        return <MyReservationsScreen {...commonProps} />;
      case 'calendar': 
        return <CalendarScreen {...commonProps} />;
      case 'profile': 
        return <ProfileScreen {...commonProps} />;
      case 'admin': 
        return <AdminDashboardScreen {...commonProps} />;
      case 'admin-reservations': 
        return <AdminReservationsScreen {...commonProps} />;
      case 'admin-users': 
        return <AdminUsersScreen {...commonProps} />;
      case 'admin-offices': 
        return <AdminOfficesScreen {...commonProps} />;
      case 'admin-reports': 
        return <AdminReportsScreen {...commonProps} />;
      case 'forgot-password': 
        return <ForgotPasswordScreen {...commonProps} />;
      case 'reset-password': 
        return <ResetPasswordScreen {...commonProps} />;
      default: 
        return <WelcomeScreen {...commonProps} />;
    }
  };

  return renderScreen();
};

// Ana App bileşeni
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
