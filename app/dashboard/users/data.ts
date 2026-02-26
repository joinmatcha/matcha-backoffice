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
]