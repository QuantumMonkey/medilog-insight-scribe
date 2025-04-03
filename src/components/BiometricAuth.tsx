
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Fingerprint, Shield, Lock } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { requestBiometricAuth, getSecurityConfig } from '@/services/securityService';

interface BiometricAuthProps {
  onAuthSuccess: () => void;
  onAuthFailure?: () => void;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({ 
  onAuthSuccess, 
  onAuthFailure = () => {} 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const { toast } = useToast();

  const handleAuth = async () => {
    setAuthenticating(true);
    try {
      const success = await requestBiometricAuth();
      if (success) {
        toast({
          title: "Authentication successful",
          description: "Your identity has been verified.",
        });
        setIsOpen(false);
        
        // Set app as active when authenticated
        window.addEventListener('focus', handleAppActive);
        window.addEventListener('blur', handleAppInactive);
        
        onAuthSuccess();
      } else {
        toast({
          title: "Authentication failed",
          description: "Unable to verify your identity. Please try again.",
          variant: "destructive"
        });
        onAuthFailure();
      }
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "An error occurred during authentication.",
        variant: "destructive"
      });
      onAuthFailure();
    } finally {
      setAuthenticating(false);
    }
  };

  // Handle app becoming active (foreground)
  const handleAppActive = () => {
    // App is now in foreground
    console.log("App is active/foreground");
  };

  // Handle app becoming inactive (background)
  const handleAppInactive = () => {
    // App is now in background
    console.log("App is inactive/background");
    // Future implementation: This is where we'd lock the app when it goes to background
  };

  useEffect(() => {
    // Check if authentication is required
    const checkAuth = async () => {
      const config = getSecurityConfig();
      if (!config?.biometricEnabled) {
        // If biometrics disabled, auto-succeed
        setIsOpen(false);
        onAuthSuccess();
      }
    };
    
    checkAuth();

    // Cleanup listeners when component unmounts
    return () => {
      window.removeEventListener('focus', handleAppActive);
      window.removeEventListener('blur', handleAppInactive);
    };
  }, [onAuthSuccess]);

  // If dialog is closed without authentication, call failure handler
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onAuthFailure();
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Secure Authentication Required
          </DialogTitle>
          <DialogDescription>
            Your medical data is protected. Please use biometric authentication to continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <Fingerprint className="h-16 w-16 text-primary" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Touch the fingerprint sensor on your device to verify your identity
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAuth} disabled={authenticating}>
            {authenticating ? (
              <>Authenticating...</>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Authenticate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BiometricAuth;
