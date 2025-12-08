import { LabelType } from "../types/labelType";

export const systemStatThresholds = [
  { min: 0, max: 50, label: LabelType.DEFAULT },
  { min: 51, max: 80, label: LabelType.WARNING },
  { min: 81, max: 100, label: LabelType.DANGER },
];

export const weatherThresholds = [
  { min: -50, max: 10, label: LabelType.DANGER },    // Very Cold (Blue)
  { min: 11, max: 15, label: LabelType.WARNING },    // Cold (Light Blue)
  { min: 16, max: 25, label: LabelType.DEFAULT },    // Comfortable (Normal)
  { min: 26, max: 30, label: LabelType.WARNING },    // Warm (Light Orange)
  { min: 31, max: 50, label: LabelType.DANGER },     // Hot (Red)
]; 