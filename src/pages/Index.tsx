
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, loading, currentUser } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Check if user is a developer
    const isDeveloper = currentUser?.jobFunction?.includes('Developer') || 
                      (currentUser?.jobFunctions && currentUser?.jobFunctions.some(jf => jf.includes('Developer')));
    
    // If developer, redirect to access requests page, otherwise to dashboard
    return <Navigate to={isDeveloper ? '/requests' : '/dashboard'} replace />;
  }
  
  // Redirect to login if not authenticated
  return <Navigate to="/login" replace />;
};

export default Index;
