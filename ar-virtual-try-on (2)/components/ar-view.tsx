"use client"

import type React from "react"

import { useEffect, useRef, useState, Suspense } from "react"
import { Camera, Redo, RefreshCw, Share2, ZoomIn, ZoomOut, RotateCcw, RotateCw, Move } from "lucide-react"
import { XRButton, ARCanvas, Interactive, DefaultXRControllers } from "@react-three/xr"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html, PerspectiveCamera, useAspect } from "@react-three/drei"
import * as THREE from "three"
import * as faceapi from "face-api.js"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ARViewProps {
  productId: string | null
}

// WebXR AR Scene component
function ARScene({
  productId,
  scale,
  position,
  rotation,
}: {
  productId: string | null
  scale: number
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  const modelUrl = getModelUrl(productId)

  return (
    <ARCanvas
      sessionInit={{ requiredFeatures: ["hit-test"] }}
      gl={{ preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <Suspense fallback={null}>
        <ARModel url={modelUrl} scale={[scale, scale, scale]} position={position} rotation={rotation} />
      </Suspense>

      <DefaultXRControllers />
    </ARCanvas>
  )
}

// AR Model with hit-test placement
function ARModel({
  url,
  scale,
  position,
  rotation,
}: {
  url: string
  scale: [number, number, number]
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  const { scene } = useGLTF(url)
  const [placed, setPlaced] = useState(false)
  const [modelPosition, setModelPosition] = useState<[number, number, number]>(position)

  // Handle model placement on hit-test
  const onSelect = (e: any) => {
    if (!placed) {
      const hitPoint = e.intersection.point
      setModelPosition([hitPoint.x, hitPoint.y, hitPoint.z])
      setPlaced(true)

      toast({
        title: "Model placed",
        description: "You can now interact with the model.",
      })
    }
  }

  return (
    <Interactive onSelect={onSelect}>
      <primitive
        object={scene.clone()}
        position={placed ? modelPosition : position}
        scale={scale}
        rotation={rotation}
      />
    </Interactive>
  )
}

// Face detection and tracking component
function FaceTracker({
  children,
  onFaceDetected,
}: {
  children: React.ReactNode
  onFaceDetected: (landmarks: any) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models/face-api"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models/face-api"),
        ])
        setModelsLoaded(true)
      } catch (error) {
        console.error("Error loading face detection models:", error)
      }
    }

    loadModels()
  }, [])

  // Start video stream
  useEffect(() => {
    if (!modelsLoaded) return

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    startVideo()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [modelsLoaded])

  // Face detection loop
  useEffect(() => {
    if (!modelsLoaded || !videoRef.current || !canvasRef.current) return

    let animationId: number

    const detectFace = async () => {
      if (!videoRef.current || !canvasRef.current) return

      // Detect faces
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()

      if (detections.length > 0) {
        setFaceDetected(true)
        onFaceDetected(detections[0].landmarks)
      } else {
        setFaceDetected(false)
      }

      // Draw results for debugging
      const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true)
      const resizedDetections = faceapi.resizeResults(detections, dims)

      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
      }

      animationId = requestAnimationFrame(detectFace)
    }

    detectFace()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [modelsLoaded, onFaceDetected])

  return (
    <div className="relative w-full h-full">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover mirror-mode" playsInline muted />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />
      {faceDetected && children}
      {!faceDetected && modelsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
          <div className="bg-background p-4 rounded-lg shadow-lg max-w-md text-center">
            <h3 className="text-lg font-medium mb-2">Position Your Face</h3>
            <p className="text-muted-foreground mb-4">Center your face in the frame to enable virtual try-on</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Background video component for Three.js scene
function BackgroundVideo() {
  const { viewport } = useThree()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null)
  const scale = useAspect(viewport.width, viewport.height, 1)

  useEffect(() => {
    const video = document.createElement("video")
    video.style.display = "none"
    video.playsInline = true
    video.muted = true
    video.autoplay = true

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      .then((stream) => {
        video.srcObject = stream
        video.play()

        const texture = new THREE.VideoTexture(video)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBAFormat
        texture.flipY = true

        setVideoTexture(texture)

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err)
      })

    return () => {
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return videoTexture ? (
    <mesh scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={videoTexture} side={THREE.DoubleSide} />
    </mesh>
  ) : null
}

// Model component that loads and renders a 3D model
function Model({
  url,
  position,
  scale,
  rotation,
  onLoad,
}: {
  url: string
  position: [number, number, number]
  scale: [number, number, number]
  rotation: [number, number, number]
  onLoad?: () => void
}) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    if (onLoad) onLoad()
  }, [onLoad])

  return <primitive object={scene.clone()} position={position} scale={scale} rotation={rotation} />
}

