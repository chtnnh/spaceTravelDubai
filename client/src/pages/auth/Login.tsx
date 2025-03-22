import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loginSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StarBg from '@/components/ui/star-bg';
import useAuth from '@/hooks/useAuth';
import { Rocket, Loader2 } from 'lucide-react';

const Login = () => {
  const { login, loading, user } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect if already logged in
  if (user) {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect') || '/';
    navigate(redirectUrl);
    return null;
  }

  // Define form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    login(values);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A192F]">
      <Navbar />
      
      <StarBg className="flex-grow flex items-center justify-center py-16">
        <div className="w-full max-w-md px-4">
          <Card className="bg-[#121212] border-gray-800 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#00D1FF] bg-opacity-20 flex items-center justify-center">
                <Rocket className="text-[#00D1FF] h-6 w-6" />
              </div>
              <CardTitle className="font-orbitron text-2xl">Log In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Username</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-[#0A192F] border-gray-700 focus:border-[#00D1FF]" 
                            placeholder="Enter your username" 
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Password</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            className="bg-[#0A192F] border-gray-700 focus:border-[#00D1FF]" 
                            placeholder="Enter your password" 
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full font-orbitron bg-[#00D1FF] hover:bg-[#00D1FF]/80"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Logging In...
                      </>
                    ) : (
                      'LOG IN'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link href="/register">
                  <a className="text-[#00D1FF] hover:underline">Sign Up</a>
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </StarBg>
      
      <Footer />
    </div>
  );
};

export default Login;
