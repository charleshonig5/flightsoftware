"use client";

import type { MaintenanceItem } from "@/lib/data/aircraft";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Modal } from "@/components/ui/Modal";
import { PillButton } from "@/components/ui/PillButton";

/**
 * Maintenance item detail modal — opened by clicking a schedule row anywhere
 * (dashboard preview or schedule tab). Info chips, linked-record field,
 * item actions, and the Log Completion primary.
 */
export function MaintenanceItemModal({
  item,
  open,
  onClose,
}: {
  item: MaintenanceItem | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!item) return null;
  return (
    <Modal open={open} onClose={onClose} title={item.title} subtitle={item.category}>
      <div className="mt-6 flex items-center gap-6">
        <div className="flex flex-col items-start gap-2">
          <p className="text-caption text-ink-muted">Status</p>
          <Chip tone={item.status.level}>{item.status.label}</Chip>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-caption text-ink-muted">Last Completed</p>
          <Chip tone="tile">{item.lastDone.replace(/^Last /, "")}</Chip>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-caption text-ink-muted">Interval</p>
          <Chip tone="tile">{item.interval}</Chip>
        </div>
      </div>

      <div className="relative mt-6 flex flex-col gap-1.5 rounded-field bg-tile px-3.5 py-2">
        <span className="text-caption text-ink-muted">Linked Record</span>
        <span className="text-body text-ink-faint">No record linked</span>
        <span className="absolute top-1/2 right-3.5 -translate-y-1/2">
          <PillButton variant="brand-outline">Link Record</PillButton>
        </span>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <PillButton>Edit Item</PillButton>
        <PillButton>Delete</PillButton>
      </div>

      <div className="mt-11 flex items-center gap-3.5">
        <Button fullWidth onClick={onClose}>
          Log Completion
        </Button>
        <Button fullWidth variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
