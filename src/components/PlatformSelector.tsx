import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, ArrowRight, Zap, TrendingUp, Globe } from "lucide-react";

export interface AdPlatform {
  id: string;
  name: string;
  description: string;
  logo: string;
  color: string;
  features: string[];
  authType: "oauth2" | "api_key" | "credentials";
  popular?: boolean;
  subPlatforms?: SubPlatform[];
}

export interface SubPlatform {
  id: string;
  name: string;
  description: string;
  logo: string;
  color: string;
}

const platforms: AdPlatform[] = [
  {
    id: "google-ads",
    name: "Google Ads",
    description: "The world's largest search advertising platform",
    logo: "🔍",
    color: "#4285f4",
    features: ["Search Campaigns", "Display Network", "YouTube Ads", "Shopping Ads"],
    authType: "oauth2",
    popular: true,
    subPlatforms: [
      { id: "google-search", name: "Search Ads", description: "Text ads on Google search results", logo: "🔍", color: "#4285f4" },
      { id: "google-display", name: "Display Ads", description: "Visual ads across Google's network", logo: "🖼️", color: "#34a853" },
      { id: "youtube-ads", name: "YouTube Ads", description: "Video ads on YouTube platform", logo: "📺", color: "#ff0000" },
      { id: "google-shopping", name: "Shopping Ads", description: "Product listings in Google Shopping", logo: "🛍️", color: "#fbbc04" },
      { id: "google-app", name: "App Campaigns", description: "Promote your mobile app", logo: "📱", color: "#9aa0a6" }
    ]
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    description: "Facebook, Instagram & Audience Network advertising",
    logo: "📘",
    color: "#1877f2",
    features: ["Facebook Ads", "Instagram Ads", "Messenger Ads", "Audience Network"],
    authType: "oauth2",
    popular: true,
    subPlatforms: [
      { id: "facebook-ads", name: "Facebook Ads", description: "Ads on Facebook platform", logo: "📘", color: "#1877f2" },
      { id: "instagram-ads", name: "Instagram Ads", description: "Visual ads on Instagram", logo: "📸", color: "#e4405f" },
      { id: "messenger-ads", name: "Messenger Ads", description: "Ads in Facebook Messenger", logo: "💬", color: "#00b2ff" },
      { id: "audience-network", name: "Audience Network", description: "Ads across Meta's partner apps", logo: "🌐", color: "#42a5f5" }
    ]
  },
  {
    id: "amazon-ads",
    name: "Amazon Advertising",
    description: "Reach customers on Amazon's marketplace",
    logo: "📦",
    color: "#ff9900",
    features: ["Sponsored Products", "Sponsored Brands", "Display Ads", "Video Ads"],
    authType: "api_key",
    subPlatforms: [
      { id: "sponsored-products", name: "Sponsored Products", description: "Product ads in search results", logo: "📦", color: "#ff9900" },
      { id: "sponsored-brands", name: "Sponsored Brands", description: "Brand awareness campaigns", logo: "🏷️", color: "#146eb4" },
      { id: "sponsored-display", name: "Sponsored Display", description: "Display ads on and off Amazon", logo: "🖥️", color: "#ff9900" },
      { id: "amazon-dsp", name: "Amazon DSP", description: "Programmatic display advertising", logo: "📊", color: "#232f3e" }
    ]
  },
  {
    id: "microsoft-ads",
    name: "Microsoft Ads",
    description: "Bing and Yahoo search network advertising",
    logo: "🔷",
    color: "#00bcf2",
    features: ["Search Ads", "Shopping Campaigns", "Audience Ads", "Microsoft Audience"],
    authType: "oauth2",
    subPlatforms: [
      { id: "bing-search", name: "Bing Search Ads", description: "Search ads on Bing", logo: "🔍", color: "#00bcf2" },
      { id: "microsoft-audience", name: "Audience Ads", description: "Native ads on Microsoft network", logo: "👥", color: "#0078d4" },
      { id: "microsoft-shopping", name: "Shopping Campaigns", description: "Product ads on Bing Shopping", logo: "🛒", color: "#00bcf2" }
    ]
  },
  {
    id: "linkedin-ads",
    name: "LinkedIn Ads",
    description: "Professional network advertising platform",
    logo: "💼",
    color: "#0a66c2",
    features: ["Sponsored Content", "Message Ads", "Dynamic Ads", "Text Ads"],
    authType: "oauth2",
    subPlatforms: [
      { id: "sponsored-content", name: "Sponsored Content", description: "Native ads in LinkedIn feed", logo: "📄", color: "#0a66c2" },
      { id: "sponsored-messaging", name: "Sponsored Messaging", description: "Direct messages to professionals", logo: "💬", color: "#0a66c2" },
      { id: "text-ads", name: "Text Ads", description: "Simple text-based ads", logo: "📝", color: "#0a66c2" },
      { id: "dynamic-ads", name: "Dynamic Ads", description: "Personalized ads using profiles", logo: "🎯", color: "#0a66c2" }
    ]
  },
  {
    id: "twitter-ads",
    name: "Twitter Ads",
    description: "Real-time conversation advertising",
    logo: "🐦",
    color: "#1da1f2",
    features: ["Promoted Tweets", "Promoted Accounts", "Promoted Trends", "Video Ads"],
    authType: "oauth2",
    subPlatforms: [
      { id: "promoted-tweets", name: "Promoted Tweets", description: "Amplify your tweets", logo: "🐦", color: "#1da1f2" },
      { id: "promoted-accounts", name: "Promoted Accounts", description: "Grow your follower base", logo: "👥", color: "#1da1f2" },
      { id: "promoted-trends", name: "Promoted Trends", description: "Feature in trending topics", logo: "📈", color: "#1da1f2" },
      { id: "twitter-video", name: "Video Ads", description: "Engaging video content", logo: "🎥", color: "#1da1f2" }
    ]
  }
];

