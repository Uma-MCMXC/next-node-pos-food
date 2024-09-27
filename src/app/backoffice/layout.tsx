import Navbar from './components/Navber';
import Sidebar from './components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="p-4 sm:ml-64">{children}</div>
    </>
  );
}
