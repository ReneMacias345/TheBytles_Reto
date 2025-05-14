export const cosineSimilarity = (vec1, vec2) => {
  console.log("vec1:", vec1?.slice(0, 5)); // just to avoid flooding
  console.log("vec2:", vec2?.slice(0, 5));

  if (
    !Array.isArray(vec1) ||
    !Array.isArray(vec2) ||
    vec1.length !== vec2.length
  ) {
    console.warn('Invalid vectors passed to cosineSimilarity:', vec1, vec2);
    return 0;
  }

  const dot = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));

  if (mag1 === 0 || mag2 === 0) {
    console.warn('Zero magnitude vector:', { mag1, mag2 });
    return 0;
  }

  const similarity = dot / (mag1 * mag2);
  const scaled = Math.min(similarity / 0.8, 1);

  const result = scaled * 100;
  console.log("Similarity %:", result.toFixed(2));

  return result;
};