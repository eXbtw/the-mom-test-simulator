export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-100 p-4 sm:p-8">
      <div className="flex h-[85vh] max-h-[720px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {children}
      </div>
    </div>
  )
}
