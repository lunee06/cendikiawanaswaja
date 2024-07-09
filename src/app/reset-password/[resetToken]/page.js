'use client';
import ResetPassword from "./ResetPasswordForm";

export default function RootLayout({children}) {
    return (
        <html lang="en">
            <body>
                <main>
                    <ResetPassword/>
                    {children}
                </main>
            </body>
        </html>
    );
}