import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, Zap } from "lucide-react";
import { AdPlatform, SubPlatform } from "./PlatformSelector";

interface SubPlatformSelectorProps {
  platform: AdPlatform;
  onSubPlatformSelect: (subPlatform: SubPlatform) => void;
  onBack: () => void;
}

export function SubPlatformSelector({ platform, onSubPlatformSelect, onBack }: SubPlatformSelectorProps) {
  const [selectedSubPlatforms, setSelectedSubPlatforms] = useState<SubPlatform[]>([]);
  const [hoveredSubPlatform, setHoveredSubPlatform] = useState<string | null>(null);

  const toggleSubPlatform = (subPlatform: SubPlatform) => {
    setSelectedSubPlatforms(prev => {
      const isSelected = prev.some(sp => sp.id === subPlatform.id);
      if (isSelected) {
        return prev.filter(sp => sp.id !== subPlatform.id);
      } else {
        return [...prev, subPlatform];
      }
    });
  };

  const handleContinue = () => {
    if (selectedSubPlatforms.length === 1) {
      onSubPlatformSelect(selectedSubPlatforms[0]);
    } else {
      // For multiple selections, we'll create a combined sub-platform
      const combinedSubPlatform: SubPlatform = {
        id: selectedSubPlatforms.map(sp => sp.id).join('-'),
        name: selectedSubPlatforms.map(sp => sp.name).join(' + '),
        description: `Multiple ${platform.name} platforms`,
        logo: platform.logo,
        color: platform.color
      };
      onSubPlatformSelect(combinedSubPlatform);
    }
  };

  if (!platform.subPlatforms || platform.subPlatforms.length === 0) {
    // If no sub-platforms, continue with the main platform
    const mainSubPlatform: SubPlatform = {
      id: platform.id,
      name: platform.name,
      description: platform.description,
      logo: platform.logo,
      color: platform.color
    };
    onSubPlatformSelect(mainSubPlatform);
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
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

          <div className="flex items-center gap-3 justify-center mb-6">
            <motion.div 
              className="text-4xl"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {platform.logo}
            </motion.div>
            <div className="text-left">
              <h2 className="text-2xl font-semibold">{platform.name}</h2>
              <p className="text-muted-foreground">Choose specific ad types to manage</p>
            </div>
          </div>
        </motion.div>

        {/* Sub-Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {platform.subPlatforms.map((subPlatform, index) => {
            const isSelected = selectedSubPlatforms.some(sp => sp.id === subPlatform.id);
            const isHovered = hoveredSubPlatform === subPlatform.id;
            
            return (
              <motion.div
                key={subPlatform.id}
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
                  onHoverStart={() => setHoveredSubPlatform(subPlatform.id)}
                  onHoverEnd={() => setHoveredSubPlatform(null)}
                  style={{ transformStyle: "preserve-3d" }}
                  className="h-full"
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-500 relative overflow-hidden h-full ${
                      isSelected 
                        ? "ring-2 ring-primary shadow-2xl bg-primary/5" 
                        : "hover:shadow-xl border-2 hover:border-primary/50"
                    }`}
                    style={{
                      background: isHovered 
                        ? `linear-gradient(135deg, ${subPlatform.color}10, transparent)`
                        : isSelected
                          ? `linear-gradient(135deg, ${subPlatform.color}15, transparent)`
                          : undefined
                    }}
                    onClick={() => toggleSubPlatform(subPlatform)}
                  >
                    {/* Background glow effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${subPlatform.color}20, transparent 70%)`
                      }}
                      animate={{
                        opacity: isHovered ? 0.3 : isSelected ? 0.2 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    <CardHeader className="relative z-10">
                      <motion.div
                        className="flex items-center gap-3 mb-3"
                        style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(0px)" }}
                      >
                        <motion.div 
                          className="text-3xl"
                          animate={{ 
                            scale: isHovered ? [1, 1.2, 1] : isSelected ? [1, 1.1, 1] : 1,
                            rotate: isHovered ? [0, 10, 0] : 0
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {subPlatform.logo}
                        </motion.div>
                        <div>
                          <CardTitle className="text-lg">{subPlatform.name}</CardTitle>
                        </div>
                      </motion.div>
                      <motion.p 
                        className="text-sm text-muted-foreground"
                        style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(0px)" }}
                      >
                        {subPlatform.description}
                      </motion.p>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <motion.div
                        style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(0px)" }}
                      >
                        <Button 
                          variant={isSelected ? "default" : "outline"}
                          className={`w-full transition-all duration-300 ${
                            isSelected 
                              ? "bg-green-600 hover:bg-green-700" 
                              : ""
                          }`}
                          style={{
                            background: isSelected 
                              ? "linear-gradient(135deg, #16a34a, #15803d)"
                              : isHovered 
                                ? `linear-gradient(135deg, ${subPlatform.color}, ${subPlatform.color}dd)`
                                : undefined
                          }}
                        >
                          {isSelected ? (
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
                              Select
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    </CardContent>

                    {/* Selection overlay */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute top-3 right-3"
                        >
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-green-600 text-white rounded-full p-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Summary */}
        {selectedSubPlatforms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Selected Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubPlatforms.map(sp => (
                        <Badge 
                          key={sp.id} 
                          variant="secondary"
                          style={{ 
                            backgroundColor: `${sp.color}20`,
                            color: sp.color,
                            borderColor: `${sp.color}40`
                          }}
                        >
                          {sp.logo} {sp.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handleContinue}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Continue with Selected
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Platforms
            </Button>
          </motion.div>

          <div className="text-center text-sm text-muted-foreground">
            <p>💡 You can select multiple ad types to manage them together</p>
          </div>

          {selectedSubPlatforms.length === 0 && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline"
                onClick={() => {
                  // Skip sub-platform selection and use main platform
                  const mainSubPlatform: SubPlatform = {
                    id: platform.id,
                    name: platform.name,
                    description: platform.description,
                    logo: platform.logo,
                    color: platform.color
                  };
                  onSubPlatformSelect(mainSubPlatform);
                }}
              >
                Skip & Use All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}