interface PlatformSelectorProps {
  onPlatformSelect: (platform: AdPlatform) => void;
}

export function PlatformSelector({ onPlatformSelect }: PlatformSelectorProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  const handlePlatformSelect = (platform: AdPlatform) => {
    setSelectedPlatform(platform.id);
    setTimeout(() => {
      onPlatformSelect(platform);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
            <h1 className="text-4xl font-bold">AdFlow Fusion</h1>
          </motion.div>
          <h2 className="text-2xl font-semibold mb-2">Choose Your Ad Platform</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect to your preferred advertising platform to start analyzing your campaigns. 
            We support all major ad networks with real-time data synchronization.
          </p>
        </motion.div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 40, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="relative"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.03,
                  rotateY: 5,
                  z: 30
                }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredPlatform(platform.id)}
                onHoverEnd={() => setHoveredPlatform(null)}
                style={{ transformStyle: "preserve-3d" }}
                className="h-full"
              >
                <Card 
                  className={`cursor-pointer transition-all duration-500 relative overflow-hidden h-full ${
                    selectedPlatform === platform.id 
                      ? "ring-2 ring-primary shadow-2xl" 
                      : "hover:shadow-xl border-2 hover:border-primary/50"
                  }`}
                  style={{
                    background: hoveredPlatform === platform.id 
                      ? `linear-gradient(135deg, ${platform.color}10, transparent)`
                      : undefined
                  }}
                  onClick={() => handlePlatformSelect(platform)}
                >
                  {/* Popular badge */}
                  {platform.popular && (
                    <motion.div
                      initial={{ scale: 0, rotate: -12 }}
                      animate={{ scale: 1, rotate: -12 }}
                      transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                      className="absolute top-3 right-3 z-10"
                    >
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    </motion.div>
                  )}

                  {/* Background glow effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${platform.color}20, transparent 70%)`
                    }}
                    animate={{
                      opacity: hoveredPlatform === platform.id ? 0.3 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  <CardHeader className="relative z-10">
                    <motion.div
                      className="flex items-center gap-3 mb-3"
                      style={{ transform: hoveredPlatform === platform.id ? "translateZ(20px)" : "translateZ(0px)" }}
                    >
                      <motion.div 
                        className="text-4xl"
                        animate={{ 
                          scale: hoveredPlatform === platform.id ? [1, 1.2, 1] : 1,
                          rotate: hoveredPlatform === platform.id ? [0, 10, 0] : 0
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {platform.logo}
                      </motion.div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <motion.div 
                          className="text-xs text-muted-foreground flex items-center gap-1 mt-1"
                          style={{ transform: hoveredPlatform === platform.id ? "translateZ(10px)" : "translateZ(0px)" }}
                        >
                          <Globe className="h-3 w-3" />
                          {platform.authType === "oauth2" ? "OAuth2.0" : platform.authType === "api_key" ? "API Keys" : "OAuth2.0"}
                        </motion.div>
                      </div>
                    </motion.div>
                    <motion.p 
                      className="text-sm text-muted-foreground"
                      style={{ transform: hoveredPlatform === platform.id ? "translateZ(15px)" : "translateZ(0px)" }}
                    >
                      {platform.description}
                    </motion.p>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <motion.div 
                      className="space-y-2 mb-4"
                      style={{ transform: hoveredPlatform === platform.id ? "translateZ(10px)" : "translateZ(0px)" }}
                    >
                      {platform.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {feature}
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div
                      style={{ transform: hoveredPlatform === platform.id ? "translateZ(20px)" : "translateZ(0px)" }}
                    >
                      <Button 
                        className={`w-full transition-all duration-300 ${
                          selectedPlatform === platform.id 
                            ? "bg-green-600 hover:bg-green-700" 
                            : ""
                        }`}
                        style={{
                          background: hoveredPlatform === platform.id 
                            ? `linear-gradient(135deg, ${platform.color}, ${platform.color}dd)`
                            : undefined
                        }}
                      >
                        {selectedPlatform === platform.id ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Selected
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Connect
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </CardContent>

                  {/* Selection overlay */}
                  <AnimatePresence>
                    {selectedPlatform === platform.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-primary/10 flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="bg-green-600 text-white rounded-full p-3"
                        >
                          <CheckCircle className="h-8 w-8" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p>🔒 Your credentials are encrypted and stored securely</p>
          <p className="mt-1">Need help? Contact our support team anytime</p>
        </motion.div>
      </motion.div>
    </div>
  );
}