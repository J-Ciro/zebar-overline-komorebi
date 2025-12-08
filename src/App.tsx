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
import { TilingControl } from "./components/TilingControl";
import VolumeControl from "./components/volume";
import { WindowTitle } from "./components/windowTitle/WindowTitle";
import { WorkspaceControls } from "./components/WorkspaceControls";
import "./styles/fonts.css";
import Systray from "./components/systray";
import { DateDisplay } from "./components/date/DateDisplay";
import { SystemStats } from "./components/stat/SystemStats";

const Media = lazy(() => import("./components/media/Media"));

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
    })
  );

  // Configurar el manejo de output
  useEffect(() => {
    const handleOutput = () => {
      setOutput({ ...providers.outputMap });
    };

    providers.onOutput(handleOutput);

    return () => {
      // Limpieza opcional si es necesaria
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
    [output.media]
  );

  return (
    <div className="drama-20 relative flex justify-between items-center bg-background backdrop-blur-3xl text-text h-full antialiased select-none border rounded-lg border-app-border font-mono py-1.5 transition-all duration-300 ease-in-out hover:border-app-border/50">
      <div className="flex items-center gap-2 h-full z-10">
        <div className="flex items-center gap-1.5 h-full">
          <TilingControl komorebi={output.komorebi ?? null} />
        </div>
        <div className="flex items-center gap-2 h-full">
          <WorkspaceControls komorebi={output.komorebi ?? null} />
        </div>
        <div className="flex items-center justify-center gap-2 h-full">
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
        </div>
      </div>

      <div className="absolute w-full h-full flex items-center justify-center left-0">
        <Center>
          <WindowTitle komorebi={output.komorebi ?? null} />
        </Center>
      </div>

      <div className="flex gap-2 items-center h-full z-10">
        <div className="flex items-center h-full">
          <VolumeControl
            playbackDevice={
              output.audio?.defaultPlaybackDevice
                ? { volume: output.audio.defaultPlaybackDevice.volume }
                : null
            }
            setVolume={output.audio?.setVolume ?? (() => {})}
            statIconClassnames={statIconClassnames}
          />
        </div>

        <div className="flex items-center h-full">
          <SystemStats
            cpu={output.cpu}
            memory={output.memory}
            weather={output.weather}
            statIconClassnames={statIconClassnames}
          />
        </div>

        <div className="h-full flex items-center px-0.5 pr-1">
          {/* <Systray systray={output.systray ?? null} /> */}
        </div>

        <div className="h-full flex items-center justify-center pr-2">
          <DateDisplay formattedDate={formattedDate} />
        </div>
      </div>
    </div>
  );
}

export default App;
