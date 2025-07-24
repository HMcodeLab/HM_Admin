import type { Metadata } from "next";
import { Providers } from "./providers";
import LayoutWrapper from "./LayoutWrapper";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    template: "%s | HopingMinds - Dashboard",
    default: "HopingMinds - Dashboard",
  },
  description: "Hoping Minds Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        </Providers>
      </body>
    </html>
  );
}
