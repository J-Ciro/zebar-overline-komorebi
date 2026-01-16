import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import * as zebar from "zebar";
import { Center } from "./components/Center";
import { VolumeControl } from "./components/volume";
import "./styles/fonts.css";
import { hasProviderOutputChanged } from "./utils/performance";
import { withDefault, checkProviderOutput } from "./utils/safety";

const Media = lazy(() =>
  import("./components/media/Media").then((module) => ({
    default: module.Media,
  })),
);

const WindowTitle = lazy(() =>
  import("./components/windowTitle/WindowTitle").then((module) => ({
    default: module.WindowTitle,
  })),
);

const TilingControl = lazy(() =>
  import("./components/TilingControl").then((module) => ({
    default: module.TilingControl,
  })),
);

const WorkspaceControls = lazy(() =>
  import("./components/WorkspaceControls").then((module) => ({
    default: module.WorkspaceControls,
  })),
);

const Systray = lazy(() =>
  import("./components/systray").then((module) => ({
    default: module.Systray,
  })),
);

const DateDisplay = lazy(() =>
  import("./components/date/DateDisplay").then((module) => ({
    default: module.DateDisplay,
  })),
);

const SystemStats = lazy(() =>
  import("./components/stat/SystemStats").then((module) => ({
    default: module.SystemStats,
  })),
);

const ErrorBoundary = lazy(() =>
  import("./components/common/ErrorBoundary").then((module) => ({
    default: module.ErrorBoundary,
  })),
);

interface ProviderOutput {
  media?: zebar.MediaOutput | null;
  komorebi?: zebar.KomorebiOutput | null;
  audio?: zebar.AudioOutput | null;
  cpu?: zebar.CpuOutput | null;
  memory?: zebar.MemoryOutput | null;
  weather?: zebar.WeatherOutput | null;
  date?: zebar.DateOutput | null;
  systray?: zebar.SystrayOutput | null;
}

