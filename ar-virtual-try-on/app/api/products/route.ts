import { NextResponse } from "next/server"

// Mock product database
const products = [
  {
    id: "glasses-1",
    name: "Classic Aviator",
    price: 129.99,
    category: "glasses",
    description: "Timeless aviator style with premium metal frame",
    image: "/placeholder.svg?height=200&width=300",
    modelUrl: "/models/glasses-aviator.glb",
    features: ["UV Protection", "Adjustable Nose Pads", "Spring Hinges"],
    colors: ["Gold", "Silver", "Black"],
  },
  {
    id: "glasses-2",
    name: "Modern Round",
    price: 149.99,
    category: "glasses",
    description: "Contemporary round frames with a lightweight design",
    image: "/placeholder.svg?height=200&width=300",
    modelUrl: "/models/glasses-round.glb",
    features: ["Blue Light Filtering", "Scratch Resistant", "Lightweight"],
    colors: ["Tortoise", "Black", "Clear"],
  },
  {
    id: "glasses-3",
    name: "Vintage Square",
    price: 119.99,
    category: "glasses",
    description: "Retro-inspired square frames with modern comfort",
    image: "/placeholder.svg?height=200&width=300",
    modelUrl: "/models/glasses-square.glb",
    features: ["Polarized Lenses", "Durable Hinges", "Comfortable Fit"],
    colors: ["Brown", "Black", "Navy"],
  },
  {
    id: "shirt-1",
    name: "Casual T-Shirt",
    price: 39.99,
    category: "clothing",
    description: "Comfortable cotton t-shirt for everyday wear",
    image: "/placeholder.svg?height=200&width=300",
    modelUrl: "/models/shirt-casual.glb",
    features: ["100% Cotton", "Machine Washable", "Regular Fit"],
    colors: ["White", "Black", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "shirt-2",
    name: "Formal Shirt",
    price: 79.99,
    category: "clothing",
    description: "Elegant button-up shirt for professional settings",
    image: "/placeholder.svg?height=200&width=300",
    modelUrl: "/models/shirt-formal.glb",
    features: ["Wrinkle Resistant", "Breathable Fabric", "Slim Fit"],
    colors: ["White", "Light Blue", "Pink", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "jacket-1",
    name: "Denim Jacket",
    price: 129.99,
    category: "clothing",
    description: "Classic denim jacket with modern styling",
    image: "/placeholder.svg?height=200&width=300",
    modelUrl: "/models/jacket-denim.glb",
    features: ["100% Cotton Denim", "Button Closure", "Multiple Pockets"],
    colors: ["Blue", "Black", "Light Wash"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
]

export async function GET(request: Request) {
  // Get URL parameters
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const id = searchParams.get("id")

  // Filter products based on parameters
  let filteredProducts = [...products]

  if (category) {
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  if (id) {
    filteredProducts = filteredProducts.filter((product) => product.id === id)
    // If requesting a specific product, return the first match
    if (filteredProducts.length > 0) {
      return NextResponse.json(filteredProducts[0])
    }
    // If no product found with that ID, return 404
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  // Return all filtered products
  return NextResponse.json(filteredProducts)
}

