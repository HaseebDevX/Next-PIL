export function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <nav className=' flex h-screen w-[300px] flex-col justify-between space-y-5 bg-purple p-5 text-white'>
      {children}
    </nav>
  );
}
