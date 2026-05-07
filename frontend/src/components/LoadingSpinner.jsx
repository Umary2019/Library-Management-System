export default function LoadingSpinner({ fullScreen = false, message = 'Loading...' }) {
  const content = (
    <div className="flex items-center gap-3 text-slate-600">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50">{content}</div>;
  }

  return <div className="flex items-center justify-center py-10">{content}</div>;
}
