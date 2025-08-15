import { ProgressBar, PROGRESS_BAR_VARIANTS } from '../';
import './timer.css';

/**
 * Game timer component with visual progress indicator
 *
 * Displays the remaining time for the current player's turn with both numeric
 * display and visual progress bar. Changes color based on urgency (red when
 * time is running low, yellow for warnings, normal for adequate time).
 *
 * @param {Object} props - The component props
 * @param {number} props.timeLeft - Remaining time in seconds for current turn
 * @param {number} props.percentage - Progress percentage (0-100) for visual indicator
 *
 * @returns {JSX.Element} Timer display with progress bar and numeric countdown
 *
 * @example
 * <Timer
 *   timeLeft={15}
 *   percentage={50}
 * />
 *
 * @example
 * // Urgent state (low time)
 * <Timer
 *   timeLeft={2}
 *   percentage={93}
 * />
 */
function Timer({ timeLeft, percentage }) {
  function getProgressVariant() {
    if (timeLeft <= 2) return PROGRESS_BAR_VARIANTS.ERROR;
    if (timeLeft <= 3) return PROGRESS_BAR_VARIANTS.WARNING;
    return PROGRESS_BAR_VARIANTS.PRIMARY;
  }

  return (
    <div className='timer-container'>
      <div className='timer-header'>
        <span className='timer-label'>Move Timer</span>
        <span className='timer-value'>{timeLeft}s</span>
      </div>
      <ProgressBar value={percentage} variant={getProgressVariant()} animated={true} showLabel={false} />
    </div>
  );
}

export default Timer;
