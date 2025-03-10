import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Camera, ShoppingBag, Smartphone, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>AR TryOn</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#demo" className="text-sm font-medium hover:underline underline-offset-4">
              Demo
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Virtual Try-On Experience
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Try products virtually before you buy. Our AR technology lets you see how products look on you in
                    real-time.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1">
                    Try Now <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-[350px] overflow-hidden rounded-xl border bg-background">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <Image
                    src="/placeholder.svg?height=900&width=700"
                    alt="AR Try-On Demo"
                    width={700}
                    height={900}
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="rounded-lg bg-background/80 p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Virtual Glasses</h3>
                          <p className="text-sm text-muted-foreground">Try on our latest collection</p>
                        </div>
                        <Button size="sm" variant="secondary">
                          <Camera className="h-4 w-4 mr-2" />
                          Try On
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform combines AR, AI, and blockchain technology to provide a seamless virtual try-on
                  experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AR Technology</h3>
                <p className="text-center text-muted-foreground">
                  Advanced augmented reality for realistic product visualization on your face or body.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Recommendations</h3>
                <p className="text-center text-muted-foreground">
                  Smart product suggestions based on your preferences and style.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Shopping</h3>
                <p className="text-center text-muted-foreground">
                  Blockchain-verified authentic products with secure transactions.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Process</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get started with our virtual try-on platform in just a few steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Download the App</h3>
                <p className="text-center text-muted-foreground">
                  Get our mobile app from the App Store or Google Play.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Scan Your Face/Body</h3>
                <p className="text-center text-muted-foreground">
                  Use the camera to create your digital profile for accurate try-ons.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Try & Buy</h3>
                <p className="text-center text-muted-foreground">
                  Browse products, try them on virtually, and purchase with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="demo" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Demo</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">See It In Action</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Watch how our AR virtual try-on technology works.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl py-12">
              <div className="overflow-hidden rounded-xl border bg-background shadow-lg">
                <div className="aspect-video w-full bg-muted">
                  <div className="flex h-full items-center justify-center">
                    <Smartphone className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">AR Try-On Demo</h3>
                  <p className="mt-2 text-muted-foreground">
                    This demo shows how users can try on glasses, clothing, and accessories using our AR technology.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button>
                      <Camera className="mr-2 h-4 w-4" />
                      Try Demo
                    </Button>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get Started Today</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are already enjoying our virtual try-on experience.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="gap-1">
                  Download App <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>AR TryOn</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2023 AR TryOn. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

