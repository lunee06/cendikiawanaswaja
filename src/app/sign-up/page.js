import RegisterForm from './RegisterForm';

export default function RootLayout({children}) {
    return (
        <html lang="en">
            <body>
                <main>       
                    {children}
                    <RegisterForm></RegisterForm>
                </main>
            </body>
        </html>
    );
}