"use client"

import Image from "next/image"
import { ShoppingBag, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ProductCardProps {
  id: string
  name: string
  price: string
  image: string
  onTryOn: () => void
}

export function ProductCard({ id, name, price, image, onTryOn }: ProductCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="aspect-square overflow-hidden rounded-md">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
        <div className="mt-3">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{price}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full" onClick={onTryOn}>
          <Eye className="mr-2 h-4 w-4" />
          Try On
        </Button>
        <Button size="sm" className="w-full">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}

