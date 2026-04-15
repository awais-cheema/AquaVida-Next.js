/**
 * Global timeline for hero cinematic overlays.
 *
 * All overlays use canonical DESKTOP_TOTAL (600) frames as the source of truth.
 * This module scales those frames to match the actual totalFrames of the device.
 */

const DESKTOP_TOTAL = 600;

export interface OverlayRange {
    start: number;
    end: number;
    exitStart: number;
    exitEnd: number;
}

export const getF = (f: number, isMobile: boolean, currentTotal: number) => {
    if (!isMobile) return f;
    return Math.floor(f * (currentTotal / DESKTOP_TOTAL));
};

export const TIMELINE = {
    OV1: { start: 0,   end: 15,  exitStart: 15,  exitEnd: 35 },
    OV2: { start: 65,  end: 74,  exitStart: 93,  exitEnd: 100 },
    // OV3 is custom (Our Services)
    OV3_T1: { start: 120, end: 128, exitStart: 135 },
    OV3_T2: { start: 135, full: 142, end: 176, exit: 183 },
    
    OV4: { start: 185, end: 195, exitStart: 215, exitEnd: 230 },
    OV5: { start: 252, end: 262, exitStart: 287, exitEnd: 301 },
    OV6: { start: 318, end: 335, exitStart: 342, exitEnd: 350 },
    
    OV7: { start: 348, end: 352, exitStart: 365, exitEnd: 373, sound: 352 },
    
    OV8: { start: 430, end: 442, exitStart: 516, exitEnd: 532 },
    OV9: { start: 553, end: 562, exitStart: 570, exitEnd: 578 },
    OV10: { start: 582, end: 586, exitStart: 588, exitEnd: 592 },
};
