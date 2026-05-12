export function hasVisibleSteps(nextSteps: string[]): boolean {
  return nextSteps.some((step) => step.trim().length > 0);
}