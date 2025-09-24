import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { OnboardingModal } from "./components/OnboardingModal";
import { HelpChat } from "./components/HelpChat";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PlatformSelector, AdPlatform } from "./components/PlatformSelector";
import { SubPlatformSelector, SubPlatform } from "./components/SubPlatformSelector";
import { ApiCredentialsForm, PlatformCredentials } from "./components/ApiCredentialsForm";
import { SimplifiedDashboardOptions } from "./components/SimplifiedDashboardOptions";
import { KeywordManager } from "./components/KeywordManager";
import { EnhancedDashboard } from "./components/EnhancedDashboard";

import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

type AppState = "platform-selection" | "sub-platform-selection" | "api-credentials" | "dashboard-options" | "dashboard";
type DashboardViewType = 'comprehensive' | 'categorized';

export default function App() {
  const [appState, setAppState] = useState<AppState>("platform-selection");
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform | null>(null);
  const [selectedSubPlatform, setSelectedSubPlatform] = useState<SubPlatform | null>(null);
  const [platformCredentials, setPlatformCredentials] = useState<PlatformCredentials | null>(null);
  const [dashboardViewType, setDashboardViewType] = useState<DashboardViewType>('comprehensive');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  // Handle window resize and initialization
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    toast.success(`Switched to ${!isDarkMode ? "dark" : "light"} mode`);
  };

  // Platform selection handlers
  const handlePlatformSelect = (platform: AdPlatform) => {
    setSelectedPlatform(platform);
    if (platform.subPlatforms && platform.subPlatforms.length > 0) {
      setAppState("sub-platform-selection");
    } else {
      setAppState("api-credentials");
    }
    toast.success(`Selected ${platform.name}!`);
  };

  const handleSubPlatformSelect = (subPlatform: SubPlatform) => {
    setSelectedSubPlatform(subPlatform);
    setAppState("api-credentials");
    toast.success(`Selected ${subPlatform.name}!`);
  };

  const handleCredentialsComplete = (credentials: PlatformCredentials) => {
    setPlatformCredentials(credentials);
    setAppState("dashboard-options");
    toast.success(`Successfully connected to ${selectedSubPlatform?.name || selectedPlatform?.name}!`);
  };

  const handleDashboardOptionSelect = (viewType: DashboardViewType) => {
    setDashboardViewType(viewType);
    setAppState("dashboard");
    setShowOnboarding(true);
    const viewName = viewType === 'comprehensive' ? 'All Campaigns View' : 'Campaign Categories View';
    toast.success(`Welcome to your ${viewName}! 🎉`);
  };

  const handleBackToPlatformSelection = () => {
    setSelectedPlatform(null);
    setSelectedSubPlatform(null);
    setPlatformCredentials(null);
    setDashboardViewType('comprehensive');
    setAppState("platform-selection");
  };

  const handleBackToSubPlatformSelection = () => {
    setSelectedSubPlatform(null);
    setAppState("sub-platform-selection");
  };

  const handleBackToCredentials = () => {
    setAppState("api-credentials");
  };

  const handleBackToDashboardOptions = () => {
    setAppState("dashboard-options");
  };

  // Welcome effect for dashboard
  useEffect(() => {
    if (appState === "dashboard") {
      const timer = setTimeout(() => {
        toast.success(`🚀 Your ${selectedSubPlatform?.name || selectedPlatform?.name} dashboard is ready!`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [appState, selectedPlatform, selectedSubPlatform]);

  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <div 
          className={`min-h-screen ${isDarkMode ? "dark" : ""}`}
          style={{
            background: isDarkMode 
              ? "radial-gradient(ellipse at top, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0.9) 50%, rgba(0, 0, 0, 1) 100%)"
                : "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 1) 100%)",
            minHeight: "100vh",
            position: "relative"
          }}
        >
          {/* Animated background particles */}
          {appState === "dashboard" && (
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/20 rounded-full"
                  animate={{
                    x: [0, Math.random() * windowSize.width, 0],
                    y: [0, Math.random() * windowSize.height, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 10 + Math.random() * 10,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                  initial={{
                    x: Math.random() * windowSize.width,
                    y: Math.random() * windowSize.height
                  }}
                />
              ))}
            </div>
          )}

          {/* Floating geometric shapes */}
          {appState === "dashboard" && (
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/10 rounded-full"
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute top-3/4 right-1/4 w-24 h-24 border border-purple-500/10 rounded-lg"
                animate={{
                  rotate: -360,
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Platform Selection Screen */}
            {appState === "platform-selection" && (
              <motion.div
                key="platform-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PlatformSelector onPlatformSelect={handlePlatformSelect} />
              </motion.div>
            )}

            {/* Sub Platform Selection Screen */}
            {appState === "sub-platform-selection" && (
              <motion.div
                key="sub-platform-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SubPlatformSelector 
                  platform={selectedPlatform}
                  onSubPlatformSelect={handleSubPlatformSelect}
                  onBack={handleBackToPlatformSelection}
                />
              </motion.div>
            )}

            {/* API Credentials Screen */}
            {appState === "api-credentials" && selectedPlatform && (
              <motion.div
                key="api-credentials"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <ApiCredentialsForm 
                  platform={selectedPlatform}
                  subPlatform={selectedSubPlatform}
                  onBack={selectedSubPlatform ? handleBackToSubPlatformSelection : handleBackToPlatformSelection}
                  onComplete={handleCredentialsComplete}
                />
              </motion.div>
            )}

            {/* Dashboard Options Screen */}
            {appState === "dashboard-options" && selectedPlatform && platformCredentials && (
              <motion.div
                key="dashboard-options"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <SimplifiedDashboardOptions
                  platform={selectedPlatform}
                  subPlatform={selectedSubPlatform}
                  credentials={platformCredentials}
                  onBack={handleBackToCredentials}
                  onOptionSelect={handleDashboardOptionSelect}
                />
              </motion.div>
            )}

            {/* Dashboard Screen */}
            {appState === "dashboard" && selectedPlatform && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                {/* Header */}
                <Header 
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                  notificationCount={notificationCount}
                />

                {/* Sidebar */}
                <Sidebar 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  onSwitchPlatform={handleBackToPlatformSelection}
                />

                {/* Main Content */}
                <main className="ml-16 pt-4 relative">
                  <div className="container px-6">
                    {/* Dashboard Content */}
                    {activeTab === "dashboard" && (
                      <EnhancedDashboard 
                        platform={selectedPlatform}
                        isDarkMode={isDarkMode}
                        viewType={dashboardViewType}
                        businessCategory={dashboardViewType}
                      />
                    )}

                    {/* Keywords Tab */}
                    {activeTab === "keywords" && selectedSubPlatform && (
                      <KeywordManager 
                        businessInfo={{ 
                          category: dashboardViewType,
                          name: `${selectedSubPlatform.name} Campaign`,
                          description: `${dashboardViewType} match-type analysis`,
                          goals: []
                        }}
                        subPlatform={selectedSubPlatform}
                        onComplete={() => {}}
                      />
                    )}

                    {/* Other tab content */}
                    {activeTab !== "dashboard" && activeTab !== "keywords" && (
                      <motion.div
                        initial={{ opacity: 0, y: 40, rotateX: -20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="text-center py-16"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <motion.h2 
                          className="mb-6 capitalize"
                          style={{ transform: "translateZ(20px)" }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {activeTab === "switch-platform" ? "Switch Platform" : activeTab}
                        </motion.h2>
                        <motion.p 
                          className="text-muted-foreground text-lg"
                          style={{ transform: "translateZ(10px)" }}
                        >
                          {activeTab === "reports" && `Detailed ${selectedPlatform.name} reporting and analytics coming soon.`}
                          {activeTab === "integrations" && `Manage your ${selectedPlatform.name} integrations and connections.`}
                          {activeTab === "settings" && `Configure your ${selectedPlatform.name} account settings.`}
                          {activeTab === "support" && `Get help with your ${selectedPlatform.name} campaigns.`}
                          {activeTab === "switch-platform" && `Returning to platform selection...`}
                        </motion.p>
                      </motion.div>
                    )}
                  </div>
                </main>

                {/* Onboarding Modal */}
                <OnboardingModal 
                  isOpen={showOnboarding}
                  onClose={() => setShowOnboarding(false)}
                />

                {/* Help Chat */}
                <HelpChat />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toast notifications */}
          <Toaster richColors position="top-right" />
        </div>
      </DndProvider>
    </ErrorBoundary>
  );
}