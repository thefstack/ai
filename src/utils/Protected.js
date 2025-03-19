"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SignIn from '@/components/SignIn';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';
import Error from '@/components/Error';

const Protected = ({ children, text }) => {
  const { isAuthenticated, loading, error } = useAuth();
  const router = useRouter();

  // Handle redirection when not authenticated and loading is done
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading screen while authentication status is being verified
  if (loading) {
    return <Loading text={text} />;
  }

  // Render children if authenticated, otherwise nothing since the user is being redirected
  return <>{isAuthenticated ? <>{error !="" && <Error message={error}/>}{children}</> : <>{error !="" && <Error message={error}/>}<SignIn/></>}</>;
};

export default Protected;
