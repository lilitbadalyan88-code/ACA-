import { notFound } from "next/navigation";

// Любой неизвестный адрес внутри языка показывает переведённую страницу 404.
export default function CatchAll() {
  notFound();
}
