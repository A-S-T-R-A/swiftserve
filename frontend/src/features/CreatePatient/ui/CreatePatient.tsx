import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { postCreatePatient } from "../model/services";
import type { FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";

// export function CreatePatient() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const { mutate } = useMutation({
//     mutationKey: ["createPatient"],
//     mutationFn: postCreatePatient,
//   });

//   function onSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     // const formData = new FormData(e.currentTarget);

//     mutate(
//       {
//         name: new Date().getTime().toString(), //formData.get("name") as string,
//         surname: "test321", // formData.get("surname") as string,
//         phone: "123", //formData.get("phone") as string,
//         other: "32131", //formData.get("other-info") as string,
//       },
//       {
//         onSuccess: () => {
//           queryClient.invalidateQueries({ queryKey: ["usersData"] });
//           navigate({ to: "/" });
//         },
//       }
//     );
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button className="cursor-pointer">
//           <PlusIcon />
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Create Patient</DialogTitle>
//         </DialogHeader>
//         <form
//           id="create-patient-form"
//           onSubmit={onSubmit}
//           className="grid gap-4 py-4"
//         >
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="name" className="text-right">
//               Name
//             </Label>
//             <Input id="name" name="name" className="col-span-3" required />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="surname" className="text-right">
//               Surname
//             </Label>
//             <Input id="surname" name="surname" className="col-span-3" />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="phone" className="text-right">
//               Phone
//             </Label>
//             <Input id="phone" name="phone" className="col-span-3" />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="other-info" className="text-right">
//               Other info
//             </Label>
//             <Textarea
//               id="other-info"
//               name="other-info"
//               className="col-span-3"
//             />
//           </div>
//         </form>
//         <DialogFooter>
//           <Button
//             className="w-fit mr-auto cursor-pointer"
//             variant="cosmicOutline"
//           >
//             AI
//           </Button>
//           <Button
//             className="cursor-pointer"
//             type="submit"
//             form="create-patient-form"
//           >
//             Save
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { useSpeechToForm } from "@/shared/hooks/useSpeechToForm";
import { ModalField } from "./ModalField";

export type TPatient = {
  name: string;
  surname: string;
  phone: string;
  other: string;
};

enum Phase {
  Edit = "edit",
  AiRecord = "ai-record",
}

export function CreatePatient() {
  const [data, setData] = useState({});
  const [proposedChanges, setProposedChanges] = useState<Partial<any>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>(Phase.Edit);
  const [mergeConfirm, setMergeConfirm] = useState<any | null>(null);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["createPatient"],
    mutationFn: postCreatePatient,
  });

  function onSubmit() {
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["usersData"] });
        setIsOpen(false);
      },
    });
  }

  function onClose() {
    setIsOpen(false);
    setData({});
    setProposedChanges({});
    stopListening();
  }

  const { startListening, stopListening } = useSpeechToForm(
    "token",
    (parsed) => {
      const cleaned = Object.fromEntries(
        Object.entries(parsed).filter(
          ([, value]) => (value as string).trim() !== ""
        )
      ) as Partial<any>;

      setProposedChanges((prev) => ({ ...prev, ...cleaned }));
      setPhase(Phase.Edit);
    },
    "patient",
    () => setPhase(Phase.Edit)
  );

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setProposedChanges({});
      setMergeConfirm(null);
      setPhase(Phase.Edit);
    }
  }, [isOpen]);

  useEffect(() => {
    if (phase === Phase.AiRecord) {
      startListening();
    } else {
      stopListening();
    }
  }, [phase]);

  const handleChange = (key: any, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // const handleAccept = (key: any) => {
  //   // @ts-ignore
  //   const current = data[key].toString().trim();
  //   const proposed = proposedChanges[key]?.trim() || "";

  //   const shouldMerge = !!current;

  //   if (shouldMerge && mergeConfirm !== key) {
  //     setMergeConfirm(key);
  //     return;
  //   }

  //   const finalValue = shouldMerge ? `${current} ${proposed}`.trim() : proposed;

  //   setData((prev) => ({ ...prev, [key]: finalValue }));
  //   setProposedChanges((prev) => {
  //     const updated = { ...prev };
  //     delete updated[key];
  //     return updated;
  //   });
  //   setMergeConfirm(null);
  // };

  // const handleDecline = (key: any) => {
  //   if (mergeConfirm === key) {
  //     const proposed = proposedChanges[key]?.trim() || "";
  //     setData((prev) => ({ ...prev, [key]: proposed }));

  //     setProposedChanges((prev) => {
  //       const updated = { ...prev };
  //       delete updated[key];
  //       return updated;
  //     });

  //     setMergeConfirm(null);
  //   } else {
  //     setProposedChanges((prev) => {
  //       const updated = { ...prev };
  //       delete updated[key];
  //       return updated;
  //     });
  //   }
  // };

  const handleStartAi = () => setPhase(Phase.AiRecord);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="cursor-pointer">
        <PlusIcon />
      </Button>
      <Dialog
        open={isOpen}
        onOpenChange={(v) => (v ? setIsOpen(true) : onClose())}
        modal
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Create Patient
            </DialogTitle>
          </DialogHeader>

          {phase === Phase.Edit ? (
            <>
              <div className="space-y-4">
                <ModalField
                  label="Name"
                  value={data.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  // proposedValue={proposedChanges.name}
                  // onAccept={handleAccept}
                  // onDecline={handleDecline}
                />
                <ModalField
                  label="Surname"
                  value={data.surname}
                  onChange={(e) => handleChange("surname", e.target.value)}
                  // proposedValue={proposedChanges.surname}
                  // onAccept={handleAccept}
                  // onDecline={handleDecline}
                />
                <ModalField
                  key="phone"
                  label="Phone"
                  value={data.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  // proposedValue={proposedChanges.phone}
                  // onAccept={handleAccept}
                  // onDecline={handleDecline}
                />
                <ModalField
                  key="other"
                  label="Other Info"
                  value={data.other}
                  onChange={(e) => handleChange("other", e.target.value)}
                  // proposedValue={proposedChanges.other}
                  // onAccept={handleAccept}
                  // onDecline={handleDecline}
                />
              </div>

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

          <Button onClick={onSubmit} className="mt-6 w-full">
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
