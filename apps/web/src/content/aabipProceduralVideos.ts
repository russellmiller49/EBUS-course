import videosData from '@/content/aabip-procedural-videos.json';
import type { ProceduralVideoContentItem, ProceduralVideoLibraryContent } from '@/content/types';

export const AABIP_EBUS_PLAYLIST_ID = 'PLz2NeO-gj6IW70aQwTFdU1IwU_b17639q';

export interface ProceduralVideoItem extends ProceduralVideoContentItem {
  embedUrl: string;
  watchUrl: string;
}

export interface ProceduralVideoLibrary extends Omit<ProceduralVideoLibraryContent, 'videos'> {
  videos: ProceduralVideoItem[];
}

export function getProceduralVideoWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}&list=${AABIP_EBUS_PLAYLIST_ID}`;
}

export function getProceduralVideoEmbedUrl(video: ProceduralVideoContentItem) {
  const params = new URLSearchParams({
    index: String(video.playlistIndex),
    list: AABIP_EBUS_PLAYLIST_ID,
    modestbranding: '1',
    rel: '0',
  });

  return `https://www.youtube-nocookie.com/embed/${video.youtubeId}?${params.toString()}`;
}

const proceduralVideoLibraryData = videosData as ProceduralVideoLibraryContent;

export const aabipProceduralVideoLibrary: ProceduralVideoLibrary = {
  ...proceduralVideoLibraryData,
  videos: proceduralVideoLibraryData.videos.map((video) => ({
    ...video,
    embedUrl: getProceduralVideoEmbedUrl(video),
    watchUrl: getProceduralVideoWatchUrl(video.youtubeId),
  })),
};
