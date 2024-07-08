import LoginForm from "./LoginForm";

export default function RootLayout({children}) {
    return (
        <html lang="en">
            <body>
                <main>
                    <LoginForm/>
                    {children}
                </main>
            </body>
        </html>
    );
}