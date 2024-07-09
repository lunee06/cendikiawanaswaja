'use client';
import VerificationSuccess from "./VerificationSuccess";

export default function RootLayout({children}) {
    return (
        <html lang="en">
            <body>
                <main>
                    <VerificationSuccess/>
                    {children}
                </main>
            </body>
        </html>
    );
}