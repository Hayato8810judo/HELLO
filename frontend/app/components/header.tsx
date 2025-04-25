import { Link } from "@remix-run/react";

type User = { email: string };

type Props = {
  user: User | null
};

export default function Header(props: Props) {
  return (
    <header className="bg-neutral-800 px-4 py-3 flex items-center justify-between">
      <div className="font-bold">My Judo App</div>
      <nav className="space-x-4 text-sm">
        {props.user
          ? (
              <>
              {props.user.email} &nbsp;
              <Link to='/logout'>(Logout)</Link>
              </>
            )
          : (<Link to='/login'>Login</Link>)
        }
      </nav>
    </header>
  );
}
