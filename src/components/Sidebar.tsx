import { BarChart3, FileText, Plug, HelpCircle, Home, Settings, Target, ArrowLeftRight } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useState } from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSwitchPlatform?: () => void;
}

const sidebarItems = [
  { id: "dashboard", icon: Home, label: "Dashboard", color: "#3b82f6" },
  { id: "keywords", icon: Target, label: "Keywords", color: "#16a34a" },
  { id: "reports", icon: BarChart3, label: "Reports", color: "#8b5cf6" },
  { id: "switch-platform", icon: ArrowLeftRight, label: "Switch Platform", color: "#f97316" },
  { id: "integrations", icon: Plug, label: "Integrations", color: "#10b981" },
  { id: "settings", icon: Settings, label: "Settings", color: "#f59e0b" },
  { id: "support", icon: HelpCircle, label: "Support", color: "#ef4444" },
];

export function Sidebar({ activeTab, setActiveTab, onSwitchPlatform }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <TooltipProvider>
      <motion.aside 
        className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-16 border-r bg-sidebar/80 backdrop-blur-xl"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredItem(null);
        }}
        whileHover={{
          rotateY: 3,
          scale: 1.02,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
        style={{
          transformStyle: "preserve-3d",
          background: "linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))"
        }}
      >
        {/* Dancing background effect */}
        <motion.div
          className="absolute inset-0 rounded-r-lg opacity-20"
          animate={{
            background: isHovered 
              ? [
                  "linear-gradient(0deg, #3b82f6, #8b5cf6)",
                  "linear-gradient(72deg, #8b5cf6, #10b981)",
                  "linear-gradient(144deg, #10b981, #f59e0b)",
                  "linear-gradient(216deg, #f59e0b, #ef4444)",
                  "linear-gradient(288deg, #ef4444, #3b82f6)",
                  "linear-gradient(360deg, #3b82f6, #8b5cf6)"
                ]
              : "linear-gradient(0deg, transparent, transparent)"
          }}
          transition={{ 
            duration: isHovered ? 3 : 0.5, 
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* Floating particles */}
        {isHovered && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                animate={{
                  x: [0, Math.random() * 60, 0],
                  y: [0, Math.random() * 400, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                initial={{
                  x: Math.random() * 60,
                  y: Math.random() * 400
                }}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col items-center py-6 space-y-4 relative z-10">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isItemHovered = hoveredItem === item.id;
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ 
                      scale: 1.2,
                      rotateY: 15,
                      z: 30
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.div
                      animate={{
                        y: isHovered ? [-2, 2, -2] : 0,
                        rotateZ: isItemHovered ? [0, 5, -5, 0] : 0
                      }}
                      transition={{
                        y: { duration: 2 + index * 0.3, repeat: Infinity, ease: "easeInOut" },
                        rotateZ: { duration: 0.5 }
                      }}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="icon"
                        className={`h-10 w-10 relative overflow-hidden ${
                          isActive 
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        }`}
                        onClick={() => {
                          if (item.id === "switch-platform" && onSwitchPlatform) {
                            onSwitchPlatform();
                          } else {
                            setActiveTab(item.id);
                          }
                        }}
                        style={{
                          background: isActive 
                            ? `linear-gradient(135deg, ${item.color}, ${item.color}dd)`
                            : isItemHovered 
                              ? `linear-gradient(135deg, ${item.color}20, ${item.color}10)`
                              : undefined,
                          boxShadow: isActive 
                            ? `0 4px 15px ${item.color}40`
                            : isItemHovered
                              ? `0 2px 8px ${item.color}30`
                              : undefined
                        }}
                      >
                        <motion.div
                          animate={{
                            scale: isItemHovered ? [1, 1.2, 1] : isActive ? [1, 1.1, 1] : 1,
                            rotate: isItemHovered ? [0, 360] : 0
                          }}
                          transition={{
                            scale: { duration: 1, repeat: isItemHovered || isActive ? Infinity : 0 },
                            rotate: { duration: 2, repeat: isItemHovered ? Infinity : 0 }
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </motion.div>

                        {/* Pulsing ring effect */}
                        {(isActive || isItemHovered) && (
                          <motion.div
                            className="absolute inset-0 rounded-md border-2"
                            style={{ borderColor: item.color }}
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 0, 0.5]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                          />
                        )}

                        {/* Floating glow */}
                        {isItemHovered && (
                          <motion.div
                            className="absolute inset-0 rounded-md opacity-30 blur-sm"
                            style={{ backgroundColor: item.color }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}

                        {/* Active indicator with enhanced animation */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-md bg-gradient-to-r opacity-20"
                            style={{ 
                              background: `radial-gradient(circle, ${item.color}40, transparent)`
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: [0.2, 0.4, 0.2],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </motion.div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        
        {/* Enhanced active indicator */}
        <motion.div
          className="absolute left-0 w-1 rounded-r-full"
          style={{
            background: `linear-gradient(to bottom, ${
              sidebarItems.find(item => item.id === activeTab)?.color || "#3b82f6"
            }, ${
              sidebarItems.find(item => item.id === activeTab)?.color || "#3b82f6"
            }80)`
          }}
          initial={{ height: 0 }}
          animate={{ 
            height: 40,
            y: sidebarItems.findIndex(item => item.id === activeTab) * 56 + 24,
            boxShadow: [
              `0 0 10px ${sidebarItems.find(item => item.id === activeTab)?.color || "#3b82f6"}40`,
              `0 0 20px ${sidebarItems.find(item => item.id === activeTab)?.color || "#3b82f6"}60`,
              `0 0 10px ${sidebarItems.find(item => item.id === activeTab)?.color || "#3b82f6"}40`
            ]
          }}
          transition={{ 
            height: { type: "spring", stiffness: 300, damping: 30 },
            y: { type: "spring", stiffness: 300, damping: 30 },
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Side glow effect */}
        <motion.div
          className="absolute -right-1 top-0 bottom-0 w-2 opacity-0"
          style={{
            background: `linear-gradient(to right, transparent, ${
              sidebarItems.find(item => item.id === activeTab)?.color || "#3b82f6"
            }20)`
          }}
          animate={{
            opacity: isHovered ? [0, 0.5, 0] : 0
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      </motion.aside>
    </TooltipProvider>
  );
}