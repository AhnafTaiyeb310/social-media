import Breadcrumb from "./Breadcrumb";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SidebarRight from "./SidebarRight";

export default function MainLayout({ children }) {
  return (
    <main className="bg-gray-50 dark:bg-neutral-950 min-h-screen">
      <Header />

      {/* LEFT SIDEBAR: 
        - Hidden by default (Mobile)
        - Visible as a drawer or fixed bar at 'lg' (1024px)
      */}
      <Sidebar />

      {/* CONTENT WRAPPER: 
        - padding-left (ps-64) only applies when Left Sidebar is visible (lg)
      */}
      <div className="lg:ps-64 transition-all duration-300">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* MAIN FEED: 
              - Takes full width on Mobile/Tablet
              - Takes 8/12 columns on Desktop (lg)
            */}
            <div className="col-span-1 md:col-span-12 lg:col-span-8 space-y-6">
              <Breadcrumb />
              {children}
            </div>

            {/* RIGHT SIDEBAR (Bento):
              - HIDDEN on Mobile & Tablet (< 1024px)
              - Visible only on Desktop (lg)
              - This is the FIRST to hide as the screen shrinks
            */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-20">
                <SidebarRight />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
