export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-100 sm:p-4 md:p-8">
      <div className="flex h-screen w-full flex-col overflow-hidden bg-white sm:h-[85vh] sm:max-h-[720px] sm:max-w-4xl sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-2xl">
        {children}
      </div>
    </div>
  )
}
