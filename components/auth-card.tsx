import React, { useState, ComponentProps } from 'react';
import { View, ActivityIndicator, TextInputProps } from 'react-native'; // Removed Alert and TextInput
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils'; // Import cn
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card'; // CardTitle was already removed
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Input } from '~/components/ui/input'; // Import Input
import { Label } from '~/components/ui/label'; // Import Label
import { LogIn, UserPlus, Mail, Lock, User, Shield } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';

// Setup icons with className support
iconWithClassName(LogIn);
iconWithClassName(UserPlus);
iconWithClassName(Mail);
iconWithClassName(Lock);
iconWithClassName(User);
iconWithClassName(Shield);

// Error messages for different auth error codes
const AUTH_ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Invalid password. Please check your password and try again.',
  USER_NOT_FOUND: 'No account found with this email address.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  USER_EXISTS: 'An account with this email already exists. Please try logging in instead.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists. Please try logging in instead.',
  WEAK_PASSWORD: 'Password is too weak. Please choose a stronger password.',
} as const;

interface AuthCardProps {
  onLoginSuccess: () => void;
  onSignupSuccess: () => void;
  signInWithEmailPassword: (email: string, password: string) => Promise<any>;
  signUpWithEmailPassword: (email: string, password: string, name: string) => Promise<any>;
}

// AuthInputProps and AuthInput component definition removed

interface AuthButtonProps extends ComponentProps<typeof Button> {
  children: React.ReactNode;
  loading: boolean;
  className?: string; // Added className as optional
}

// Reusable auth button component
const AuthButton = ({ children, loading, className, ...props }: AuthButtonProps) => (
  <Button
    variant="default"
    size="lg"
    disabled={loading}
    className={cn("w-full", className)} // Added w-full and use cn
    {...props}
  >
    {loading ? (
      <ActivityIndicator size="small" color="#FFFFFF" /> // Use a static color (e.g., white)
    ) : (
      <Text>{children}</Text> 
    )}
  </Button>
);

export function AuthCard({
  onLoginSuccess, 
  onSignupSuccess, 
  signInWithEmailPassword, 
  signUpWithEmailPassword 
}: AuthCardProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle auth results and errors
  const handleAuthResult = (result: any, successCallback: () => void, errorTitle: string) => {
    if (result?.error) {
      const errorMessage = AUTH_ERROR_MESSAGES[result.error.code as keyof typeof AUTH_ERROR_MESSAGES] 
        || result.error.message 
        || 'Authentication failed.';
      
      setError(errorMessage);
      return false;
    }

    if (result?.data) {
      successCallback();
      return true;
    }

    return false;
  };

  // Helper function to handle exceptions
  const handleAuthException = (e: any, errorTitle: string) => {
    console.error(`${errorTitle} exception:`, e);
    const errorMessage = e?.message || (typeof e === 'string' ? e : 'An unexpected error occurred.');
    setError(errorMessage);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithEmailPassword(email, password);
      console.log('Login result:', result);
      
      handleAuthResult(result, onLoginSuccess, "Login Error");
      
    } catch (e: any) {
      handleAuthException(e, "Login Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim()) {
      const errorMsg = "Name is required for signup.";
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await signUpWithEmailPassword(email, password, name);
      console.log('Signup result:', result);
      
      handleAuthResult(result, () => {
        // Alert.alert("Signup Successful", "You can now log in."); // Removed
        setActiveTab('login');
        setName(''); // Clear name field after successful signup
        onSignupSuccess();
      }, "Signup Error");
      
    } catch (e: any) {
      handleAuthException(e, "Signup Error");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setError(null);
  };

  return (
    <Card className="w-full shadow-none border-0">
      <CardHeader className="pb-2 pt-6">
        <View className="items-center">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
            <Shield size={32} className="text-primary" />
          </View>
          <Text className="text-2xl font-bold text-center text-foreground">Welcome</Text>
          <Text className="text-sm text-center text-muted-foreground mt-1">Sign in to your account or create a new one</Text>
        </View>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex-row w-full mb-6">
            <TabsTrigger value="login" className="flex-1">
              <View className="flex-row items-center gap-x-2">
                <LogIn size={16} className={activeTab === 'login' ? 'text-primary' : 'text-muted-foreground/70'} />
                <Text>Login</Text>
              </View>
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">
              <View className="flex-row items-center gap-x-2">
                <UserPlus size={16} className={activeTab === 'signup' ? 'text-primary' : 'text-muted-foreground/70'} />
                <Text>Register</Text>
              </View>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
                    {error && (
          <Text className="text-destructive text-center text-sm">{error}</Text> 
        )}
            <View className="gap-y-4">
              <View className="gap-y-1.5">
                <View className="flex-row items-center gap-x-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <Label nativeID="emailLabel">Email</Label>
                </View>
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  
                  aria-labelledby="emailLabel"
                />
              </View>
              <View className="gap-y-1.5">
                <View className="flex-row items-center gap-x-2">
                  <Lock size={16} className="text-muted-foreground" />
                  <Label nativeID="passwordLabel">Password</Label>
                </View>
                <Input
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  aria-labelledby="passwordLabel"
                />
              </View>
              <AuthButton onPress={handleLogin} loading={loading} className="mt-2">
                <View className="flex-row items-center gap-x-2">
                  <LogIn size={16} className="text-primary-foreground" />
                  <Text className="text-primary-foreground">Login</Text>
                </View>
              </AuthButton>
            </View>
          </TabsContent>
          
          <TabsContent value="signup">
            <View className="gap-y-4">
              <View className="gap-y-1.5">
                <View className="flex-row items-center gap-x-2">
                  <User size={16} className="text-muted-foreground" />
                  <Label nativeID="nameLabel">Name</Label>
                </View>
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
              
                  aria-labelledby="nameLabel"
                />
              </View>
              <View className="gap-y-1.5">
                <View className="flex-row items-center gap-x-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <Label nativeID="signupEmailLabel">Email</Label>
                </View>
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  aria-labelledby="signupEmailLabel"
                />
              </View>
              <View className="gap-y-1.5">
                <View className="flex-row items-center gap-x-2">
                  <Lock size={16} className="text-muted-foreground" />
                  <Label nativeID="signupPasswordLabel">Password</Label>
                </View>
                <Input
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  aria-labelledby="signupPasswordLabel"
                />
              </View>
              <AuthButton onPress={handleSignup} loading={loading} className="mt-2">
                <View className="flex-row items-center gap-x-2">
                  <UserPlus size={16} className="text-primary-foreground" />
                  <Text className="text-primary-foreground">Register</Text>
                </View>
              </AuthButton>
            </View>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
