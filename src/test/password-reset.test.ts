import { afterEach, describe, expect, it } from 'vitest';
import {
  clearPasswordResetChallenge,
  PASSWORD_RESET_CHALLENGE_KEY,
  readPasswordResetChallenge,
} from '@/lib/password-reset';

describe('password reset challenge', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('reads a valid verified challenge from session storage', () => {
    sessionStorage.setItem(PASSWORD_RESET_CHALLENGE_KEY, JSON.stringify({ email: 'rahul@example.com', otp: '123456' }));

    expect(readPasswordResetChallenge()).toEqual({ email: 'rahul@example.com', otp: '123456' });
  });

  it('rejects malformed challenge data', () => {
    sessionStorage.setItem(PASSWORD_RESET_CHALLENGE_KEY, JSON.stringify({ email: 'invalid', otp: '12' }));

    expect(readPasswordResetChallenge()).toBeNull();
  });

  it('clears the verified challenge after password reset', () => {
    sessionStorage.setItem(PASSWORD_RESET_CHALLENGE_KEY, JSON.stringify({ email: 'rahul@example.com', otp: '123456' }));

    clearPasswordResetChallenge();

    expect(readPasswordResetChallenge()).toBeNull();
  });
});