import React, { useCallback, useMemo, useRef } from "react";
import { MediaOutput } from "zebar";
import { cn } from "../../utils/cn";
import { Chip } from "../common/Chip";
import { ConditionalPanel } from "../common/ConditionalPanel";
import { ProgressBar } from "./components/ProgressBar";
import { Status } from "./components/Status";
import { TitleDetails } from "./components/TitleDetails";

export const TitleDetailsMemo = React.memo(TitleDetails);

type MediaProps = {
  media: MediaOutput | null;
};
// To allow cycling of Media sessions with Alt+Click we have to handle our own current session
// This is why there are two current sessions defined here:
// zebarCurrentSession: The actual session given from the Media provider.
// currentSession: Our own local state of Zebar session.
// This is not ideal and hopefully future Zebar releases will provide a way to change sessions internally.
export function Media({ media }: MediaProps) {
  if (!media) return null;

  const {
    allSessions,
    togglePlayPause,
    next,
    previous,
    currentSession: zebarCurrentSession,
  } = media;
  const zebarCurrentSessionIdx = useMemo(
    () =>
      allSessions.findIndex(
        (s) => s.sessionId === zebarCurrentSession?.sessionId
      ),
    [allSessions, zebarCurrentSession?.sessionId]
  );

  const sessionIdxRef = useRef<number>(
    zebarCurrentSessionIdx === -1 ? 0 : zebarCurrentSessionIdx
  );

  const [currentSessionIdx, setCurrentSessionIdx] = React.useState<number>(
    sessionIdxRef.current
  );

  const currentSession = useMemo(
    () => allSessions[currentSessionIdx],
    [allSessions, currentSessionIdx]
  );

  const handlePlayPause = useCallback(
    (e: React.MouseEvent, currentSessionIdx: number) => {
      const currentSession = allSessions[currentSessionIdx];

      if (e.shiftKey) {
        previous({ sessionId: currentSession?.sessionId });
        return;
      }

      if (e.ctrlKey) {
        next({ sessionId: currentSession?.sessionId });
        return;
      }

      if (e.altKey) {
        const nextIndex = sessionIdxRef.current < allSessions.length - 1 ? sessionIdxRef.current + 1 : 0;
        sessionIdxRef.current = nextIndex;
        setCurrentSessionIdx(nextIndex);
        return;
      }

      if (currentSession) {
        togglePlayPause({ sessionId: currentSession.sessionId });
      }
    },
    [allSessions, next, previous, togglePlayPause]
  );

  const buttonClassName = useMemo(
    () =>
      cn("flex gap-2 select-none cursor-pointer outline-none relative h-full"),
    []
  );

  const chipClassName = useMemo(
    () =>
      cn(
        "relative flex gap-2 select-none cursor-pointer overflow-clip group",
        "active:bg-background-deeper/90"
      ),
    []
  );

  return (
    <button
      className={buttonClassName}
      onClick={(e) => handlePlayPause(e, currentSessionIdx)}
    >
      <ConditionalPanel sessionActive={!!currentSession}>
        <Chip className={chipClassName}>
          <Status isPlaying={currentSession?.isPlaying ?? false} />
          <TitleDetailsMemo
            title={currentSession?.title}
            artist={currentSession?.artist}
            isPlaying={currentSession?.isPlaying ?? false}
          />
          <ProgressBar currentSession={currentSession} />
        </Chip>
      </ConditionalPanel>
    </button>
  );
}
