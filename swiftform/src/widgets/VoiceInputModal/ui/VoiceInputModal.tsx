import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSpeechToForm } from "@/shared/hooks/useSpeechToForm";

interface VoiceInputModalProps<T> {
  open: boolean;
  onClose: () => void;
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  token: string;
}

export function VoiceInputModal<T extends Record<string, string>>({
  open,
  onClose,
  setData,
  token,
}: VoiceInputModalProps<T>) {
  const [proposedChanges, setProposedChanges] = useState<Partial<T>>({});
  const [confirmed, setConfirmed] = useState(false);

  const { startListening, stopListening, listening } = useSpeechToForm<T>(
    token,
    setProposedChanges,
    "medicalRecord"
  );

  useEffect(() => {
    if (open) {
      startListening();
    } else {
      stopListening();
      setProposedChanges({});
      setConfirmed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleApplyChanges = () => {
    setData((prev) => ({ ...prev, ...proposedChanges }));
    setConfirmed(true);
    setTimeout(onClose, 50);
  };

  const handleClose = () => {
    stopListening();
    setProposedChanges({});
    setConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose} modal>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>🎙️ Voice Input</DialogTitle>
        </DialogHeader>

        {!listening && !Object.keys(proposedChanges).length && (
          <p>Listening stopped. No changes detected yet.</p>
        )}

        {listening && (
          <p className="text-sm text-muted-foreground">
            Listening... speak now.
          </p>
        )}

        {!!Object.keys(proposedChanges).length && (
          <div className="space-y-2 mt-4">
            <h3 className="font-semibold">Proposed Changes:</h3>
            {Object.entries(proposedChanges).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between text-sm border-b pb-1"
              >
                <span className="text-muted-foreground">{key}</span>
                <span>{value}</span>
              </div>
            ))}
            <Button onClick={handleApplyChanges} className="mt-4 w-full">
              Apply Changes
            </Button>
          </div>
        )}

        {confirmed && <p className="text-green-600 mt-2">Changes applied!</p>}
      </DialogContent>
    </Dialog>
  );
}
