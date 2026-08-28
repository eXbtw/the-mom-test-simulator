export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-100 dark:bg-black print:block print:min-h-0 print:w-auto print:bg-white sm:p-4 md:p-8">
      <div className="flex h-screen w-full flex-col overflow-hidden bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] dark:bg-gray-900 sm:h-[85vh] sm:max-h-[760px] sm:max-w-6xl sm:rounded-2xl sm:border sm:border-gray-200 sm:pt-0 sm:pb-0 sm:shadow-2xl dark:sm:border-gray-800 print:h-auto print:max-h-none print:w-auto print:overflow-visible print:border-none print:bg-white print:p-0 print:shadow-none">
        {children}
      </div>
    </div>
  )
}
