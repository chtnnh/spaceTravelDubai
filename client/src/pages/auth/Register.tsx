import { Link, useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertUserSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { User, Loader2 } from 'lucide-react';

// Extended schema with password confirmation
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { register, loading, user } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  // Define form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      fullName: '',
      preferences: {},
    },
  });

  // Form submission handler
  const onSubmit = (values: RegisterFormValues) => {
    // Extract confirmPassword from values
    const { confirmPassword, ...userData } = values;
    register(userData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A192F]">
      <Navbar />
      
      <StarBg className="flex-grow flex items-center justify-center py-16">
        <div className="w-full max-w-lg px-4">
          <Card className="bg-[#121212] border-gray-800 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#00D1FF] bg-opacity-20 flex items-center justify-center">
                <User className="text-[#00D1FF] h-6 w-6" />
              </div>
              <CardTitle className="font-orbitron text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Create an account to start your space journey
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
                            placeholder="Choose a username" 
                            disabled={loading}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-500 text-xs">
                          Your unique identifier on our platform.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-[#0A192F] border-gray-700 focus:border-[#00D1FF]" 
                            placeholder="Enter your full name" 
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email"
                            className="bg-[#0A192F] border-gray-700 focus:border-[#00D1FF]" 
                            placeholder="Enter your email address" 
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                              placeholder="Create a password" 
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              className="bg-[#0A192F] border-gray-700 focus:border-[#00D1FF]" 
                              placeholder="Confirm your password" 
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full font-orbitron bg-[#00D1FF] hover:bg-[#00D1FF]/80"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Creating Account...
                      </>
                    ) : (
                      'CREATE ACCOUNT'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/login">
                  <a className="text-[#00D1FF] hover:underline">Log In</a>
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

export default Register;
