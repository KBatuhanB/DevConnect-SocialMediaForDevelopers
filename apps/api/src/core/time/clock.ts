export type Clock = {
  now: () => Date;
  nowIso: () => string;
  nowMs: () => number;
};

export function createSystemClock(): Clock {
  return {
    now: () => new Date(),
    nowIso: () => new Date().toISOString(),
    nowMs: () => Date.now()
  };
}

export const systemClock = createSystemClock();