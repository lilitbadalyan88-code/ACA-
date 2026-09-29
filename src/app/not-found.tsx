"use client";

import NextError from "next/error";

// Запасная страница для адресов вне языковых разделов.
export default function GlobalNotFound() {
  return (
    <html lang="ru">
      <body>
        <NextError statusCode={404} />
      </body>
    </html>
  );
}