function App() {
  const [output, setOutput] = useState<ProviderOutput>({});
  const [providers] = useState(() =>
    zebar.createProviderGroup({
      media: { type: "media" },
      komorebi: { type: "komorebi", refreshInterval: 1000 },
      cpu: { type: "cpu" },
      date: { type: "date", formatting: "EEE d MMM t h:mm a", locale: "en-US" },
      memory: { type: "memory" },
      weather: { type: "weather", latitude: 6.0108, longitude: -75.4275 },
      audio: { type: "audio" },
      systray: { type: "systray" },
    }),
  );

  // Configurar el manejo de output
  useEffect(() => {
    const handleOutput = () => {
      setOutput((prevOutput) => {
        const newOutput = { ...providers.outputMap };

        // Only update state if meaningful changes occurred
        if (hasProviderOutputChanged(prevOutput, newOutput)) {
          return newOutput;
        }

        return prevOutput; // Skip update to prevent unnecessary re-renders
      });
    };

    providers.onOutput(handleOutput);

    return () => {
      // Note: Zebar ProviderGroup cleanup is handled automatically
      // The comment here documents that we've considered cleanup
    };
  }, [providers]);

  const statIconClassnames = "h-3 w-3 text-icon";

  const formattedDate = useMemo(() => {
    if (output?.date?.formatted) return output.date.formatted;

    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
      .format(new Date())
      .replace(/,/g, "");
  }, [output?.date?.formatted]);

  const handleMediaControls = useCallback(
    (action: "toggle" | "next" | "previous") => {
      switch (action) {
        case "toggle":
          output.media?.togglePlayPause?.();
          break;
        case "next":
          output.media?.next?.();
          break;
        case "previous":
          output.media?.previous?.();
          break;
      }
    },
    [output.media],
  );

  return (
    <div className="drama-20 relative flex justify-between items-center bg-background backdrop-blur-3xl text-text h-full antialiased select-none border rounded-lg border-app-border font-mono py-1.5 transition-all duration-300 ease-in-out hover:border-app-border/50">
      <div className="flex items-center gap-2 h-full z-10">
        <div className="flex items-center gap-1.5 h-full">
          <Suspense
            fallback={
              <div className="h-full w-24 bg-background-deeper/50 animate-pulse rounded" />
            }
          >
            <TilingControl komorebi={withDefault(output.komorebi, null)} />
          </Suspense>
        </div>
        <div className="flex items-center gap-2 h-full">
          <Suspense
            fallback={
              <div className="h-full w-32 bg-background-deeper/50 animate-pulse rounded" />
            }
          >
            <WorkspaceControls komorebi={withDefault(output.komorebi, null)} />
          </Suspense>
        </div>
        <div className="flex items-center gap-2 h-full">
          <ErrorBoundary
            fallback={
              <div className="w-[300px] h-full bg-background-deeper/50 animate-pulse rounded flex items-center justify-center">
                <span className="text-text/60 text-xs">Media unavailable</span>
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="w-[300px] h-full bg-background animate-pulse rounded" />
              }
            >
              <Media
                media={
                  output.media
                    ? {
                        ...output.media,
                        togglePlayPause: () => handleMediaControls("toggle"),
                        next: () => handleMediaControls("next"),
                        previous: () => handleMediaControls("previous"),
                      }
                    : null
                }
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      <div className="absolute w-full h-full flex items-center justify-center left-0">
        <Center>
          <Suspense
            fallback={
              <div className="h-full w-48 bg-background-deeper/50 animate-pulse rounded flex items-center justify-center">
                <span className="text-text/60 text-xs">Loading window...</span>
              </div>
            }
          >
            <WindowTitle komorebi={withDefault(output.komorebi, null)} />
          </Suspense>
        </Center>
      </div>

      <div className="flex gap-2 items-center h-full z-10">
        <div className="flex items-center h-full">
          <div className="flex items-center h-full">
            <Suspense
              fallback={
                <div className="h-full w-24 bg-background-deeper/50 animate-pulse rounded flex items-center justify-center">
                  <span className="text-text/60 text-xs">
                    Loading volume...
                  </span>
                </div>
              }
            >
              <ErrorBoundary
                fallback={
                  <div className="h-full bg-background-deeper/50 flex items-center justify-center px-2">
                    <span className="text-text/60 text-xs">
                      Volume unavailable
                    </span>
                  </div>
                }
              >
                <VolumeControl
                  playbackDevice={
                    checkProviderOutput(output.audio?.defaultPlaybackDevice)
                      ? { volume: output.audio.defaultPlaybackDevice.volume }
                      : null
                  }
                  setVolume={withDefault(
                    output.audio?.setVolume,
                    async () => {},
                  )}
                  statIconClassnames={statIconClassnames}
                />
              </ErrorBoundary>
            </Suspense>
          </div>
        </div>

        <div className="flex items-center h-full">
          <Suspense
            fallback={
              <div className="h-full w-20 bg-background-deeper/50 animate-pulse rounded flex items-center justify-center">
                <span className="text-text/60 text-xs">Loading stats...</span>
              </div>
            }
          >
            <ErrorBoundary
              fallback={
                <div className="h-full bg-background-deeper/50 flex items-center justify-center px-2">
                  <span className="text-text/60 text-xs">
                    Stats unavailable
                  </span>
                </div>
              }
            >
              <SystemStats
                cpu={output.cpu}
                memory={output.memory}
                statIconClassnames={statIconClassnames}
              />
            </ErrorBoundary>
          </Suspense>
        </div>

        {/*<div className="h-full flex items-center px-0.5 pr-1">
          <Suspense fallback={
            <div className="h-full w-16 bg-background-deeper/50 animate-pulse rounded flex items-center justify-center">
              <span className="text-text/60 text-xs">Loading systray...</span>
            </div>
          }>
            <Systray systray={withDefault(output.systray, null)} />
          </Suspense>
        </div>*/}

        <div className="h-full flex items-center justify-center pr-2">
          <Suspense
            fallback={
              <div className="h-full w-20 bg-background-deeper/50 animate-pulse rounded flex items-center justify-center">
                <span className="text-text/60 text-xs">Loading date...</span>
              </div>
            }
          >
            <DateDisplay formattedDate={formattedDate} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;
