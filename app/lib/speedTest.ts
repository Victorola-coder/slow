export const calculateSpeed = (bytes: number, milliseconds: number): number => {
  const bits = bytes * 8;
  const seconds = milliseconds / 1000;
  const megabitsPerSecond = bits / seconds / 1_000_000;
  return Math.round(megabitsPerSecond);
};

export const formatSpeed = (speed: number): string => {
  if (speed < 1) {
    return `${(speed * 1000).toFixed(1)} Kbps`;
  }
  return `${speed.toFixed(1)} Mbps`;
};

export const formatPing = (ping: number): string => {
  return `${Math.round(ping)} ms`;
};
