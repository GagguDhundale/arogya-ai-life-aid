import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Heart, Stethoscope, UserPlus, LogIn } from 'lucide-react';

export default function Login() {
  const { user, userType, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [userTypeTab, setUserTypeTab] = useState<'doctor' | 'patient'>('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    specialty: '',
    licenseNumber: '',
    dateOfBirth: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  if (user && userType) {
    return <Navigate to={userType === 'doctor' ? '/doctor-dashboard' : '/dashboard'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const additionalData = userTypeTab === 'doctor' 
          ? { 
              first_name: formData.firstName,
              last_name: formData.lastName,
              specialty: formData.specialty,
              license_number: formData.licenseNumber
            }
          : {
              first_name: formData.firstName,
              last_name: formData.lastName,
              date_of_birth: formData.dateOfBirth
            };

        const { error } = await signUp(formData.email, formData.password, userTypeTab, additionalData);
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created successfully! Please check your email to verify your account.');
        }
      } else {
        const { error } = await signIn(formData.email, formData.password, userTypeTab);
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Successfully signed in!');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Heart className="h-16 w-16 text-primary" />
              <Stethoscope className="h-8 w-8 text-secondary absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Arogya-AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Your AI-Powered Health Companion
          </p>
        </div>

        <Card className="border border-border/50 shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={isSignUp ? "outline" : "default"}
                onClick={() => setIsSignUp(false)}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
              <Button
                variant={isSignUp ? "default" : "outline"}
                onClick={() => setIsSignUp(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </div>
            
            <Tabs value={userTypeTab} onValueChange={(value) => setUserTypeTab(value as 'doctor' | 'patient')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Patient
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Doctor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient" className="mt-4">
                <CardTitle>
                  {isSignUp ? 'Create Patient Account' : 'Patient Login'}
                </CardTitle>
                <CardDescription>
                  {isSignUp 
                    ? 'Join Arogya-AI to track your health and get AI insights'
                    : 'Access your personalized health dashboard'
                  }
                </CardDescription>
              </TabsContent>

              <TabsContent value="doctor" className="mt-4">
                <CardTitle>
                  {isSignUp ? 'Create Professional Account' : 'Professional Login'}
                </CardTitle>
                <CardDescription>
                  {isSignUp 
                    ? 'Join as a healthcare professional to manage patients'
                    : 'Access your professional dashboard and patient management'
                  }
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {userTypeTab === 'doctor' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input
                          id="specialty"
                          name="specialty"
                          placeholder="e.g., Cardiology, Family Medicine"
                          value={formData.specialty}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">Medical License Number</Label>
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}