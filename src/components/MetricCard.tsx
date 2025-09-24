import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useRef, useCallback } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  description: string;
  data: Array<{ name: string; value: number }>;
  color: string;
  delay?: number;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType, 
  description, 
  data, 
  color,
  delay = 0 
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    
    setMousePosition({ x: rotateY, y: rotateX });
  }, []);

  const getTrendIcon = () => {
    switch (changeType) {
      case "increase":
        return <TrendingUp className="h-4 w-4" />;
      case "decrease":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case "increase":
        return "text-green-600 dark:text-green-400";
      case "decrease":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, rotateX: -15, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: isHovered ? mousePosition.y : 0,
        rotateY: isHovered ? mousePosition.x : 0,
        scale: 1,
        z: isHovered ? 50 : 0
      }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      whileHover={{ 
        scale: 1.05,
        z: 100,
        transition: { duration: 0.2 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      className="group cursor-pointer perspective-1000"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 transform-gpu backdrop-blur-sm bg-card/80">
        {/* Enhanced gradient overlay with depth */}
        <div 
          className="absolute top-0 left-0 w-full h-2 opacity-80 shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${color}, ${color}60, ${color}40)`,
            boxShadow: `0 4px 8px ${color}40`
          }}
        />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-30"
              style={{ backgroundColor: color }}
              animate={{
                x: [0, Math.random() * 100, 0],
                y: [0, Math.random() * 100, 0],
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
              initial={{
                x: Math.random() * 300,
                y: Math.random() * 200
              }}
            />
          ))}
        </div>
        
        {/* Multi-layered background glow with depth */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${color}60, ${color}20 40%, transparent 70%)`,
            transform: "translateZ(10px)"
          }}
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Inner glow effect */}
        <motion.div
          className="absolute inset-2 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{ 
            background: `linear-gradient(45deg, transparent, ${color}10, transparent)`,
            transform: "translateZ(5px)"
          }}
        />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <motion.div
              animate={{ rotateY: isHovered ? [0, 5, 0] : 0 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, rotateZ: 360 }}
              transition={{ duration: 0.5 }}
              className={`flex items-center space-x-1 ${getTrendColor()}`}
              style={{ 
                transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
                filter: `drop-shadow(0 4px 8px ${color}40)`
              }}
            >
              {getTrendIcon()}
              <span className="text-sm">{Math.abs(change)}%</span>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          <div className="space-y-2">
            <motion.div 
              className="text-3xl font-bold relative"
              initial={{ scale: 0.8, opacity: 0, rotateX: -20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotateX: 0,
                z: isHovered ? 30 : 0
              }}
              transition={{ delay: delay + 0.2, duration: 0.6 }}
              style={{ 
                textShadow: `0 2px 4px ${color}30`,
                transform: isHovered ? "translateZ(30px)" : "translateZ(0px)"
              }}
            >
              {value}
              {/* Floating number effect */}
              <motion.div
                className="absolute inset-0 text-3xl font-bold opacity-20"
                animate={{
                  y: [-2, 2, -2],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ color }}
              >
                {value}
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-sm text-muted-foreground"
              style={{ 
                transform: isHovered ? "translateZ(15px)" : "translateZ(0px)"
              }}
            >
              {description}
            </motion.p>
          </div>

          {/* Enhanced mini chart with depth */}
          <motion.div 
            className="h-16 w-full relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.4, duration: 0.6 }}
            style={{ 
              transform: isHovered ? "translateZ(25px)" : "translateZ(0px)",
              filter: isHovered ? `drop-shadow(0 8px 16px ${color}30)` : "none"
            }}
          >
            {/* Chart background glow */}
            <div 
              className="absolute inset-0 rounded-lg opacity-20 blur-sm"
              style={{ backgroundColor: color }}
            />
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    boxShadow: `0 8px 32px ${color}20`,
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: color,
                    stroke: 'var(--background)',
                    strokeWidth: 3,
                    filter: `drop-shadow(0 0 8px ${color})`
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Enhanced status badge with floating effect */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotateY: -45 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: delay + 0.6, duration: 0.4 }}
            style={{ 
              transform: isHovered ? "translateZ(20px)" : "translateZ(0px)"
            }}
          >
            <motion.div
              animate={{
                y: [-1, 1, -1],
                boxShadow: [
                  `0 4px 8px ${color}20`,
                  `0 8px 16px ${color}30`,
                  `0 4px 8px ${color}20`
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Badge 
                variant="secondary" 
                className="text-xs px-3 py-1 backdrop-blur-sm"
                style={{ 
                  borderColor: color + "40", 
                  backgroundColor: color + "15",
                  boxShadow: `0 2px 8px ${color}20`
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-1"
                >
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: color }}
                  />
                  Live Data
                </motion.div>
              </Badge>
            </motion.div>
          </motion.div>
        </CardContent>

        {/* Enhanced border glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            border: `2px solid transparent`,
            background: `linear-gradient(45deg, ${color}20, transparent, ${color}20) border-box`,
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "exclude",
            opacity: isHovered ? 1 : 0
          }}
          animate={{
            opacity: isHovered ? [0, 1, 0] : 0,
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </Card>
    </motion.div>
  );
}