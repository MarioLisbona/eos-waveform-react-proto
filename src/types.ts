import { WaveformColor } from "peaks.js";

export type AudioDataProps = {
  audioUrl: string;
  audioContentType: string;
  waveformDataUrl: string;
};

export type TestSegmentProps = {
  id?: string;
  fileName: string;
  startTime: number;
  endTime: number;
  editable?: boolean;
  color?: WaveformColor;
  labelText?: string;
  formErrors: FormErrorsProps;
};

export type FormErrorsProps = {
  fileNameError: boolean;
  startTimeError: boolean;
  endTimeError: boolean;
  isCreated: boolean;
};

export type OverviewOptionsConfigProps = (
  overviewWaveformRef: React.RefObject<HTMLDivElement>
) => {
  container: HTMLDivElement | null;
  waveformColor: string;
  playedWaveformColor: string;
  highlightColor: string;
  showPlayheadTime: boolean;
  playheadTextColor: string;
};

export type ZoomviewOptionsConfigProps = (
  zoomviewWaveformRef: React.RefObject<HTMLDivElement>
) => {
  container: HTMLDivElement | null;
  waveformColor: string;
  playedWaveformColor: string;
  playheadColor: string;
  playheadTextColor: string;
  showPlayheadTime: boolean;
  timeLabelPrecision: number;
};
