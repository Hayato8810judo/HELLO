export default function Header() {
  return (
    <header className="bg-neutral-800 px-4 py-3 flex items-center justify-between">
      <div className="font-bold">My Judo App</div>
      <nav className="space-x-4 text-sm">
        <a href="#" className="hover:text-white">Events</a>
        <a href="#" className="hover:text-white">About</a>
        <a href="#" className="hover:text-white">Community</a>
      </nav>
    </header>
  );
}
