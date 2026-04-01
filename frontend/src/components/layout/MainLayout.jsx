import Breadcrumb from "./Breadcrumb";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout({children}) {
  return (
    <main>
      <Header />
      <Breadcrumb />
      <Sidebar />

      <div className="w-full lg:ps-64">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* your content goes here ... */}
          {children}
        </div>
      </div>
    </main>
  );
}
