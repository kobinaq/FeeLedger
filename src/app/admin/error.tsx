"use client";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-6">
      <h2 className="font-semibold text-red-800">Something went wrong</h2>
      <p className="mt-2 text-sm text-red-700">{error.message}</p>
      <button type="button" className="mt-4 rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
