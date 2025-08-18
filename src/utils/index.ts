export const genUsername = (): string => {
  const userNamePrefix = 'user-';
  const randomChars = Math.random().toString(36).slice(2);
  return `${userNamePrefix}${randomChars}`;
};

export const genSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]\s-/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const randomChars = Math.random().toString(36).slice(2);
  const uniqueSlug = `${slug}-${randomChars}`;

  return uniqueSlug;
};

export default genUsername;
