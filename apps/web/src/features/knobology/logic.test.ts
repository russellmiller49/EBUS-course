import { describe, expect, it } from 'vitest';

import { getDepthFrameIndex } from '@/features/knobology/logic';

describe('getDepthFrameIndex', () => {
  it('maps depth values to the nearest real EBUS depth frame', () => {
    expect(getDepthFrameIndex(0, 5)).toBe(0);
    expect(getDepthFrameIndex(28, 5)).toBe(0);
    expect(getDepthFrameIndex(40, 5)).toBe(1);
    expect(getDepthFrameIndex(68, 5)).toBe(2);
    expect(getDepthFrameIndex(82, 5)).toBe(3);
    expect(getDepthFrameIndex(100, 5)).toBe(4);
  });

  it('falls back safely when only one frame is available', () => {
    expect(getDepthFrameIndex(55, 1)).toBe(0);
  });
});
