import clientPromise from "@/lib/mongodb"

export async function getUserByCredentials(email: string, password: string) {
  const client = await clientPromise

  const db = client.db()

  const users = db.collection("users")

  const user = await users.findOne({ email, password })

  return user
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise

  const db = client.db()

  const users = db.collection("users")

  const user = await users.findOne({ email })

  return user
}

export async function saveUser(firstName: string, lastName: string, email: string, password: string) {
  const client = await clientPromise

  const db = client.db()

  const users = db.collection("users")

  const user = await users.insertOne({ name: firstName + " " + lastName, email, password })

  return user
}