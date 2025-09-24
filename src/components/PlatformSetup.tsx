import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  Key, 
  Shield, 
  CheckCircle, 
  ExternalLink,
  Eye,
  EyeOff,
  AlertTriangle,
  Zap
} from "lucide-react";
import { AdPlatform } from "./PlatformSelector";
import { AccountSetupForm, AccountSetupData } from "./AccountSetupForm";

interface PlatformSetupProps {
  platform: AdPlatform;
  onBack: () => void;
  onComplete: (setupData: AccountSetupData, credentials: any) => void;
}

export function PlatformSetup({ platform, onBack, onComplete }: PlatformSetupProps) {
  const [setupPhase, setSetupPhase] = useState<'account-setup' | 'platform-connection'>('account-setup');
  const [accountData, setAccountData] = useState<AccountSetupData | null>(null);
  const [credentials, setCredentials] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "success" | "error">("idle");

  const handleAccountSetupComplete = (setupData: AccountSetupData) => {
    setAccountData(setupData);
    setSetupPhase('platform-connection');
  };

  const handleOAuth2Flow = () => {
    setIsConnecting(true);
    setConnectionStatus("connecting");
    
    // Simulate OAuth2 flow
    setTimeout(() => {
      setConnectionStatus("success");
      setIsConnecting(false);
      setTimeout(() => {
        if (accountData) {
          onComplete(accountData, { 
            type: "oauth2", 
            accessToken: "mock_access_token",
            refreshToken: "mock_refresh_token",
            platform: platform.id
          });
        }
      }, 1500);
    }, 3000);
  };

  const handleApiKeySubmit = () => {
    if (!credentials.apiKey) return;
    
    setIsConnecting(true);
    setConnectionStatus("connecting");
    
    // Simulate API key validation
    setTimeout(() => {
      if (credentials.apiKey.length > 10) {
        setConnectionStatus("success");
        setTimeout(() => {
          if (accountData) {
            onComplete(accountData, {
              type: "api_key",
              apiKey: credentials.apiKey,
              platform: platform.id
            });
          }
        }, 1500);
      } else {
        setConnectionStatus("error");
      }
      setIsConnecting(false);
    }, 2000);
  };

  const handleCredentialsSubmit = () => {
    if (!credentials.username || !credentials.password) return;
    
    setIsConnecting(true);
    setConnectionStatus("connecting");
    
    // Simulate credentials validation
    setTimeout(() => {
      setConnectionStatus("success");
      setTimeout(() => {
        if (accountData) {
          onComplete(accountData, {
            type: "credentials",
            username: credentials.username,
            password: credentials.password,
            platform: platform.id
          });
        }
      }, 1500);
      setIsConnecting(false);
    }, 2500);
  };

  const renderOAuth2Setup = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <motion.div
          className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${platform.color}, ${platform.color}dd)` }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Shield className="h-8 w-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold">Secure OAuth2 Connection</h3>
        <p className="text-muted-foreground">
          You'll be redirected to {platform.name} to authorize AdFlow Fusion. 
          This is the most secure way to connect your account.
        </p>
        
        {/* Account Summary */}
        {accountData && (
          <div className="bg-accent/20 rounded-lg p-4 text-sm">
            <h4 className="font-medium mb-2">Account Summary</h4>
            <div className="space-y-1 text-muted-foreground">
              <div>Company: {accountData.companyName || 'Personal Account'}</div>
              <div>Industry: {accountData.industry}</div>
              <div>Monthly Spend: {accountData.monthlySpend}</div>
              <div>Experience: {accountData.experienceLevel}</div>
            </div>
          </div>
        )}
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          We only request read access to your campaign data. Your login credentials are never stored.
          Based on your setup, we'll configure optimal match-type tracking.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <h4 className="font-medium">Permissions we'll request:</h4>
        <div className="space-y-2 text-sm">
          {[
            "Read campaign performance data",
            "Access keyword metrics & match types",
            "View ad group statistics",
            "Read account structure",
            "Monitor conversion tracking"
          ].map((permission, index) => (
            <motion.div
              key={permission}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
              {permission}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button 
          onClick={handleOAuth2Flow}
          disabled={isConnecting}
          className="w-full h-12"
          style={{
            background: isConnecting ? undefined : `linear-gradient(135deg, ${platform.color}, ${platform.color}dd)`
          }}
        >
          {isConnecting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
            />
          ) : (
            <ExternalLink className="h-5 w-5 mr-2" />
          )}
          {isConnecting ? "Connecting..." : `Connect to ${platform.name}`}
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderApiKeySetup = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <motion.div
          className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${platform.color}, ${platform.color}dd)` }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Key className="h-8 w-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold">API Key Setup</h3>
        <p className="text-muted-foreground">
          Enter your {platform.name} API key to connect your account.
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You can find your API key in your {platform.name} account settings under "API Access" or "Developer Tools".
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Enter your API key"
            value={credentials.apiKey || ""}
            onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
            className="h-12"
          />
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={handleApiKeySubmit}
            disabled={!credentials.apiKey || isConnecting}
            className="w-full h-12"
            style={{
              background: isConnecting ? undefined : `linear-gradient(135deg, ${platform.color}, ${platform.color}dd)`
            }}
          >
            {isConnecting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : (
              <Key className="h-5 w-5 mr-2" />
            )}
            {isConnecting ? "Verifying..." : "Connect API Key"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderCredentialsSetup = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <motion.div
          className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${platform.color}, ${platform.color}dd)` }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Shield className="h-8 w-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold">Account Credentials</h3>
        <p className="text-muted-foreground">
          Enter your {platform.name} login credentials to connect your account.
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your credentials are encrypted and stored securely. We recommend using OAuth2 when available.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username/Email</Label>
          <Input
            id="username"
            type="email"
            placeholder="Enter your username or email"
            value={credentials.username || ""}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={credentials.password || ""}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="h-12 pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-12 w-12"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={handleCredentialsSubmit}
            disabled={!credentials.username || !credentials.password || isConnecting}
            className="w-full h-12"
            style={{
              background: isConnecting ? undefined : `linear-gradient(135deg, ${platform.color}, ${platform.color}dd)`
            }}
          >
            {isConnecting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : (
              <Shield className="h-5 w-5 mr-2" />
            )}
            {isConnecting ? "Connecting..." : "Connect Account"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderConnectionStatus = () => {
    if (connectionStatus === "success") {
      return (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="h-8 w-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-green-600">Connected Successfully!</h3>
          <p className="text-muted-foreground">
            Your {platform.name} account has been connected. Setting up your dashboard...
          </p>
        </motion.div>
      );
    }

    if (connectionStatus === "error") {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to connect to {platform.name}. Please check your credentials and try again.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  // Show AccountSetupForm first
  if (setupPhase === 'account-setup') {
    return (
      <AccountSetupForm
        platform={platform}
        onBack={onBack}
        onComplete={handleAccountSetupComplete}
      />
    );
  }

  // Then show platform connection
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 30px rgba(139, 92, 246, 0.4)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">AdFlow Fusion</h1>
          </motion.div>
          
          <div className="flex items-center gap-3 justify-center mb-4">
            <motion.div 
              className="text-3xl"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {platform.logo}
            </motion.div>
            <div className="text-left">
              <h2 className="text-xl font-semibold">{platform.name}</h2>
              <Badge variant="secondary">
                {platform.authType === "oauth2" ? "OAuth2" : platform.authType === "api_key" ? "API Key" : "Credentials"}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Setup Card */}
        <Card className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${platform.color}, transparent)`
            }}
          />
          
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center justify-between">
              Connect Platform
              <Button variant="ghost" size="icon" onClick={() => setSetupPhase('account-setup')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10">
            <AnimatePresence mode="wait">
              {connectionStatus === "idle" || connectionStatus === "connecting" ? (
                <motion.div key="setup">
                  {platform.authType === "oauth2" && renderOAuth2Setup()}
                  {platform.authType === "api_key" && renderApiKeySetup()}
                  {platform.authType === "credentials" && renderCredentialsSetup()}
                </motion.div>
              ) : (
                <motion.div key="status">
                  {renderConnectionStatus()}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-sm text-muted-foreground"
        >
          <p>🔒 Your data is encrypted and secure</p>
        </motion.div>
      </motion.div>
    </div>
  );
}