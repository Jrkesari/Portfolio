/** A hairline across the top that fills as you read. Pure CSS (scroll-driven), absent where unsupported. */
export function ReadingProgress() {
  return <div aria-hidden className="reading-progress no-print" />;
}
