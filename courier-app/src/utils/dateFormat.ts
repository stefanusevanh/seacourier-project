export function dateFormat(ISODateString: string) {
  return Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(ISODateString));
}
