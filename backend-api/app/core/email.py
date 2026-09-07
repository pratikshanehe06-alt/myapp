def send_password_reset_email(to_email: str, reset_link: str) -> None:
    print("=" * 60)
    print(f"[DEV EMAIL] Password reset requested for: {to_email}")
    print(f"[DEV EMAIL] Reset link: {reset_link}")
    print("=" * 60)
