import { Dispatch, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useSpeechToForm } from "@/shared/hooks/useSpeechToForm";
import { initialState } from "@/entities/MedicalCard/сonst/const";

interface MedicalData {
  reason: string;
  diagnosis: string;
  prescription: string;
  bp: number;
  heartRate: number;
  weight: number;
  height: number;
  notes: string;
}

interface VoiceInputModalProps {
  open: boolean;
  onClose: () => void;
  onSave: Dispatch<React.SetStateAction<MedicalData>>;
  token: string;
}

type FieldKey = keyof MedicalData;

enum Phase {
  Edit = "edit",
  AiRecord = "ai-record",
}

export function VoiceInputModal({
  open,
  onClose,
  token,
  onSave,
}: VoiceInputModalProps) {
  const [phase, setPhase] = useState<Phase>(Phase.Edit);
  const [proposedChanges, setProposedChanges] = useState<Partial<MedicalData>>(
    {}
  );
  const [mergeConfirm, setMergeConfirm] = useState<FieldKey | null>(null);
  const [data, setData] = useState(initialState);

  const { startListening, stopListening } = useSpeechToForm<MedicalData>(
    token,
    (parsed) => {
      const cleaned = Object.fromEntries(
        Object.entries(parsed).filter(
          ([, value]) => value.toString().trim() !== ""
        )
      ) as Partial<MedicalData>;

      setProposedChanges((prev) => ({ ...prev, ...cleaned }));
    },
    "medicalRecord",
    () => {
      stopListening();
      setPhase(Phase.Edit);
    }
  );

  useEffect(() => {
    if (!open) {
      stopListening();
      setProposedChanges({});
      setMergeConfirm(null);
      setPhase(Phase.Edit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (phase === Phase.AiRecord) {
      startListening();
    } else {
      stopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleChange = (key: FieldKey, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAccept = (key: FieldKey) => {
    const current = data[key].toString().trim();
    const proposed = proposedChanges[key]?.toString()?.trim() || "";

    const shouldMerge = !!current;

    if (shouldMerge && mergeConfirm !== key) {
      setMergeConfirm(key);
      return;
    }

    const finalValue = shouldMerge ? `${current} ${proposed}`.trim() : proposed;

    setData((prev) => ({ ...prev, [key]: finalValue }));
    setProposedChanges((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    setMergeConfirm(null);
  };

  const handleDecline = (key: FieldKey) => {
    if (mergeConfirm === key) {
      const proposed = proposedChanges[key]?.toString()?.trim() || "";
      setData((prev) => ({ ...prev, [key]: proposed }));

      setProposedChanges((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });

      setMergeConfirm(null);
    } else {
      setProposedChanges((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const renderField = (key: FieldKey, label: string) => {
    const newValue = proposedChanges[key];
    const showProposed =
      newValue !== undefined && (mergeConfirm === null || mergeConfirm === key);

    const isTextarea = [
      "reason",
      "diagnosis",
      "prescription",
      "notes",
    ].includes(key);

    return (
      <div className="space-y-1" key={key}>
        <label className="block text-sm font-medium text-muted-foreground">
          {label}
        </label>
        {isTextarea ? (
          <Textarea
            value={data[key]}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        ) : (
          <Input
            value={data[key]}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        )}

        {newValue && showProposed && (
          <div className="flex items-center justify-between mt-1 text-sm text-muted-foreground bg-muted p-2 rounded-md">
            <div className="flex-1 italic text-muted-foreground">
              {mergeConfirm === key
                ? "Merge with AI suggestion?"
                : `AI: ${newValue}`}
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleAccept(key)}
              >
                <Check className="w-4 h-4 text-green-500" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDecline(key)}
              >
                <X className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleStartAi = () => setPhase(Phase.AiRecord);

  const handleSave = () => {
    stopListening();
    onClose();
    onSave(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleSave();
        stopListening();
      }}
      modal
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Medical Voice Input <Badge variant="outline">AI</Badge>
          </DialogTitle>
        </DialogHeader>

        {phase === Phase.Edit ? (
          <>
            <form className="space-y-4">
              {renderField("reason", "Reason")}
              {renderField("diagnosis", "Diagnosis")}
              {renderField("prescription", "Prescription")}
              {renderField("bp", "Blood Pressure")}
              {renderField("heartRate", "Heart Rate")}
              {renderField("weight", "Weight")}
              {renderField("height", "Height")}
              {renderField("notes", "Notes")}
            </form>

            <Button onClick={handleStartAi} className="mt-6 w-full">
              🧠 Start AI Voice Input
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <p className="text-sm text-muted-foreground">
              🎤 Listening... Speak now
            </p>
          </div>
        )}

        <Button onClick={handleSave} className="mt-6 w-full">
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
