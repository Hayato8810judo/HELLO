import { useState, useRef, useEffect } from "react";
import { Link } from "@remix-run/react";

type Props = {
  user: { name: string; avatarUrl?: string } | null;
};

export default function UserMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="ml-auto flex items-center gap-4 relative" ref={menuRef}>
      {!user ? (
        <>
          <Link
            to="/login"
            className="text-sm font-medium text-white hover:underline"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-white text-black px-4 py-1.5 rounded text-sm font-semibold hover:bg-gray-100"
          >
            Create account
          </Link>
        </>
      ) : (
        <>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm">{user.name}</span>
          </button>

          {open && (
            <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md w-40 py-2 z-50">
              <Link
                to="/account"
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
              >
                My Account
              </Link>
              <form method="post" action="/logout">
                <button
                  type="submit"
                  className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
