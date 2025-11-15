export const getRatingColor = (rating: number) => {
  if (rating >= 8.5) return "linear-gradient(to right, #FFD700, #DAA520, #B8860B)";
  if (rating >= 7.0) return "#00a340";
  if (rating >= 5.5) return "#8D8D8D";
  return "#FF6347";
};
