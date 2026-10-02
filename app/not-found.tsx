import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-16 text-center">
      <div className="text-4xl" aria-hidden>
        🕹️
      </div>
      <h1 className="text-lg font-semibold">Page not found</h1>
      <p className="text-xs text-muted">
        That page doesn&apos;t exist in the arcade.
      </p>
      <Link
        href="/"
        className="inline-block rounded-lg border border-line bg-surface2 px-4 py-2 text-sm text-ink"
      >
        Back to Home
      </Link>
    </div>
  );
}
