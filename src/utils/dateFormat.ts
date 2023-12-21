export function dateFormat(ISODateString: string) {
  return Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(ISODateString));
}
