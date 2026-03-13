export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: "Admin" | "User"
}

export const usersMock: User[] = [
  { id: 1, firstName: "Alice", lastName: "Dupont", email: "alice@test.com", role: "User" },
  { id: 2, firstName: "Marc", lastName: "Martin", email: "marc@test.com", role: "Admin" },
  { id: 3, firstName: "Sophie", lastName: "Bernard", email: "sophie@test.com", role: "User" },
  { id: 4, firstName: "Julien", lastName: "Morel", email: "julien@test.com", role: "User" },
  { id: 5, firstName: "Emma", lastName: "Laurent", email: "emma@test.com", role: "User" },
  { id: 6, firstName: "Pierre", lastName: "Girard", email: "pierre@test.com", role: "User" },
  { id: 7, firstName: "Marie", lastName: "Lemoine", email: "marie@test.com", role: "Admin" },
  { id: 8, firstName: "Thomas", lastName: "Bertrand", email: "thomas@test.com", role: "User" },
  { id: 9, firstName: "Laura", lastName: "Roux", email: "laura@test.com", role: "User" },
  { id: 10, firstName: "Hugo", lastName: "Nicolas", email: "hugo@test.com", role: "User" },
  { id: 11, firstName: "Clara", lastName: "Fontaine", email: "clara@test.com", role: "User" },
  { id: 12, firstName: "Martha", lastName: "Leone", email: "martha@test.com", role: "Admin" },
  { id: 13, firstName: "Thome", lastName: "Beoulan", email: "thome@test.com", role: "User" },
  { id: 14, firstName: "Laurant", lastName: "Rousse", email: "laurant@test.com", role: "User" },
  { id: 15, firstName: "Hubert", lastName: "Nicou", email: "hubert@test.com", role: "User" },
  { id: 16, firstName: "Clement", lastName: "Fontaine", email: "clement@test.com", role: "User" }
]