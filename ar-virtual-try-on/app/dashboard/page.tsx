"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Camera,
  CreditCard,
  Download,
  History,
  LogOut,
  Settings,
  ShoppingBag,
  User,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserNFTs } from "@/lib/blockchain"

export default function DashboardPage() {
  const [userNFTs, setUserNFTs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadUserNFTs = async () => {
    setIsLoading(true)
    try {
      const nfts = await getUserNFTs("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
      setUserNFTs(nfts)
    } catch (error) {
      console.error("Error loading NFTs:", error)
    } finally {
      setIsLoading(false)
    }
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
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="grid gap-6 md:grid-cols-[250px_1fr]">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt="User avatar"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium">Demo User</h3>
                      <p className="text-sm text-muted-foreground">user@example.com</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/try-on">
                    <Camera className="mr-2 h-4 w-4" />
                    Try On
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/dashboard/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/dashboard/wallet">
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallet
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/dashboard/history">
                    <History className="mr-2 h-4 w-4" />
                    Try-On History
                  </Link>
                </Button>
              </div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Download App</CardTitle>
                  <CardDescription>Get the full experience</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    App Store
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Google Play
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>Manage your account and view your digital assets</CardDescription>
                </CardHeader>
              </Card>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="digital-assets">Digital Assets</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your recent try-ons and purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            <Camera className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Tried on Classic Aviator</p>
                            <p className="text-sm text-muted-foreground">2 hours ago</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Purchased Denim Jacket</p>
                            <p className="text-sm text-muted-foreground">Yesterday</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            <Camera className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Tried on Modern Round</p>
                            <p className="text-sm text-muted-foreground">3 days ago</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Products</CardTitle>
                      <CardDescription>Based on your preferences and history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                          <div className="p-2">
                            <Image
                              src="/placeholder.svg?height=150&width=200"
                              alt="Vintage Square Glasses"
                              width={200}
                              height={150}
                              className="h-[150px] w-full rounded-md object-cover"
                            />
                            <div className="p-2">
                              <h4 className="font-medium">Vintage Square</h4>
                              <p className="text-sm text-muted-foreground">$119.99</p>
                              <Button size="sm" className="mt-2 w-full">
                                Try On
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                          <div className="p-2">
                            <Image
                              src="/placeholder.svg?height=150&width=200"
                              alt="Casual T-Shirt"
                              width={200}
                              height={150}
                              className="h-[150px] w-full rounded-md object-cover"
                            />
                            <div className="p-2">
                              <h4 className="font-medium">Casual T-Shirt</h4>
                              <p className="text-sm text-muted-foreground">$39.99</p>
                              <Button size="sm" className="mt-2 w-full">
                                Try On
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                          <div className="p-2">
                            <Image
                              src="/placeholder.svg?height=150&width=200"
                              alt="Denim Jacket"
                              width={200}
                              height={150}
                              className="h-[150px] w-full rounded-md object-cover"
                            />
                            <div className="p-2">
                              <h4 className="font-medium">Denim Jacket</h4>
                              <p className="text-sm text-muted-foreground">$129.99</p>
                              <Button size="sm" className="mt-2 w-full">
                                Try On
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="digital-assets" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Digital Assets</CardTitle>
                      <CardDescription>NFTs and digital ownership certificates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userNFTs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {userNFTs.map((nft) => (
                            <div key={nft.tokenId} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                              <div className="p-4">
                                <div className="aspect-square rounded-md bg-muted flex items-center justify-center">
                                  <Image
                                    src="/placeholder.svg?height=200&width=200"
                                    alt={`NFT for ${nft.productId}`}
                                    width={200}
                                    height={200}
                                    className="rounded-md"
                                  />
                                </div>
                                <div className="mt-2">
                                  <h4 className="font-medium">Token #{nft.tokenId}</h4>
                                  <p className="text-sm text-muted-foreground">Product: {nft.productId}</p>
                                  <p className="text-sm text-muted-foreground">Minted: {nft.mintDate}</p>
                                  <div className="mt-2 flex gap-2">
                                    <Button size="sm" variant="outline" className="w-full">
                                      View
                                    </Button>
                                    <Button size="sm" className="w-full">
                                      Transfer
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="rounded-full bg-muted p-3">
                            <Wallet className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <h3 className="mt-4 text-lg font-medium">No Digital Assets Yet</h3>
                          <p className="mt-2 text-center text-sm text-muted-foreground">
                            Purchase products to receive digital ownership certificates
                          </p>
                          <Button className="mt-4" onClick={loadUserNFTs} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Load Assets"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="payment" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Manage your payment options</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            <Wallet className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Crypto Wallet</p>
                            <p className="text-sm text-muted-foreground">0x742d...f44e</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                        <Button className="w-full">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Add Payment Method
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

