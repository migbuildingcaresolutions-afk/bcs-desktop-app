import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Building Care Solutions
          </h1>

          <div className="text-sm text-gray-500">
            Logged in as <span className="text-gray-700 font-medium">Admin</span>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
