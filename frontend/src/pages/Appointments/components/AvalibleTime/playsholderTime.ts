export const placeholderTimes = Array.from({ length: 21 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30;

  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");

  const minutes = (totalMinutes % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}`;
});