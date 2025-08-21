export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-7xl font-extrabold text-gray-900">404</h1>
      <p className="mt-4 text-2xl font-semibold text-gray-700">
        Oops! Page not found
      </p>
      <p className="mt-2 text-gray-500">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-6 rounded-2xl bg-indigo-600 px-6 py-3 text-white shadow-lg transition hover:bg-indigo-700"
      >
        Back to Home
      </a>
    </div>
  );
}
