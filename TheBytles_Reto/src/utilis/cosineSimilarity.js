export const cosineSimilarity = (vec1, vec2, threshold = 0.8) => {
  if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length) {
    console.warn('Invalid vectors passed to cosineSimilarity:', vec1, vec2);
    return 0;
  }

  let dot = 0;
  for (let i = 0; i < vec1.length; i++) {
    dot += vec1[i] * vec2[i];
  }
  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  if (mag1 === 0 || mag2 === 0) return 0;
  const raw = dot / (mag1 * mag2);

  if (raw <= 0) return 0;
  if (raw >= threshold) return 100;
  return (raw / threshold) * 100;
};