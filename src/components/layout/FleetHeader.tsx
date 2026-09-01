import { Button } from "@/components/ui/Button";
import { AddCircleIcon } from "@/components/ui/icons";
import { AskAiButton } from "./AskAiButton";
import { Greeting } from "./Greeting";

/** v2 dashboard header: time-of-day greeting left, hero actions right. */
export function FleetHeader() {
  return (
    /* items-start: the hero actions top-align with the greeting line, not
       center on the greeting + date block */
    <header className="flex items-start justify-between">
      <Greeting />
      <div className="flex items-center gap-3.5">
        <Button size="lg" variant="outline">
          <AddCircleIcon className="size-5" />
          Add Aircraft
        </Button>
        <AskAiButton />
      </div>
    </header>
  );
}
