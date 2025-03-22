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
import { initialState } from "@/entities/MedicalCard/сonst/const";
import { useAudioTranscription } from "@/shared/hooks/useSpeechToForm";

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

export function VoiceInputModal({
  open,
  onClose,
  token,
  onSave,
}: VoiceInputModalProps) {
  const [data, setData] = useState(initialState);
  const [proposedChanges, setProposedChanges] = useState<Partial<MedicalData>>(
    {}
  );
  const [mergeConfirm, setMergeConfirm] = useState<FieldKey | null>(null);

  const { startRecording, stopRecording, recording } = useAudioTranscription(
    token,
    (parsed: Partial<MedicalData>) => {
      const cleaned = Object.fromEntries(
        Object.entries(parsed).filter(
          ([, value]) => value.toString().trim() !== ""
        )
      ) as Partial<MedicalData>;
      setProposedChanges((prev) => ({ ...prev, ...cleaned }));
    },
    () => {},
    "record"
  );

  useEffect(() => {
    if (!open) {
      setProposedChanges({});
      setMergeConfirm(null);
    }
  }, [open]);

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
    setProposedChanges((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    setMergeConfirm(null);
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

  const handleSave = () => {
    onClose();
    onSave(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleSave();
      }}
      modal
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Medical Voice Input <Badge variant="outline">AI</Badge>
          </DialogTitle>
        </DialogHeader>

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

        <Button
          className="w-full mt-4"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
        >
          🎤 {recording ? "Listening..." : "Hold to Speak"}
        </Button>

        <Button onClick={handleSave} className="mt-6 w-full">
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
