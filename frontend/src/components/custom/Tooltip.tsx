import {
  TooltipContent,
  TooltipProvider,
  Tooltip as TooltipShadCN,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PropTypes {
  children: React.ReactNode;
  text: string;
}

export function Tooltip({ children, text }: PropTypes) {
  return (
    <TooltipProvider>
      <TooltipShadCN>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{text}</p>
        </TooltipContent>
      </TooltipShadCN>
    </TooltipProvider>
  );
}
