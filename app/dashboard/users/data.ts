export type User = {
  id: number
  name: string
  email: string
  role: "Admin" | "User"
}

export const usersMock: User[] = [
  { id: 1, name: "Alice Dupont", email: "alice@test.com", role: "User" },
  { id: 2, name: "Marc Martin", email: "marc@test.com", role: "Admin" },
  { id: 3, name: "Sophie Bernard", email: "sophie@test.com", role: "User" },
  { id: 4, name: "Julien Morel", email: "julien@test.com", role: "User" },
  { id: 5, name: "Emma Laurent", email: "emma@test.com", role: "User" },
  { id: 6, name: "Thomas Petit", email: "thomas@test.com", role: "User" },
  { id: 7, name: "Chloé Garcia", email: "chloe@test.com", role: "User" },
  { id: 8, name: "Lucas Bernard", email: "lucas@test.com", role: "User" },
  { id: 9, name: "Camille Robert", email: "camille@test.com", role: "User" },
  { id: 10, name: "Hugo Simon", email: "hugo@test.com", role: "User" },
  { id: 11, name: "Léa Michel", email: "lea@test.com", role: "User" },
  { id: 12, name: "Nathan Leroy", email: "nathan@test.com", role: "User" },
  { id: 13, name: "Manon Roux", email: "manon@test.com", role: "User" },
  { id: 14, name: "Antoine David", email: "antoine@test.com", role: "User" },
  { id: 15, name: "Sarah Fontaine", email: "sarah@test.com", role: "User" },
]