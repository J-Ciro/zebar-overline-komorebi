import { Chip } from "../common/Chip";
import Stat from ".";
import { weatherThresholds } from "./defaults/thresholds";
import { getWeatherIcon } from "../../utils/weatherIcons";
import * as zebar from "zebar";
import { cn } from "../../utils/cn";
import { LabelType } from "./types/labelType";

interface SystemStatsProps {
  cpu?: zebar.CpuOutput | null;
  memory?: zebar.MemoryOutput | null;
  weather?: zebar.WeatherOutput | null;
  statIconClassnames: string;
}

function getThresholdLabel(value: number, threshold = weatherThresholds) {
  const range = threshold.find((r) => value >= r.min && value <= r.max);
  return range ? range.label : LabelType.DEFAULT;
}

function getTemperatureColor(temp: number) {
  if (temp <= 10) return "text-blue-500/80"; // Very Cold
  if (temp <= 15) return "text-blue-400/70"; // Cold
  if (temp <= 25) return "text-success/90"; // Comfortable
  if (temp <= 30) return "text-warning/80"; // Warm
  return "text-danger/90"; // Hot
}

export function SystemStats({
  cpu,
  memory,
  weather,
  statIconClassnames,
}: SystemStatsProps) {
  return (
    <Chip
      className="flex items-center gap-3 h-full"
      as="button"
      onClick={() => {
        console.log(cpu);
      }}
    >
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

      {/* {weather && (
        <div className="flex items-center gap-1.5">
          {getWeatherIcon(weather, statIconClassnames)}
          <p className={getTemperatureColor(Math.round(weather.celsiusTemp))}>
            {`${Math.round(weather.celsiusTemp)}°C`}
          </p>
        </div>
      )} */}
    </Chip>
  );
}
