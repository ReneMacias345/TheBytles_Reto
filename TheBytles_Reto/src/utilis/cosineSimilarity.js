export const cosineSimilarity = (vec1, vec2, threshold = 0.8) => {
  if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length) {
    console.warn('Invalid vectors passed to cosineSimilarity:', vec1, vec2);
    return 0;
  }
  
  const dot  = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  if (mag1 === 0 || mag2 === 0) return 0;
  const raw = dot / (mag1 * mag2);

  const scaled = raw <= 0
    ? 0
    : raw >= threshold
      ? 1
      : raw / threshold;

  return scaled * 100;
};