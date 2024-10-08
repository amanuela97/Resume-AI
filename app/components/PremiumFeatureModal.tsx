import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

interface PremiumFeatureModalProps {
  title: string;
  description: string;
  onAcknowledge: () => void;
  triggerOpen: boolean;
}

export default function PremiumFeatureModal({
  title,
  description,
  onAcknowledge,
  triggerOpen,
}: PremiumFeatureModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (triggerOpen) {
      setIsOpen(true);
    }
  }, [triggerOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onAcknowledge();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose}>Got it, thanks!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
