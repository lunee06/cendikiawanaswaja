'use client';

import ForgotPasswordForm from "./ForgotPasswordForm";

export default function RootLayout({children}) {
    return (
        <html lang="en">
            <body>
                <main>
                    <ForgotPasswordForm/>
                    {children}
                </main>
            </body>
        </html>
    );
}