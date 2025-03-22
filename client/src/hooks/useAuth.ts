import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { LoginCredentials, User, InsertUser } from '@shared/schema';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const useAuth = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  // Check if user is authenticated
  const { 
    data: user, 
    isLoading: loading, 
    error, 
    refetch 
  } = useQuery<User>({ 
    queryKey: ['/api/auth/user'],
    retry: false,
    // If unauthorized, return null instead of throwing an error
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0] as string, {
          credentials: 'include',
        });
        
        if (res.status === 401) {
          return null;
        }
        
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        
        return res.json();
      } catch (error) {
        console.error('Auth check error:', error);
        return null;
      }
    }
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest('POST', '/api/auth/login', credentials);
      return res.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['/api/auth/user'], userData);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.username}!`,
      });
      
      // Redirect to intended destination or home
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect') || '/';
      navigate(redirectUrl);
    },
    onError: (error: any) => {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid username or password',
        variant: 'destructive',
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest('POST', '/api/auth/register', userData);
      return res.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['/api/auth/user'], userData);
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created',
      });
      navigate('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Could not create account',
        variant: 'destructive',
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/auth/logout', {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/user'], null);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Clear any user-related data from the cache
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
      });
      navigate('/');
    },
    onError: () => {
      toast({
        title: 'Logout Failed',
        description: 'There was an error logging out. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const login = (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  };

  const register = (userData: InsertUser) => {
    registerMutation.mutate(userData);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    loading: loading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    login,
    register,
    logout,
    error: error as any,
    isAuthenticated: !!user,
  };
};

export default useAuth;
