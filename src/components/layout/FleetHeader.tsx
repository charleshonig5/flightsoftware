import { Button } from "@/components/ui/Button";
import { AddCircleIcon } from "@/components/ui/icons";
import { AskAiButton } from "./AskAiButton";
import { Greeting } from "./Greeting";

/** v2 dashboard header: time-of-day greeting left, hero actions right. */
export function FleetHeader() {
  return (
    <header className="flex items-center justify-between">
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
