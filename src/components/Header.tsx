import { Bell, Moon, Sun, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { useState } from "react";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  notificationCount: number;
}

export function Header({ isDarkMode, toggleDarkMode, notificationCount }: HeaderProps) {
  const [logoHover, setLogoHover] = useState(false);

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        backdropFilter: "blur(20px) saturate(180%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
      }}
    >
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo with enhanced effects */}
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        >
          <div className="relative">
            <motion.div 
              className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
              whileHover={{ 
                rotateY: 360,
                rotateX: 15,
                scale: 1.1
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                transformStyle: "preserve-3d",
                boxShadow: logoHover 
                  ? "0 8px 25px rgba(59, 130, 246, 0.5)" 
                  : "0 4px 15px rgba(59, 130, 246, 0.3)"
              }}
            />
            {/* Floating glow effect */}
            <motion.div 
              className="absolute inset-0 h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-sm"
              animate={{ 
                scale: logoHover ? [1, 1.4, 1] : [1, 1.2, 1],
                opacity: logoHover ? [0.2, 0.4, 0.2] : [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Orbital rings */}
            <motion.div
              className="absolute inset-0 w-8 h-8 border border-blue-400/30 rounded-lg"
              animate={{ rotateZ: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 w-8 h-8 border border-purple-400/20 rounded-lg"
              animate={{ rotateZ: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <motion.h1 
            className="font-bold tracking-tight"
            animate={{
              textShadow: logoHover 
                ? "0 0 20px rgba(139, 92, 246, 0.5)" 
                : "0 0 0px rgba(139, 92, 246, 0)"
            }}
          >
            AdFlow Fusion
          </motion.h1>
        </motion.div>

        {/* Right side controls with enhanced depth */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle with morphing animation */}
          <motion.div 
            whileHover={{ 
              scale: 1.1,
              rotateY: 20,
              z: 30
            }} 
            whileTap={{ scale: 0.9 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="relative h-9 w-9 overflow-hidden"
              style={{
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                background: "linear-gradient(145deg, var(--background), var(--muted))"
              }}
            >
              <motion.div
                key={isDarkMode ? "moon" : "sun"}
                initial={{ 
                  rotate: -180, 
                  opacity: 0, 
                  scale: 0.8,
                  y: 10
                }}
                animate={{ 
                  rotate: 0, 
                  opacity: 1, 
                  scale: 1,
                  y: 0
                }}
                exit={{ 
                  rotate: 180, 
                  opacity: 0, 
                  scale: 0.8,
                  y: -10
                }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                {isDarkMode ? (
                  <Moon className="h-4 w-4" style={{ filter: "drop-shadow(0 2px 4px rgba(139, 92, 246, 0.5))" }} />
                ) : (
                  <Sun className="h-4 w-4" style={{ filter: "drop-shadow(0 2px 4px rgba(251, 191, 36, 0.5))" }} />
                )}
              </motion.div>
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-purple-500" />
            </Button>
          </motion.div>

          {/* Notifications with floating badge */}
          <motion.div 
            className="relative"
            whileHover={{ 
              scale: 1.1,
              rotateZ: 5,
              z: 30
            }}
            whileTap={{ scale: 0.9 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 relative overflow-hidden"
              style={{
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                background: "linear-gradient(145deg, var(--background), var(--muted))"
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Bell className="h-4 w-4" />
              </motion.div>
            </Button>
            {notificationCount > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  y: [-1, 1, -1]
                }}
                transition={{
                  scale: { type: "spring", stiffness: 400, damping: 15 },
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -right-1 -top-1"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Badge 
                  variant="destructive" 
                  className="h-5 w-5 rounded-full p-0 text-xs shadow-lg"
                  style={{
                    boxShadow: "0 4px 15px rgba(212, 24, 61, 0.4)",
                    transform: "translateZ(10px)"
                  }}
                >
                  {notificationCount}
                </Badge>
                {/* Pulsing ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-500"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [1, 0, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.div>
            )}
          </motion.div>

          {/* User avatar with floating effect */}
          <motion.div 
            whileHover={{ 
              scale: 1.1,
              rotateY: 15,
              z: 30
            }} 
            whileTap={{ scale: 0.95 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{
                y: [-1, 1, -1],
                boxShadow: [
                  "0 4px 15px rgba(0,0,0,0.1)",
                  "0 8px 25px rgba(0,0,0,0.15)",
                  "0 4px 15px rgba(0,0,0,0.1)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Avatar className="h-8 w-8 cursor-pointer border-2 border-primary/20">
                <AvatarImage src="/api/placeholder/32/32" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              {/* Avatar glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/30"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Header bottom glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scaleX: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.header>
  );
}