import React from "react";
import styles from "./layout.module.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import { Inter } from "next/font/google";
import { Metadata } from "next";

import "@/src/styles/normalize.css";
import "@/src/styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Main routes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${styles.body}`}>{children}</body>
    </html>
  );
}
