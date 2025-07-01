export function snakeToCamel(str: string) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}