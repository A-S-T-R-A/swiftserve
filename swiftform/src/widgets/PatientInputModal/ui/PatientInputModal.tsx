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
import { useSpeechToForm } from "@/shared/hooks/useSpeechToForm";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface VoiceInputModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    name: string;
    surname: string;
    phone: string;
    other: string;
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      surname: string;
      phone: string;
      other: string;
    }>
  >;
  token: string;
}

type FieldKey = keyof VoiceInputModalProps["data"];

enum Phase {
  Edit = "edit",
  AiRecord = "ai-record",
}

enum ConfirmStatus {
  Accepted = "accepted",
  Declined = "declined",
  MergeConfirm = "merge-confirm",
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
  const [confirmed, setConfirmed] = useState<
    Partial<Record<FieldKey, ConfirmStatus>>
  >({});

  const { startListening, stopListening } = useSpeechToForm(
    token,
    (results) => {
      setProposedChanges(results);
      setPhase(Phase.Edit);
    },
    "patient"
  );

  useEffect(() => {
    if (!open) {
      stopListening();
      setPhase(Phase.Edit);
      setProposedChanges({});
      setConfirmed({});
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
    if (confirmed[key] === ConfirmStatus.MergeConfirm) {
      setData((prev) => ({
        ...prev,
        [key]: `${prev[key]} ${proposedChanges[key]}`.trim(),
      }));
    } else {
      setData((prev) => ({ ...prev, [key]: proposedChanges[key] || "" }));
    }
    setConfirmed((prev) => ({ ...prev, [key]: ConfirmStatus.Accepted }));
  };

  const handleDecline = (key: FieldKey) => {
    if (confirmed[key] === ConfirmStatus.MergeConfirm) {
      setConfirmed((prev) => ({ ...prev, [key]: ConfirmStatus.Declined }));
    } else {
      setConfirmed((prev) => ({ ...prev, [key]: ConfirmStatus.MergeConfirm }));
    }
  };

  const renderField = (key: FieldKey, label: string) => {
    const newValue = proposedChanges[key];
    const status = confirmed[key];
    const showProposed =
      newValue &&
      status !== ConfirmStatus.Accepted &&
      status !== ConfirmStatus.Declined;

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

        {showProposed && (
          <div className="flex items-center justify-between mt-1 text-sm text-muted-foreground bg-muted p-2 rounded-md">
            <div className="flex-1 italic text-muted-foreground">
              {status === ConfirmStatus.MergeConfirm
                ? "Merge with AI?"
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

  const handleStartAi = () => {
    setPhase(Phase.AiRecord);
  };

  const handleSave = () => {
    stopListening();
    onClose();
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
              🧠 Start AI Voice Input
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <p className="text-sm text-muted-foreground">
              🎙️ Listening... Speak now
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
