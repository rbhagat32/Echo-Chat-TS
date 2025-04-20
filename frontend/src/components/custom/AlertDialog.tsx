import {
  AlertDialog as AlertDialogShadCN,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PropTypes {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
}

export function AlertDialog({
  title = "Are you absolutely sure?",
  description = "",
  children,
  onConfirm,
}: PropTypes) {
  return (
    <AlertDialogShadCN>
      {/* pass the element which will trigger the alert pop-up as children */}
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent className="bg-zinc-900">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-zinc-200 hover:bg-zinc-50"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogShadCN>
  );
}
