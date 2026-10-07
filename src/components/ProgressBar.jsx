/**
 * ProgressBar component for slides presentation
 */
export function ProgressBar({ current, total }) {
  const percent = Math.min(100, Math.max(0, Math.round(((current + 1) / total) * 100)));

  return (
    <div
      className="progress-bar-container"
      role="progressbar"
      aria-label="Progresso da apresentação"
      aria-valuenow={percent}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="progress-bar-fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
