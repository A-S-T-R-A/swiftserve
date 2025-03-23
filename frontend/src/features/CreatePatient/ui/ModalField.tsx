import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Check, X } from "lucide-react";

type TProps = {
  variant?: "textarea" | "input";
  label: string;
  value: string;
  proposedValue?: string;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onAccept: () => void;
  onDecline: () => void;
};

export const ModalField = (props: TProps) => {
  const {
    variant = "input",
    label,
    value,
    proposedValue,
    onChange,
    onAccept,
    onDecline,
  } = props;

  const isProposedShown = Boolean(proposedValue);

  return (
    <div className="space-y-1 w-full">
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      {variant === "textarea" ? (
        <Textarea value={value} onChange={onChange} />
      ) : (
        <Input value={value} onChange={onChange} />
      )}

      {isProposedShown && (
        <div className="flex items-center justify-between mt-1 text-sm text-muted-foreground bg-muted p-2 rounded-md">
          <div className="flex-1 italic text-muted-foreground">
            {proposedValue}
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onAccept}
            >
              <Check className="w-4 h-4 text-green-500" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onDecline}
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
