import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { CheckCircle, Circle, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const onboardingSteps = [
  {
    title: "Welcome to AdFlow Fusion! 🎉",
    description: "Let's get you set up with the most powerful ad analytics dashboard.",
    content: "We'll walk you through the key features in just a few steps.",
    action: "Let's start!"
  },
  {
    title: "Meet Your Match Types",
    description: "Broad, Phrase, and Exact match types each have their own interactive card.",
    content: "Click on any card to see detailed analytics, trends, and performance metrics.",
    action: "Got it!"
  },
  {
    title: "Customize Your Dashboard",
    description: "Drag and drop widgets to create your perfect layout.",
    content: "Resize cards and add new widgets to match your workflow perfectly.",
    action: "Awesome!"
  },
  {
    title: "Stay in the Loop",
    description: "Get real-time notifications and use our help chat whenever you need assistance.",
    content: "The notification bell keeps you updated, and our friendly mascot is always ready to help!",
    action: "I'm ready!"
  }
];

const checklist = [
  { id: 1, text: "Connect your first ad account", completed: false },
  { id: 2, text: "Set up performance alerts", completed: false },
  { id: 3, text: "Customize your dashboard layout", completed: false },
  { id: 4, text: "Explore match type analytics", completed: false },
];

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState(checklist);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setShowChecklist(false);
      setChecklistItems(checklist);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowChecklist(true);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const toggleChecklistItem = (id: number) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = checklistItems.filter(item => item.completed).length;
  const progressPercentage = showChecklist ? 
    (completedCount / checklistItems.length) * 100 : 
    ((currentStep + 1) / onboardingSteps.length) * 100;

  const currentStepData = onboardingSteps[currentStep] || onboardingSteps[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6"
        >
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </motion.div>
                {showChecklist ? "Quick Setup" : "Getting Started"}
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                Skip
              </Button>
            </div>
            
            <DialogDescription className="sr-only">
              {showChecklist 
                ? "Complete your setup checklist to get the most out of AdFlow Fusion" 
                : `Onboarding step ${currentStep + 1} of ${onboardingSteps.length}: ${currentStepData.description}`
              }
            </DialogDescription>
            
            <Progress value={progressPercentage} className="h-2" />
          </DialogHeader>

          <AnimatePresence mode="wait">
            {!showChecklist ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 mt-6"
              >
                <div className="space-y-3">
                  <h3 className="font-semibold">
                    {currentStepData.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentStepData.description}
                  </p>
                  <p className="text-sm">
                    {currentStepData.content}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {onboardingSteps.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index === currentStep ? "bg-primary" : "bg-muted"
                        }`}
                        animate={{ scale: index === currentStep ? 1.2 : 1 }}
                        role="progressbar"
                        aria-label={`Step ${index + 1} of ${onboardingSteps.length}`}
                        aria-current={index === currentStep ? "step" : undefined}
                      />
                    ))}
                  </div>
                  
                  <Button 
                    onClick={handleNext} 
                    className="flex items-center gap-2"
                    autoFocus={currentStep === 0}
                  >
                    {currentStepData.action}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 mt-6"
              >
                <div className="space-y-3">
                  <h3 className="font-semibold">Complete Your Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Check off these items to get the most out of AdFlow Fusion:
                  </p>
                </div>

                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50"
                      onClick={() => toggleChecklistItem(item.id)}
                    >
                      <motion.div
                        animate={{ scale: item.completed ? 1.2 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        {item.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </motion.div>
                      <span className={`text-sm flex-1 ${
                        item.completed ? "line-through text-muted-foreground" : ""
                      }`}>
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Badge variant="secondary">
                    {completedCount}/{checklistItems.length} completed
                  </Badge>
                  
                  <Button 
                    onClick={onClose}
                    variant={completedCount === checklistItems.length ? "default" : "outline"}
                  >
                    {completedCount === checklistItems.length ? "All Done! 🎉" : "Continue Later"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}