export const PASSWORD_RESET_CHALLENGE_KEY = 'expense-track-password-reset';

export interface PasswordResetChallenge {
  email: string;
  otp: string;
}

export function readPasswordResetChallenge(): PasswordResetChallenge | null {
  try {
    const storedValue = sessionStorage.getItem(PASSWORD_RESET_CHALLENGE_KEY);
    if (!storedValue) return null;

    const parsed: unknown = JSON.parse(storedValue);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('email' in parsed) ||
      !('otp' in parsed) ||
      typeof parsed.email !== 'string' ||
      typeof parsed.otp !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.email) ||
      !/^\d{6}$/.test(parsed.otp)
    ) {
      return null;
    }

    return { email: parsed.email, otp: parsed.otp };
  } catch {
    return null;
  }
}

export function clearPasswordResetChallenge() {
  sessionStorage.removeItem(PASSWORD_RESET_CHALLENGE_KEY);
}