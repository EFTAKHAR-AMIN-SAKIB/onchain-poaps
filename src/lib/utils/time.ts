import { CONTRACT_CREATOR_TIMELOCK_SECONDS, SIGNATURE_VALIDITY_WINDOW_SECONDS } from "../contracts/address";

export interface TimelockStatus {
  isExpired: boolean;
  deadlineTimestamp: number;
  remainingSeconds: number;
  formattedRemaining: string;
  percentageRemaining: number;
}

/**
 * Computes the 30-day creator management timelock status.
 */
export function getCreatorTimelockStatus(createdAtSeconds: number | bigint): TimelockStatus {
  const created = typeof createdAtSeconds === "bigint" ? Number(createdAtSeconds) : createdAtSeconds;
  const deadline = created + CONTRACT_CREATOR_TIMELOCK_SECONDS;
  const now = Math.floor(Date.now() / 1000);
  const remaining = Math.max(0, deadline - now);
  const isExpired = now >= deadline;

  const total = CONTRACT_CREATOR_TIMELOCK_SECONDS;
  const percentage = Math.min(100, Math.max(0, (remaining / total) * 100));

  return {
    isExpired,
    deadlineTimestamp: deadline,
    remainingSeconds: remaining,
    formattedRemaining: formatRemainingTime(remaining),
    percentageRemaining: percentage,
  };
}

/**
 * Computes the 37-day signature claim validity window status.
 */
export function getSignatureTimelockStatus(createdAtSeconds: number | bigint): TimelockStatus {
  const created = typeof createdAtSeconds === "bigint" ? Number(createdAtSeconds) : createdAtSeconds;
  const deadline = created + SIGNATURE_VALIDITY_WINDOW_SECONDS;
  const now = Math.floor(Date.now() / 1000);
  const remaining = Math.max(0, deadline - now);
  const isExpired = now >= deadline;

  const total = SIGNATURE_VALIDITY_WINDOW_SECONDS;
  const percentage = Math.min(100, Math.max(0, (remaining / total) * 100));

  return {
    isExpired,
    deadlineTimestamp: deadline,
    remainingSeconds: remaining,
    formattedRemaining: formatRemainingTime(remaining),
    percentageRemaining: percentage,
  };
}

export function formatRemainingTime(seconds: number): string {
  if (seconds <= 0) return "Expired";
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h left`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
}
