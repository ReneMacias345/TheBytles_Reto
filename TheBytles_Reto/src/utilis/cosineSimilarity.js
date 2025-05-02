export const cosineSimilarity = (vec1, vec2) => {
    if (
      !Array.isArray(vec1) ||
      !Array.isArray(vec2) ||
      vec1.length !== vec2.length
    ) {
      console.warn('Invalid vectors passed to cosineSimilarity:', vec1, vec2);
      return 1; // distancia maxima
    }
  
    const dot = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  
    if (mag1 === 0 || mag2 === 0) return 1;
  
    return 1 - dot / (mag1 * mag2);
  };