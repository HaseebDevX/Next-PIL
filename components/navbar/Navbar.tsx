export function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <nav className='fixed left-0 top-0 mb-10 flex h-screen w-[300px] flex-col justify-between space-y-5 bg-purple p-5 text-white'>
      {children}
    </nav>
  );
}