// Get model URL based on product ID
function getModelUrl(id: string | null) {
  if (!id) return "/assets/3d/duck.glb" // Default model

  switch (id) {
    case "glasses-1":
      return "/models/glasses-aviator.glb"
    case "glasses-2":
      return "/models/glasses-round.glb"
    case "glasses-3":
      return "/models/glasses-square.glb"
    case "shirt-1":
    case "shirt-2":
      return "/models/shirt.glb"
    case "jacket-1":
      return "/models/jacket.glb"
    default:
      return "/assets/3d/duck.glb"
  }
}

// Main AR View component
export function ARView({ productId }: ARViewProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [showFaceMesh, setShowFaceMesh] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [arMode, setArMode] = useState<"webxr" | "webgl" | "facetracking">("webgl")
  const [webXRSupported, setWebXRSupported] = useState(false)
  const [faceLandmarks, setFaceLandmarks] = useState<any>(null)

  // Model control states
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0])
  const [position, setPosition] = useState<[number, number, number]>([0, 0, -2])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const threeCanvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobile()

  // Check WebXR support
  useEffect(() => {
    if (typeof navigator !== "undefined" && "xr" in navigator) {
      // @ts-ignore - TypeScript doesn't know about navigator.xr yet
      navigator.xr
        ?.isSessionSupported("immersive-ar")
        .then((supported) => {
          setWebXRSupported(supported)
        })
        .catch(() => {
          setWebXRSupported(false)
        })
    }
  }, [])

  // Get initial position based on product type
  useEffect(() => {
    if (productId?.startsWith("glasses")) {
      setPosition([0, 0.2, -1])
      setArMode("facetracking")
    } else if (productId?.startsWith("shirt") || productId?.startsWith("jacket")) {
      setPosition([0, -1, -3])
      setArMode(webXRSupported ? "webxr" : "webgl")
    } else {
      setPosition([0, 0, -2])
      setArMode(webXRSupported ? "webxr" : "webgl")
    }
  }, [productId, webXRSupported])

  // Reset controls to default values
  const resetControls = () => {
    setScale(1)
    setRotation([0, 0, 0])

    if (productId?.startsWith("glasses")) {
      setPosition([0, 0.2, -1])
    } else if (productId?.startsWith("shirt") || productId?.startsWith("jacket")) {
      setPosition([0, -1, -3])
    } else {
      setPosition([0, 0, -2])
    }
  }

  // Handle model loading
  const handleModelLoad = () => {
    setModelLoaded(true)
    setIsProcessing(false)
    setShowControls(true)

    toast({
      title: "Model loaded successfully",
      description: "You can now adjust the position, scale, and rotation.",
    })
  }

  // Handle face detection
  const handleFaceDetected = (landmarks: any) => {
    setFaceLandmarks(landmarks)

    // Automatically position glasses based on face landmarks
    if (productId?.startsWith("glasses") && landmarks) {
      const nose = landmarks.getNose()
      const leftEye = landmarks.getLeftEye()
      const rightEye = landmarks.getRightEye()

      if (nose.length > 0 && leftEye.length > 0 && rightEye.length > 0) {
        // Calculate position based on face landmarks
        const eyeCenter = {
          x: (leftEye[0].x + rightEye[3].x) / 2,
          y: (leftEye[0].y + rightEye[3].y) / 2,
        }

        // Convert from pixel coordinates to 3D space
        // This is a simplified conversion and would need to be calibrated
        const normalizedX = (eyeCenter.x / window.innerWidth - 0.5) * 2
        const normalizedY = -(eyeCenter.y / window.innerHeight - 0.5) * 2

        setPosition([normalizedX, normalizedY, -1])
      }
    }
  }

  // Start AR session
  useEffect(() => {
    if (productId) {
      setIsProcessing(true)
      setIsCapturing(true)
      setModelLoaded(false)
    }
  }, [productId])

  // Take screenshot of the AR view
  const takeScreenshot = () => {
    if (!containerRef.current) return

    // Create a new canvas to combine video and 3D scene
    const canvas = document.createElement("canvas")
    const video = containerRef.current.querySelector("video")
    const threeCanvas = arMode === "webgl" ? threeCanvasRef.current : containerRef.current.querySelector("canvas")

    if (!video || !threeCanvas) {
      toast({
        title: "Screenshot failed",
        description: "Could not capture the AR view.",
        variant: "destructive",
      })
      return
    }

    // Set canvas dimensions
    canvas.width = containerRef.current.clientWidth
    canvas.height = containerRef.current.clientHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw video first (mirrored for selfie camera)
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    ctx.restore()

    // Draw WebGL canvas on top
    ctx.drawImage(threeCanvas, 0, 0, canvas.width, canvas.height)

    // Convert to data URL
    const dataUrl = canvas.toDataURL("image/png")
    setCapturedImage(dataUrl)
    setShareDialogOpen(true)

    toast({
      title: "Screenshot taken",
      description: "Your AR try-on has been captured.",
    })
  }

  // Share captured image
  const shareImage = async () => {
    if (!capturedImage) return

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage)
      const blob = await response.blob()

      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: "My AR Try-On",
          text: "Check out my virtual try-on!",
          files: [new File([blob], "ar-tryon.png", { type: "image/png" })],
        })

        toast({
          title: "Shared successfully",
          description: "Your AR try-on has been shared.",
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        const link = document.createElement("a")
        link.href = capturedImage
        link.download = `ar-tryon-${productId}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Image downloaded",
          description: "Your AR try-on has been downloaded.",
        })
      }

      setShareDialogOpen(false)
    } catch (error) {
      console.error("Error sharing image:", error)
      toast({
        title: "Error sharing image",
        description: "There was an error sharing your image. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Fetch product details from API
  useEffect(() => {
    if (productId) {
      fetch(`/api/products?id=${productId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Product details:", data)
        })
        .catch((err) => {
          console.error("Error fetching product details:", err)
        })
    }
  }, [productId])

  // Render different AR modes
  const renderARExperience = () => {
    switch (arMode) {
      case "webxr":
        return (
          <div className="relative h-full w-full">
            <ARScene productId={productId} scale={scale} position={position} rotation={rotation} />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <XRButton
                mode="AR"
                sessionInit={{ requiredFeatures: ["hit-test"] }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
              >
                Enter AR
              </XRButton>
            </div>
          </div>
        )

      case "facetracking":
        return (
          <FaceTracker onFaceDetected={handleFaceDetected}>
            <div className="relative h-full w-full">
              <Canvas
                ref={threeCanvasRef}
                gl={{ preserveDrawingBuffer: true }}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              >
                <PerspectiveCamera makeDefault position={[0, 0, 0]} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                <Suspense fallback={null}>
                  {isCapturing && productId && (
                    <Model
                      url={getModelUrl(productId)}
                      position={position}
                      scale={[scale, scale, scale]}
                      rotation={rotation}
                      onLoad={handleModelLoad}
                    />
                  )}
                </Suspense>

                {/* Controls for desktop */}
                {!isMobile && modelLoaded && (
                  <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    minDistance={0.5}
                    maxDistance={10}
                  />
                )}
              </Canvas>
            </div>
          </FaceTracker>
        )

      default: // webgl
        return (
          <div className="relative h-full w-full">
            <video className="absolute inset-0 h-full w-full object-cover mirror-mode" playsInline muted autoPlay />
            <Canvas
              ref={threeCanvasRef}
              gl={{ preserveDrawingBuffer: true }}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            >
              <BackgroundVideo />
              <PerspectiveCamera makeDefault position={[0, 0, 0]} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />

              <Suspense fallback={null}>
                {isCapturing && productId && (
                  <Model
                    url={getModelUrl(productId)}
                    position={position}
                    scale={[scale, scale, scale]}
                    rotation={rotation}
                    onLoad={handleModelLoad}
                  />
                )}
              </Suspense>

              {/* Gesture controls for mobile */}
              {isMobile && modelLoaded && (
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  minDistance={0.5}
                  maxDistance={10}
                />
              )}

              {/* UI elements within the 3D scene */}
              {modelLoaded && (
                <Html position={[0, 1.5, -3]} center>
                  <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 text-center">
                    <p className="text-sm font-medium">
                      {isMobile ? "Pinch to zoom, drag to move" : "Use controls below to adjust"}
                    </p>
                  </div>
                </Html>
              )}
            </Canvas>
          </div>
        )
    }
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* AR Experience */}
      {renderARExperience()}

      {/* Loading overlay */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="font-medium">Loading AR Experience...</p>
          </div>
        </div>
      )}

      {/* AR Mode Selector */}
      {webXRSupported && !productId?.startsWith("glasses") && (
        <div className="absolute top-4 left-4 z-40">
          <Tabs value={arMode} onValueChange={(value) => setArMode(value as any)}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="webgl">Basic</TabsTrigger>
              <TabsTrigger value="webxr">WebXR</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Controls overlay */}
      {showControls && !isMobile && arMode !== "webxr" && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-4 z-40">
          <Tabs defaultValue="scale">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="scale">
                <ZoomIn className="h-4 w-4 mr-2" />
                Scale
              </TabsTrigger>
              <TabsTrigger value="rotate">
                <RotateCw className="h-4 w-4 mr-2" />
                Rotate
              </TabsTrigger>
              <TabsTrigger value="position">
                <Move className="h-4 w-4 mr-2" />
                Position
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scale" className="space-y-4">
              <div className="flex items-center space-x-2">
                <ZoomOut className="h-4 w-4" />
                <Slider
                  value={[scale]}
                  min={0.1}
                  max={2}
                  step={0.01}
                  onValueChange={(value) => setScale(value[0])}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4" />
              </div>
            </TabsContent>

            <TabsContent value="rotate" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm w-8">X:</span>
                  <Slider
                    value={[rotation[0]]}
                    min={-Math.PI}
                    max={Math.PI}
                    step={0.01}
                    onValueChange={(value) => setRotation([value[0], rotation[1], rotation[2]])}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm w-8">Y:</span>
                  <Slider
                    value={[rotation[1]]}
                    min={-Math.PI}
                    max={Math.PI}
                    step={0.01}
                    onValueChange={(value) => setRotation([rotation[0], value[0], rotation[2]])}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm w-8">Z:</span>
                  <Slider
                    value={[rotation[2]]}
                    min={-Math.PI}
                    max={Math.PI}
                    step={0.01}
                    onValueChange={(value) => setRotation([rotation[0], rotation[1], value[0]])}
                    className="flex-1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="position" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm w-8">X:</span>
                  <Slider
                    value={[position[0]]}
                    min={-3}
                    max={3}
                    step={0.01}
                    onValueChange={(value) => setPosition([value[0], position[1], position[2]])}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm w-8">Y:</span>
                  <Slider
                    value={[position[1]]}
                    min={-3}
                    max={3}
                    step={0.01}
                    onValueChange={(value) => setPosition([position[0], value[0], position[2]])}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm w-8">Z:</span>
                  <Slider
                    value={[position[2]]}
                    min={-5}
                    max={0}
                    step={0.01}
                    onValueChange={(value) => setPosition([position[0], position[1], value[0]])}
                    className="flex-1"
                  />
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={resetControls}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </Tabs>
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
        {arMode === "facetracking" && (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setShowFaceMesh(!showFaceMesh)}
            className="rounded-full"
            title="Toggle face mesh"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="6" />
              <path d="M15.5 14h.5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.5" />
            </svg>
          </Button>
        )}
        {isMobile && (
          <Button
            variant="secondary"
            size="icon"
            onClick={resetControls}
            className="rounded-full"
            title="Reset position"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-40">
        <Button variant="secondary" size="sm" onClick={() => setIsCapturing(false)}>
          <Redo className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button variant="secondary" size="sm" onClick={takeScreenshot}>
          <Camera className="mr-2 h-4 w-4" />
          Capture
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setShareDialogOpen(true)} disabled={!capturedImage}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Share dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share your AR Try-On</DialogTitle>
            <DialogDescription>Share your virtual try-on with friends or download the image.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {capturedImage && (
              <div className="overflow-hidden rounded-lg border">
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="AR Try-On"
                  className="max-h-[300px] w-full object-contain"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={shareImage} className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                {navigator.share ? "Share" : "Download"}
              </Button>
              <Button variant="outline" onClick={() => setShareDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* WebXR not supported alert */}
      {arMode === "webxr" && !webXRSupported && (
        <Alert className="absolute bottom-20 left-4 right-4 z-50">
          <AlertTitle>WebXR not supported</AlertTitle>
          <AlertDescription>
            Your browser or device doesn't support WebXR. Try using a compatible browser or device.
          </AlertDescription>
        </Alert>
      )}

      {/* CSS for mirroring video */}
      <style jsx global>{`
        .mirror-mode {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  )
}

