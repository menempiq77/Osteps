import Link from "next/link";

const tools = [
  {
    name: "Transcribe",
    description: "Convert audio or video into text with upload or URL input.",
    href: "/dashboard/tools/transcribe",
    status: "Ready",
  },
  {
    name: "More tools",
    description: "Add new tools here as they become available.",
    href: "/dashboard/tools",
    status: "Coming soon",
  },
];

export default function ToolsPage() {
  return (
    <div className="p-3 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tools</h1>
          <p className="mt-2 text-gray-600">
            Quick access to useful tools for your school.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
                  {tool.name}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {tool.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {tool.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
