import { useEffect, useRef } from 'react';

import {
  getKnobologyVideoSegmentEnd,
  getKnobologyVideoSegmentStart,
  type KnobologyVideoSegment,
} from '@/features/knobology/videoSegments';

const SEGMENT_START_OFFSET_SECONDS = 0.025;
const SEGMENT_LOOP_MARGIN_SECONDS = 0.045;

interface KnobologySegmentVideoProps {
  ariaLabel: string;
  className: string;
  paused?: boolean;
  segment: KnobologyVideoSegment;
  src: string;
}

function getSegmentStart(segment: KnobologyVideoSegment): number {
  return getKnobologyVideoSegmentStart(segment) + SEGMENT_START_OFFSET_SECONDS;
}

export function KnobologySegmentVideo({
  ariaLabel,
  className,
  paused = false,
  segment,
  src,
}: KnobologySegmentVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return undefined;
    }

    const seekToSegmentStart = () => {
      video.currentTime = getSegmentStart(segment);

      if (!paused) {
        void video.play().catch(() => undefined);
      }
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      seekToSegmentStart();
    } else {
      video.addEventListener('loadedmetadata', seekToSegmentStart, { once: true });
    }

    return () => {
      video.removeEventListener('loadedmetadata', seekToSegmentStart);
    };
  }, [paused, segment]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (paused) {
      video.pause();
      return;
    }

    void video.play().catch(() => undefined);
  }, [paused, segment]);

  useEffect(() => {
    const video = videoRef.current;
    let animationFrame = 0;

    if (!video || paused) {
      return undefined;
    }

    const start = getSegmentStart(segment);
    const end = getKnobologyVideoSegmentEnd(segment);

    const loopWithinSegment = () => {
      if (video.currentTime < start - 0.2 || video.currentTime >= end - SEGMENT_LOOP_MARGIN_SECONDS) {
        video.currentTime = start;
      }

      animationFrame = window.requestAnimationFrame(loopWithinSegment);
    };

    animationFrame = window.requestAnimationFrame(loopWithinSegment);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [paused, segment]);

  return (
    <video
      ref={videoRef}
      aria-label={ariaLabel}
      autoPlay={!paused}
      className={className}
      muted
      playsInline
      preload="metadata"
      src={src}
    />
  );
}
