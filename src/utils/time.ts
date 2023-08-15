export function timeAgo(created_at: Date | string): string {
  let date: Date;
  if (typeof created_at == "string") {
    date = new Date(created_at);
  } else {
    date = created_at;
  }

  const seconds = (new Date().getTime() - date.getTime()) / 1000;

  let span: number;
  let text: string;

  if (seconds > 31536000) {
    span = Math.floor(seconds / 31536000);
    text = "years";
  } else if (seconds > 2592000) {
    span = Math.floor(seconds / 2592000);
    text = "months";
  } else if (seconds > 86400) {
    span = Math.floor(seconds / 86400);
    text = "days";
  } else if (seconds > 3600) {
    span = Math.floor(seconds / 3600);
    text = "hours";
  } else if (seconds > 60) {
    span = Math.floor(seconds / 60);
    text = "minutes";
  } else {
    // span = Math.floor(seconds);
    // text = "seconds";
    return "just now";
  }

  if (span == 1) {
    text = text.slice(0, -1);
  }

  return `${span} ${text} ago`;
}
