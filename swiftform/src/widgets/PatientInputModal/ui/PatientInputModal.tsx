import { useEffect, useState } from "react";
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

export type TPatient = {
  name: string;
  surname: string;
  phone: string;
  other: string;
};

interface VoiceInputModalProps {
  open: boolean;
  onClose: () => void;
  data: TPatient;
  setData: React.Dispatch<React.SetStateAction<TPatient>>;
  token: string;
}

type FieldKey = keyof VoiceInputModalProps["data"];

enum Phase {
  Edit = "edit",
  AiRecord = "ai-record",
}

export function PatientInputModal({
  open,
  onClose,
  data,
  setData,
  token,
}: VoiceInputModalProps) {
  const [phase, setPhase] = useState<Phase>(Phase.Edit);
  const [proposedChanges, setProposedChanges] = useState<Partial<typeof data>>(
    {}
  );
  const [mergeConfirm, setMergeConfirm] = useState<FieldKey | null>(null);

  const { startListening, stopListening } = useSpeechToForm(
    token,
    (parsed) => {
      const cleaned = Object.fromEntries(
        Object.entries(parsed).filter(
          ([, value]) => (value as string).trim() !== ""
        )
      ) as Partial<typeof data>;

      setProposedChanges((prev) => ({ ...prev, ...cleaned }));
      setPhase(Phase.Edit);
    },
    "patient",
    () => setPhase(Phase.Edit)
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
    const proposed = proposedChanges[key]?.trim() || "";

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
      const proposed = proposedChanges[key]?.trim() || "";
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

    return (
      <div className="space-y-1" key={key}>
        <label className="block text-sm font-medium text-muted-foreground">
          {label}
        </label>
        {key === "other" ? (
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
    setData(data);
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
            Create Patient <Badge variant="outline">AI</Badge>
          </DialogTitle>
        </DialogHeader>

        {phase === Phase.Edit ? (
          <>
            <form className="space-y-4">
              {renderField("name", "Name")}
              {renderField("surname", "Surname")}
              {renderField("phone", "Phone")}
              {renderField("other", "Other Info")}
            </form>

            <Button onClick={handleStartAi} className="mt-6 w-full">
              🧑‍🧠 Start AI Voice Input
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
