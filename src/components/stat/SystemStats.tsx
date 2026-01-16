import React from "react";
import { Chip } from "../common/Chip";
import { Stat } from ".";
import { systemStatThresholds } from "./defaults/thresholds";
import * as zebar from "zebar";
import { cn } from "../../utils/cn";
import { LabelType } from "./types/labelType";

interface SystemStatsProps {
  cpu?: zebar.CpuOutput | null;
  memory?: zebar.MemoryOutput | null;
  statIconClassnames: string;
}

function getThresholdLabel(value: number, threshold = systemStatThresholds) {
  const range = threshold.find((r: any) => value >= r.min && value <= r.max);
  return range ? range.label : LabelType.DEFAULT;
}

export const SystemStats = React.memo(function SystemStats({
  cpu,
  memory,
  statIconClassnames,
}: SystemStatsProps) {
  return (
    <Chip className="flex items-center gap-3 h-full">
      {cpu && (
        <Stat
          Icon={<p className="font-medium text-icon">CPU</p>}
          stat={`${Math.round(cpu.usage)}%`}
          type="ring"
        />
      )}

      {memory && (
        <Stat
          Icon={<p className="font-medium text-icon">RAM</p>}
          stat={`${Math.round(memory.usage)}%`}
          type="ring"
        />
      )}
    </Chip>
  );
});