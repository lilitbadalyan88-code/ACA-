// Все ограничения приложения в одном месте.
export const limits = {
  // Загрузка
  maxFiles: 5,
  maxFileSizeMB: 10,
  acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  acceptedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"],

  // Генерация
  minVariants: 1,
  maxVariants: 4,
  generationsPerUserPerDay: 10,
  // Общий потолок на весь сайт в день — защита от лишних расходов.
  generationsPerSitePerDay: 100,

  // Хранение: фото удаляются автоматически через столько дней.
  retentionDays: 30,
} as const;
