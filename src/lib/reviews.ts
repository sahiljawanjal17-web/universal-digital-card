/** Rating maths shared by Hero, Testimonials and SocialProof. */
export function averageRating(items: readonly { rating: number }[]): number | null {
  if (items.length === 0) return null;
  return items.reduce((sum, t) => sum + t.rating, 0) / items.length;
}
