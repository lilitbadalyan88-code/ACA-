// Корневой layout только передаёт содержимое дальше:
// <html> и <body> рисуются в src/app/[locale]/layout.tsx, где известен язык.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
