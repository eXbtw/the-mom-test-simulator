export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-100 dark:bg-black sm:p-4 md:p-8">
      <div className="flex h-screen w-full flex-col overflow-hidden bg-white dark:bg-gray-900 sm:h-[85vh] sm:max-h-[720px] sm:max-w-4xl sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-2xl dark:sm:border-gray-800">
        {children}
      </div>
    </div>
  )
}
