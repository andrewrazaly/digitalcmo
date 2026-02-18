import { AffiliateButton } from "./AffiliateButton";
import type { ToolData } from "@/lib/types";

interface ComparisonTableProps {
  tools: ToolData[];
  features: { name: string; values: Record<string, boolean | string> }[];
  ratings?: Record<string, number>;
}

export function ComparisonTable({
  tools = [],
  features = [],
  ratings = {},
}: ComparisonTableProps) {
  const toolsList = Array.isArray(tools) ? tools : [];
  const featuresList = Array.isArray(features) ? features : [];
  if (!toolsList.length || !featuresList.length) return null;
  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[500px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 font-medium text-slate-900">Feature</th>
            {toolsList.map((tool) => (
              <th key={tool.slug} className="px-4 py-3 font-medium text-slate-900">
                {tool.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featuresList.map((feature, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="px-4 py-3 text-slate-700">{feature.name}</td>
              {toolsList.map((tool) => (
                <td key={tool.slug} className="px-4 py-3">
                  {typeof feature.values[tool.slug] === "boolean" ? (
                    feature.values[tool.slug] ? (
                      <span className="text-green-600" aria-label="Yes">✓</span>
                    ) : (
                      <span className="text-slate-400" aria-label="No">—</span>
                    )
                  ) : (
                    <span className="text-slate-700">
                      {String(feature.values[tool.slug] ?? "—")}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
          {Object.keys(ratings).length > 0 && (
            <tr className="border-b border-slate-100 bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-700">Rating</td>
              {toolsList.map((tool) => (
                <td key={tool.slug} className="px-4 py-3">
                  <span className="font-medium text-slate-900">
                    {ratings[tool.slug] ?? "—"}/10
                  </span>
                </td>
              ))}
            </tr>
          )}
          <tr className="bg-slate-50">
            <td className="px-4 py-3 font-medium text-slate-700">Get started</td>
            {toolsList.map((tool) => (
              <td key={tool.slug} className="px-4 py-3">
                <AffiliateButton toolSlug={tool.slug} label={`Visit ${tool.name}`} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
