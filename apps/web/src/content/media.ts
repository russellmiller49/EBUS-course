import knobologyMediaData from '@/content/knobology-media.json';
import stationMediaData from '@/content/station-media.json';
import type { KnobologyControlId, KnobologyMediaEntry, StationMediaEntry } from '@/content/types';

export const stationMedia = stationMediaData as Record<string, StationMediaEntry>;
export const knobologyMedia = knobologyMediaData as Record<KnobologyControlId, KnobologyMediaEntry>;

export function getStationMedia(stationId: string): StationMediaEntry {
  return stationMedia[stationId] ?? {};
}

export function getKnobologyMedia(controlId: KnobologyControlId): KnobologyMediaEntry {
  return knobologyMedia[controlId] ?? {};
}

export function getStationPrimaryMedia(
  media: StationMediaEntry,
  viewId: 'ct' | 'bronchoscopy' | 'ultrasound',
): { kind: 'image' | 'video'; src: string } | null {
  if (viewId === 'ct') {
    if (media.ctAnnotatedImage) {
      return { kind: 'image', src: media.ctAnnotatedImage };
    }

    if (media.ctImage) {
      return { kind: 'image', src: media.ctImage };
    }
  }

  if (viewId === 'bronchoscopy') {
    if (media.bronchoscopyVideo) {
      return { kind: 'video', src: media.bronchoscopyVideo };
    }

    if (media.bronchoscopyImage) {
      return { kind: 'image', src: media.bronchoscopyImage };
    }
  }

  if (viewId === 'ultrasound') {
    if (media.ebusVideo) {
      return { kind: 'video', src: media.ebusVideo };
    }

    if (media.ebusImage) {
      return { kind: 'image', src: media.ebusImage };
    }
  }

  return null;
}
