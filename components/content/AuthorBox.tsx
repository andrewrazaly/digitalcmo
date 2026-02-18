interface AuthorBoxProps {
  author: string;
}

export function AuthorBox({ author }: AuthorBoxProps) {
  return (
    <div className="my-8 flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-600">
        DC
      </div>
      <div>
        <p className="font-medium text-slate-900">{author}</p>
        <p className="text-sm text-slate-600">Digital CMO Editorial Team</p>
      </div>
    </div>
  );
}
