import { join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

type User = {
  email: string,
  name: string,
  interest: string,
}

const users = [
  {
    email: "hayatozhangdao5@gmail.com",
    name: "Hayato Nagashima",
    interest: ""
  },
  {
    email: "curtis.steckel@gmail.com",
    name: "Curtis Steckel",
    interest: ""
  }
];

export function createUser(user: User) {
  if (findUserByEmail(user. email)) {
    throw new Error(`User with email ${user.email} already exists.`);
  }
  users.push(user);
}

export function findUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function updateUserByEmail(email: string, updates: Partial<Omit<User, 'email'>>) {
  const user = findUserByEmail(email);
  if (user == null) return undefined;

  if (updates.name !== undefined) {
    user.name = updates.name;
  }

  if (updates.interest !== undefined) {
    user.interest = updates.interest;
  }
}

export function getAllUsers(): User[] {
  return users;
}
