import { SITE_NAME } from "../utils/site";

export default function Footer() {
  const year = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
  }).format(new Date());

  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-gray-500">
        <p>
          &copy; {year} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
