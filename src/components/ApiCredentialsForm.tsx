import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Key, 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertTriangle
} from "lucide-react";
import { AdPlatform, SubPlatform } from "./PlatformSelector";
import { toast } from "sonner@2.0.3";

interface ApiCredentialsFormProps {
  platform: AdPlatform;
  subPlatform?: SubPlatform | null;
  onBack: () => void;
  onComplete: (credentials: PlatformCredentials) => void;
}

export interface PlatformCredentials {
  platform: string;
  subPlatform?: string;
  // Google Ads - Simplified OAuth2.0 only
  googleAds?: {
    developerToken: string;
    customerId: string;
  };
  // Meta Ads (Facebook) - OAuth2.0 only
  metaAds?: {
    accessToken: string;
    adAccountId: string;
    businessId?: string;
  };
  // Amazon Ads - API Keys (exception)
  amazonAds?: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    profileId: string;
    region: string;
  };
  // Microsoft Ads - OAuth2.0 only
  microsoftAds?: {
    customerId: string;
    accountId: string;
    developerToken: string;
  };
}

export function ApiCredentialsForm({ platform, subPlatform, onBack, onComplete }: ApiCredentialsFormProps) {
  const [credentials, setCredentials] = useState<any>({});
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateCredentials = () => {
    const errors: string[] = [];
    
    if (platform.id === 'google-ads') {
      if (!credentials.developerToken) errors.push('Developer Token is required');
      if (!credentials.customerId) errors.push('Customer ID is required');
    } else if (platform.id === 'meta-ads') {
      if (!credentials.accessToken) errors.push('Access Token is required');
      if (!credentials.adAccountId) errors.push('Ad Account ID is required');
    } else if (platform.id === 'amazon-ads') {
      if (!credentials.clientId) errors.push('Client ID is required');
      if (!credentials.clientSecret) errors.push('Client Secret is required');
      if (!credentials.refreshToken) errors.push('Refresh Token is required');
      if (!credentials.profileId) errors.push('Profile ID is required');
      if (!credentials.region) errors.push('Region is required');
    } else if (platform.id === 'microsoft-ads') {
      if (!credentials.customerId) errors.push('Customer ID is required');
      if (!credentials.accountId) errors.push('Account ID is required');
      if (!credentials.developerToken) errors.push('Developer Token is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateCredentials()) return;

    setIsValidating(true);
    
    // Simulate API validation
    setTimeout(() => {
      const platformCredentials: PlatformCredentials = {
        platform: platform.id,
        subPlatform: subPlatform?.id,
      };

      if (platform.id === 'google-ads') {
        platformCredentials.googleAds = {
          developerToken: credentials.developerToken,
          customerId: credentials.customerId
        };
      } else if (platform.id === 'meta-ads') {
        platformCredentials.metaAds = {
          accessToken: credentials.accessToken,
          adAccountId: credentials.adAccountId,
          businessId: credentials.businessId
        };
      } else if (platform.id === 'amazon-ads') {
        platformCredentials.amazonAds = {
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
          refreshToken: credentials.refreshToken,
          profileId: credentials.profileId,
          region: credentials.region
        };
      } else if (platform.id === 'microsoft-ads') {
        platformCredentials.microsoftAds = {
          customerId: credentials.customerId,
          accountId: credentials.accountId,
          developerToken: credentials.developerToken
        };
      }

      setIsValidating(false);
      onComplete(platformCredentials);
    }, 2000);
  };

  const renderGoogleAdsForm = () => (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>Required OAuth2.0 access: <strong>Google Ads API v15+</strong></div>
            <div>Data we'll fetch: Campaign performance, keyword metrics, match types, search terms, cost data</div>
            <div>Get credentials from{" "}
              <a 
                href="https://developers.google.com/google-ads/api/docs/first-call/overview" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Ads API Center
              </a>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="developerToken">Developer Token *</Label>
          <div className="relative">
            <Input
              id="developerToken"
              type={showSecrets.developerToken ? "text" : "password"}
              placeholder="Enter your developer token"
              value={credentials.developerToken || ""}
              onChange={(e) => setCredentials({ ...credentials, developerToken: e.target.value })}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={() => toggleSecret('developerToken')}
            >
              {showSecrets.developerToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerId">Customer ID *</Label>
          <Input
            id="customerId"
            placeholder="1234567890"
            value={credentials.customerId || ""}
            onChange={(e) => setCredentials({ ...credentials, customerId: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">10-digit Google Ads account ID</p>
        </div>
      </div>
    </div>
  );

  const renderMetaAdsForm = () => (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>Required OAuth2.0 access: <strong>Meta Marketing API v18+</strong></div>
            <div>Data we'll fetch: Campaign insights, ad set performance, audience data, conversion metrics</div>
            <div>Required permissions: ads_read, ads_management, business_management</div>
            <div>Get credentials from{" "}
              <a 
                href="https://developers.facebook.com/apps/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Facebook for Developers
              </a>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="accessToken">Access Token *</Label>
          <div className="relative">
            <Input
              id="accessToken"
              type={showSecrets.accessToken ? "text" : "password"}
              placeholder="Long-lived OAuth2.0 Access Token"
              value={credentials.accessToken || ""}
              onChange={(e) => setCredentials({ ...credentials, accessToken: e.target.value })}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={() => toggleSecret('accessToken')}
            >
              {showSecrets.accessToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Generate a long-lived OAuth2.0 token with ads_read permissions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adAccountId">Ad Account ID *</Label>
            <Input
              id="adAccountId"
              placeholder="act_1234567890"
              value={credentials.adAccountId || ""}
              onChange={(e) => setCredentials({ ...credentials, adAccountId: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Include "act_" prefix</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessId">Business Manager ID</Label>
            <Input
              id="businessId"
              placeholder="Optional"
              value={credentials.businessId || ""}
              onChange={(e) => setCredentials({ ...credentials, businessId: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAmazonAdsForm = () => (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>Required API access: <strong>Amazon Advertising API v3</strong></div>
            <div>Data we'll fetch: Campaign reports, keyword performance, ASIN targeting, bid adjustments</div>
            <div>Supported ad types: Sponsored Products, Sponsored Brands, Sponsored Display</div>
            <div>Get credentials from{" "}
              <a 
                href="https://advertising.amazon.com/API/docs/en-us/get-started/generate-api-tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Amazon Advertising Console
              </a>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID *</Label>
            <Input
              id="clientId"
              placeholder="Amazon Ads Client ID"
              value={credentials.clientId || ""}
              onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientSecret">Client Secret *</Label>
            <div className="relative">
              <Input
                id="clientSecret"
                type={showSecrets.clientSecret ? "text" : "password"}
                placeholder="Amazon Ads Client Secret"
                value={credentials.clientSecret || ""}
                onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => toggleSecret('clientSecret')}
              >
                {showSecrets.clientSecret ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="refreshToken">Refresh Token *</Label>
          <div className="relative">
            <Input
              id="refreshToken"
              type={showSecrets.refreshToken ? "text" : "password"}
              placeholder="Amazon Ads Refresh Token"
              value={credentials.refreshToken || ""}
              onChange={(e) => setCredentials({ ...credentials, refreshToken: e.target.value })}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={() => toggleSecret('refreshToken')}
            >
              {showSecrets.refreshToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profileId">Profile ID *</Label>
            <Input
              id="profileId"
              placeholder="Advertising Profile ID"
              value={credentials.profileId || ""}
              onChange={(e) => setCredentials({ ...credentials, profileId: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region *</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={credentials.region || ""}
              onChange={(e) => setCredentials({ ...credentials, region: e.target.value })}
            >
              <option value="">Select Region</option>
              <option value="NA">North America</option>
              <option value="EU">Europe</option>
              <option value="FE">Far East</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMicrosoftAdsForm = () => (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>Required OAuth2.0 access: <strong>Microsoft Advertising API v13</strong></div>
            <div>Data we'll fetch: Campaign performance, keyword reports, audience insights, Bing search data</div>
            <div>Network coverage: Bing, Yahoo, Microsoft Audience Network</div>
            <div>Get credentials from{" "}
              <a 
                href="https://docs.microsoft.com/en-us/advertising/guides/get-started" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Microsoft Advertising Developer Portal
              </a>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer ID *</Label>
            <Input
              id="customerId"
              placeholder="Microsoft Ads Customer ID"
              value={credentials.customerId || ""}
              onChange={(e) => setCredentials({ ...credentials, customerId: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountId">Account ID *</Label>
            <Input
              id="accountId"
              placeholder="Microsoft Ads Account ID"
              value={credentials.accountId || ""}
              onChange={(e) => setCredentials({ ...credentials, accountId: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="developerToken">Developer Token *</Label>
          <div className="relative">
            <Input
              id="developerToken"
              type={showSecrets.developerToken ? "text" : "password"}
              placeholder="Microsoft Ads OAuth2.0 Developer Token"
              value={credentials.developerToken || ""}
              onChange={(e) => setCredentials({ ...credentials, developerToken: e.target.value })}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={() => toggleSecret('developerToken')}
            >
              {showSecrets.developerToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1>OAuth2.0 Credentials Setup</h1>
            <p className="text-muted-foreground">
              Enter your {subPlatform?.name || platform.name} OAuth2.0 credentials to fetch campaign data
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            {platform.id === 'amazon-ads' ? 'API Keys Required' : 'OAuth2.0 Required'}
          </Badge>
        </div>

        {/* Form Card */}
        <Card className="p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="text-3xl"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {platform.logo}
                </motion.div>
                <div>
                  <h2>{subPlatform?.name || platform.name} {platform.id === 'amazon-ads' ? 'API' : 'OAuth2.0'} Access</h2>
                  <p className="text-sm text-muted-foreground">
                    Required for fetching keyword match-type performance data
                  </p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-0">
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Please fix the following errors:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Platform-specific form */}
            {platform.id === 'google-ads' && renderGoogleAdsForm()}
            {platform.id === 'meta-ads' && renderMetaAdsForm()}
            {platform.id === 'amazon-ads' && renderAmazonAdsForm()}
            {platform.id === 'microsoft-ads' && renderMicrosoftAdsForm()}

            {/* Submit Button */}
            <div className="flex justify-center pt-8 border-t">
              <Button 
                onClick={handleSubmit}
                disabled={isValidating}
                size="lg"
                className="min-w-48"
              >
                {isValidating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <CheckCircle className="w-5 h-5 mr-2" />
                )}
                {isValidating ? "Validating Credentials..." : "Connect & Fetch Data"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-sm text-muted-foreground"
        >
          <p>🔒 Your credentials are encrypted and used only to fetch campaign data</p>
        </motion.div>
      </motion.div>
    </div>
  );
}