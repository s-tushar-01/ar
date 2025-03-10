"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Camera, Download, Glasses, Shirt, ShoppingBag, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ARView } from "@/components/ar-view"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  image: string
  modelUrl?: string
  features?: string[]
  colors?: string[]
  sizes?: string[]
}

export default function TryOnPage() {
  const [activeProduct, setActiveProduct] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("glasses")
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)

  // Check camera permission
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach((track) => track.stop())
        setCameraPermission(true)
      } catch (error) {
        console.error("Camera permission denied:", error)
        setCameraPermission(false)
      }
    }

    checkCameraPermission()
  }, [])

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?category=${activeCategory}`)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeCategory])

  const handleProductSelect = (productId: string) => {
    setActiveProduct(productId)
    setCameraActive(true)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setActiveProduct(null)
    setCameraActive(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Cart (0)
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="grid gap-6 md:grid-cols-[1fr_400px]">
            <div className="flex flex-col gap-6">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h2 className="text-2xl font-bold">Virtual Try-On</h2>
                  <p className="text-muted-foreground">Try products virtually before you buy</p>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-b-lg bg-muted">
                  {cameraPermission === false && (
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
                      <Info className="h-12 w-12 text-destructive" />
                      <h3 className="text-xl font-bold text-center">Camera Access Required</h3>
                      <p className="text-center text-muted-foreground max-w-md">
                        Please allow camera access to use the virtual try-on feature. You may need to update your
                        browser settings.
                      </p>
                      <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                  )}
                  {cameraPermission === true && cameraActive ? (
                    <ARView productId={activeProduct} />
                  ) : cameraPermission === true ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4">
                      <Camera className="h-12 w-12 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">
                        Select a product to start the virtual try-on experience
                      </p>
                      <Button onClick={() => setCameraActive(true)}>
                        <Camera className="mr-2 h-4 w-4" />
                        Activate Camera
                      </Button>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Skeleton className="h-full w-full" />
                    </div>
                  )}
                </div>
              </div>

              <Alert>
                <AlertTitle>AR Features Available</AlertTitle>
                <AlertDescription>
                  This application supports WebXR for AR experiences on compatible devices, face tracking for glasses
                  try-on, and 3D model interaction. Enable camera access to use all features.
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-bold">How to Use</h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                      <CardContent className="flex flex-col items-center gap-2 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="font-bold text-primary">1</span>
                        </div>
                        <h4 className="text-center font-medium">Select a Product</h4>
                        <p className="text-center text-sm text-muted-foreground">Browse and choose from our catalog</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col items-center gap-2 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="font-bold text-primary">2</span>
                        </div>
                        <h4 className="text-center font-medium">Position Your Camera</h4>
                        <p className="text-center text-sm text-muted-foreground">
                          Align your face or body in the frame
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col items-center gap-2 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="font-bold text-primary">3</span>
                        </div>
                        <h4 className="text-center font-medium">Adjust & Capture</h4>
                        <p className="text-center text-sm text-muted-foreground">
                          Use controls to adjust fit, then capture and share
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <Tabs defaultValue="glasses" onValueChange={handleCategoryChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="glasses">
                    <Glasses className="mr-2 h-4 w-4" />
                    Glasses
                  </TabsTrigger>
                  <TabsTrigger value="clothing">
                    <Shirt className="mr-2 h-4 w-4" />
                    Clothing
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="glasses" className="mt-4 space-y-4">
                  {loading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="space-y-3">
                            <Skeleton className="h-[200px] w-full rounded-lg" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                            </div>
                            <div className="flex gap-2">
                              <Skeleton className="h-10 w-full" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                          </div>
                        ))
                    : products
                        .filter((product) => product.category === "glasses")
                        .map((product) => (
                          <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={`$${product.price.toFixed(2)}`}
                            image={product.image}
                            onTryOn={() => handleProductSelect(product.id)}
                          />
                        ))}
                </TabsContent>
                <TabsContent value="clothing" className="mt-4 space-y-4">
                  {loading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="space-y-3">
                            <Skeleton className="h-[200px] w-full rounded-lg" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                            </div>
                            <div className="flex gap-2">
                              <Skeleton className="h-10 w-full" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                          </div>
                        ))
                    : products
                        .filter((product) => product.category === "clothing")
                        .map((product) => (
                          <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={`$${product.price.toFixed(2)}`}
                            image={product.image}
                            onTryOn={() => handleProductSelect(product.id)}
                          />
                        ))}
                </TabsContent>
              </Tabs>
              <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                <h3 className="font-medium">Download Our App</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get the full AR experience with our native mobile application
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    App Store
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Google Play
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

