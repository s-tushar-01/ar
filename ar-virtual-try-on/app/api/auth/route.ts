import { NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "user-1",
    email: "user@example.com",
    name: "Demo User",
    // In a real app, passwords would be hashed
    password: "password123",
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = users.find((u) => u.email === email)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In a real app, you would generate a JWT token here
    const token = "mock-jwt-token"

    // Return user info (excluding password) and token
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

