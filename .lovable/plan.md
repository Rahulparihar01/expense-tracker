# OTP Password Reset Page

## What will change
- Keep password recovery OTP-based; no reset links will be introduced.
- After OTP verification, open a dedicated `/reset-password` page.
- The page will contain only new password and confirmation fields, then submit the verified OTP and password to the existing secure reset function.
- Expired or invalid verification state will return the user to login with a clear message.

## Technical details
- Move the existing reset form from the login screen into a dedicated route, passing email and OTP in in-memory router state rather than the URL.
- Preserve existing password-strength checks and server-side OTP validation, single-use behavior, and email delivery.
- Verify the route and reset interactions, then check the preview build status.
