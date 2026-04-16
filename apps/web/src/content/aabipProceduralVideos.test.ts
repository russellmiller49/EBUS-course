import { describe, expect, it } from 'vitest';

import {
  AABIP_EBUS_PLAYLIST_ID,
  aabipProceduralVideoLibrary,
  getProceduralVideoEmbedUrl,
  getProceduralVideoWatchUrl,
} from '@/content/aabipProceduralVideos';

describe('aabip procedural videos', () => {
  it('maps the playlist into stable watch and embed urls', () => {
    const firstVideo = aabipProceduralVideoLibrary.videos[0];

    expect(aabipProceduralVideoLibrary.videos).toHaveLength(21);
    expect(firstVideo.title).toBe('EBUS Lymph Node Station 11R(s)');
    expect(getProceduralVideoWatchUrl(firstVideo.youtubeId)).toBe(
      `https://www.youtube.com/watch?v=${firstVideo.youtubeId}&list=${AABIP_EBUS_PLAYLIST_ID}`,
    );

    const embedUrl = getProceduralVideoEmbedUrl(firstVideo);
    expect(embedUrl).toContain(`https://www.youtube-nocookie.com/embed/${firstVideo.youtubeId}?`);
    expect(embedUrl).toContain(`list=${AABIP_EBUS_PLAYLIST_ID}`);
    expect(embedUrl).toContain('index=1');
  });
});
