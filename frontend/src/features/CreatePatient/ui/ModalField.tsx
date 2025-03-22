import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/ui/input";

type TProps = {
  variant?: "textarea" | "input";
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
};

export const ModalField = (props: TProps) => {
  const { variant = "input", label, value, onChange } = props;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      {variant === "textarea" ? (
        <Textarea value={value} onChange={onChange} />
      ) : (
        <Input value={value} onChange={onChange} />
      )}

      {/* {newValue && showProposed && (
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
      )} */}
    </div>
  );
};
