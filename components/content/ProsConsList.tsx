interface ProsConsListProps {
  pros: string[];
  cons: string[];
}

export function ProsConsList({ pros = [], cons = [] }: ProsConsListProps) {
  const prosList = Array.isArray(pros) ? pros : [];
  const consList = Array.isArray(cons) ? cons : [];
  if (!prosList.length && !consList.length) return null;
  return (
    <div className="my-6 grid gap-6 sm:grid-cols-2">
      <div className="rounded-lg border border-green-200 bg-green-50/50 p-4">
        <h4 className="mb-3 font-semibold text-green-800">Pros</h4>
        <ul className="space-y-2 text-sm text-green-900">
          {prosList.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-green-600">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
        <h4 className="mb-3 font-semibold text-amber-800">Cons</h4>
        <ul className="space-y-2 text-sm text-amber-900">
          {consList.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-amber-600">✗</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
