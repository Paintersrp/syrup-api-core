/**
 * Helper function to wait for a specific duration.
 * @param duration The duration to wait in milliseconds.
 * @returns A promise that resolves after the specified duration.
 */
export function waitAndRetry(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
