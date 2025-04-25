export default function Footer() {
  return (
    <footer className="absolute bottom-0 min-w-full mt-px-20 bg-neutral-800 text-neutral-400 text-sm p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
      <div>&#169; 2025 My Judo App</div>
      <div className="mt-2 md:mt-0 flex space-x-4">
        <a href="#" className="hover:text-neutral-200">Privacy Policy</a>
        <a href="#" className="hover:text-neutral-200">Terms</a>
        <a href="#" className="hover:text-neutral-200">About</a>
      </div>
    </footer>
  );
}
