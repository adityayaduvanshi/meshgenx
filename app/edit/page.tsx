"use client";

import { useRef, Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useTexture } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SVGModel } from "@/components/svg-model";
import { ArrowLeft, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  EffectComposer,
  Bloom,
  BrightnessContrast,
  SMAA,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import React from "react";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  staggerContainer,
  cardAnimation,
  // fadeUp,
  modelContainerAnimation,
  tabContentAnimation,
  pageTransition,
} from "@/lib/animation-values";

import { GeometryControls } from "@/components/controls/geometry-controls";
import { MaterialControls } from "@/components/controls/material-controls";
import { EnvironmentControls } from "@/components/controls/environment-controls";
import { BackgroundControls } from "@/components/controls/background-controls";
import { ExportButtons } from "@/components/export-buttons";
import { EditorMobileWarning } from "@/components/mobile-warning";

import { useDebounce } from "@/hooks/use-debounce";
import { useMobileDetection } from "@/hooks/use-mobile-detection";

import { useEditorStore } from "@/lib/store";
import { DARK_MODE_COLOR, LIGHT_MODE_COLOR } from "@/lib/constants";

function useThemeBackgroundColor() {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    if (resolvedTheme === "dark") return DARK_MODE_COLOR;
    return LIGHT_MODE_COLOR;
  }, [resolvedTheme]);
}

function CustomEnvironment({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl);

  useEffect(() => {
    if (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
    }
  }, [texture]);

  return <Environment map={texture} background={false} />;
}

function SimpleEnvironment({
  environmentPreset,
  customHdriUrl,
}: {
  environmentPreset:
    | "apartment"
    | "city"
    | "dawn"
    | "forest"
    | "lobby"
    | "night"
    | "park"
    | "studio"
    | "sunset"
    | "warehouse"
    | "custom";
  customHdriUrl: string | null;
}) {
  return (
    <>
      {environmentPreset === "custom" && customHdriUrl ? (
        <CustomEnvironment imageUrl={customHdriUrl} />
      ) : (
        <Environment
          preset={
            environmentPreset === "custom" ? undefined : environmentPreset
          }
          background={false}
        />
      )}
    </>
  );
}

interface ModelPreviewProps {
  svgData: string;
  depth: number;
  modelRotationY: number;
  modelGroupRef: React.RefObject<THREE.Group | null>;
  modelRef: React.RefObject<THREE.Group | null>;
  // Geometry settings
  bevelEnabled: boolean;
  bevelThickness: number;
  bevelSize: number;
  bevelSegments: number;
  isHollowSvg: boolean;
  spread: number;
  // Material settings
  useCustomColor: boolean;
  customColor: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  transmission: number;
  envMapIntensity: number;
  // Environment settings
  backgroundColor: string;
  useEnvironment: boolean;
  environmentPreset: string;
  customHdriUrl: string | null;
  // Rendering options
  autoRotate: boolean;
  autoRotateSpeed: number;
  useBloom: boolean;
  bloomIntensity: number;
  bloomMipmapBlur: boolean;
  isMobile: boolean;
  onLoadStart: () => void;
  onLoadComplete: () => void;
  onError: (error: Error) => void;
}

const ModelPreview = React.memo<ModelPreviewProps>(
  ({
    svgData,
    depth,
    modelRotationY,
    modelGroupRef,
    modelRef,
    // Geometry settings
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelSegments,
    isHollowSvg,
    spread,
    // Material settings
    useCustomColor,
    customColor,
    roughness,
    metalness,
    clearcoat,
    transmission,
    envMapIntensity,
    // Environment settings
    backgroundColor,
    useEnvironment,
    environmentPreset,
    customHdriUrl,
    // Rendering options
    autoRotate,
    autoRotateSpeed,
    useBloom,
    bloomIntensity,
    bloomMipmapBlur,
    isMobile,
    // onLoadStart,
    // onLoadComplete,
    // onError,
  }) => {
    const cameraRef = useRef(
      new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        1000
      )
    );

    useEffect(() => {
      const handleResize = () => {
        if (cameraRef.current) {
          cameraRef.current.aspect = window.innerWidth / window.innerHeight;
          cameraRef.current.updateProjectionMatrix();
        }
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    const effects = useMemo(() => {
      if (useBloom) {
        return (
          <EffectComposer multisampling={isMobile ? 0 : 4}>
            <Bloom
              intensity={bloomIntensity * 0.7}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.95}
              mipmapBlur={bloomMipmapBlur}
              radius={0.9}
            />
            <BrightnessContrast
              brightness={0.07}
              contrast={0.05}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        );
      } else if (!isMobile) {
        return (
          <EffectComposer multisampling={0}>
            <SMAA preserveEdges />
          </EffectComposer>
        );
      }
      return null;
    }, [useBloom, bloomIntensity, bloomMipmapBlur, isMobile]);

    const environment = useMemo(() => {
      if (!useEnvironment) return null;

      return (
        <SimpleEnvironment
          environmentPreset={
            environmentPreset as
              | "apartment"
              | "city"
              | "dawn"
              | "forest"
              | "lobby"
              | "night"
              | "park"
              | "studio"
              | "sunset"
              | "warehouse"
              | "custom"
          }
          customHdriUrl={customHdriUrl}
        />
      );
    }, [useEnvironment, environmentPreset, customHdriUrl]);

    if (!svgData) return null;

    return (
      <Canvas
        shadows
        camera={{ position: [0, 0, 150], fov: 50 }}
        dpr={window?.devicePixelRatio || 1.5}
        frameloop="demand"
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          outputColorSpace: "srgb",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          alpha: true,
          logarithmicDepthBuffer: false,
          precision: isMobile ? "mediump" : "highp",
          stencil: false,
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <Suspense fallback={null}>
          <color attach="background" args={[backgroundColor]} />

          <ambientLight intensity={0.6 * Math.PI} />

          <directionalLight
            position={[50, 50, 100]}
            intensity={0.8 * Math.PI}
            castShadow={false}
          />

          {environment}

          <group ref={modelGroupRef} rotation={[0, modelRotationY, 0]}>
            <SVGModel
              svgData={svgData}
              depth={depth * 5}
              bevelEnabled={bevelEnabled}
              bevelThickness={bevelThickness}
              bevelSize={bevelSize}
              bevelSegments={isMobile ? 3 : bevelSegments}
              customColor={useCustomColor ? customColor : undefined}
              roughness={roughness}
              metalness={metalness}
              clearcoat={clearcoat}
              transmission={transmission}
              envMapIntensity={useEnvironment ? envMapIntensity : 0.2}
              receiveShadow={false}
              castShadow={false}
              isHollowSvg={isHollowSvg}
              spread={spread}
              ref={modelRef}
            />
          </group>
        </Suspense>

        {effects}

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
          minDistance={50}
          maxDistance={400}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
        />
      </Canvas>
    );
  }
);

ModelPreview.displayName = "ModelPreview";

// Loading state component
const ModelLoadingState = ({ message }: { message: string }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-b from-muted/10 to-muted/20">
    <div className="flex flex-col items-center gap-4 text-center max-w-xs px-4">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full bg-background/20 animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-background/40 animate-pulse [animation-delay:200ms]"></div>
        <Loader2 className="absolute inset-0 h-full w-full animate-spin text-primary opacity-80" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-muted-foreground">
          This may take a moment for complex SVGs
        </p>
      </div>
    </div>
  </div>
);

const ModelErrorState = ({ error }: { error: string }) => (
  <div className="w-full h-full flex items-center justify-center bg-destructive/5">
    <div className="max-w-sm p-6 text-center">
      <p className="text-destructive font-medium mb-2">Error processing SVG</p>
      <p className="text-xs text-muted-foreground">{error}</p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  </div>
);

export default function EditPage() {
  const {
    svgData,
    fileName,
    isModelLoading,
    svgProcessingError,
    depth,
    isHollowSvg,
    modelRotationY,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelSegments,
    // bevelPreset,
    customColor,
    useCustomColor,
    // materialPreset,
    roughness,
    metalness,
    clearcoat,
    transmission,
    envMapIntensity,
    useEnvironment,
    environmentPreset,
    customHdriUrl,
    userSelectedBackground,
    backgroundColor,
    // solidColorPreset,
    autoRotate,
    autoRotateSpeed,
    isFullscreen,
    useBloom,
    bloomIntensity,
    bloomMipmapBlur,
    // Actions
    setSvgData,
    setFileName,
    setIsModelLoading,
    setSvgProcessingError,
    // setDepth,
    setIsHollowSvg,
    // setModelRotationY,
    // setBevelEnabled,
    // setBevelThickness,
    // setBevelSize,
    // setBevelSegments,
    // setBevelPreset,
    // setCustomColor,
    // setUseCustomColor,
    // setMaterialPreset,
    // setRoughness,
    // setMetalness,
    // setClearcoat,
    // setTransmission,
    // setEnvMapIntensity,
    // setUseEnvironment,
    // setEnvironmentPreset,
    // setCustomHdriUrl,
    // setUserSelectedBackground,
    setBackgroundColor,
    setSolidColorPreset,
    // setAutoRotate,
    // setAutoRotateSpeed,
    setIsFullscreen,
    // setUseBloom,
    // setBloomIntensity,
    // setBloomMipmapBlur,
    toggleVibeMode,
  } = useEditorStore();

  const modelRef = useRef<THREE.Group | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const {
    isMobile,
    continueOnMobile,
    handleContinueOnMobile,
    clearMobilePreference,
  } = useMobileDetection();

  const themeBackgroundColor = useThemeBackgroundColor();

  // cleanup
  useEffect(() => {
    return () => {
      if (customHdriUrl && customHdriUrl.startsWith("data:")) {
        URL.revokeObjectURL(customHdriUrl);
      }
    };
  }, [customHdriUrl]);

  useEffect(() => {
    if (!userSelectedBackground) {
      setBackgroundColor(themeBackgroundColor);
      setSolidColorPreset(resolvedTheme === "dark" ? "dark" : "light");
    }
  }, [
    resolvedTheme,
    themeBackgroundColor,
    userSelectedBackground,
    setBackgroundColor,
    setSolidColorPreset,
  ]);

  // debounce expensive operations
  const debouncedSvgData = useDebounce(svgData, 300);

  // update loading state when svg data changes
  useEffect(() => {
    if (debouncedSvgData) {
      setIsModelLoading(true);
      // simulate processing time for complex svg
      const timer = setTimeout(() => {
        setIsModelLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [debouncedSvgData, setIsModelLoading]);

  useEffect(() => {
    if (!debouncedSvgData) return;

    const hasClosedPath =
      debouncedSvgData.includes("Z") || debouncedSvgData.includes("z");
    const hasMultiplePaths =
      (debouncedSvgData.match(/<path/g) || []).length > 1;
    const hasCircles = debouncedSvgData.includes("<circle");
    const hasEllipse = debouncedSvgData.includes("<ellipse");
    const hasRect = debouncedSvgData.includes("<rect");

    const isLikelyHollow =
      (hasClosedPath &&
        (hasMultiplePaths || hasCircles || hasEllipse || hasRect)) ||
      debouncedSvgData.toLowerCase().includes("smile") ||
      debouncedSvgData.toLowerCase().includes("face");

    setIsHollowSvg(isLikelyHollow);
  }, [debouncedSvgData, setIsHollowSvg]);

  useEffect(() => {
    setIsModelLoading(true);
    const savedSvgData = localStorage.getItem("svgData");
    const savedFileName = localStorage.getItem("fileName");

    if (savedSvgData) {
      setSvgData(savedSvgData);
    } else {
      setIsModelLoading(false);

      if (!savedSvgData) {
        router.push("/");
      }
    }

    if (savedFileName) {
      setFileName(savedFileName);
    }
  }, [router, setSvgData, setFileName, setIsModelLoading]);

  const handleBackToHome = () => {
    clearMobilePreference();
    router.push("/");
  };

  useEffect(() => {
    if (environmentPreset === "custom" && customHdriUrl && useBloom) {
      toggleVibeMode(false);
      toast.info(
        "Vibe Mode has been disabled because you selected a custom image",
        {
          duration: 3000,
        }
      );
    }
  }, [environmentPreset, customHdriUrl, useBloom, toggleVibeMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
    };
  }, [setIsFullscreen]);

  const renderModelPreview = () => {
    if (!svgData) {
      return <ModelLoadingState message="Waiting for SVG data..." />;
    }

    if (isModelLoading) {
      return <ModelLoadingState message="Generating 3D model..." />;
    }

    if (svgProcessingError) {
      return <ModelErrorState error={svgProcessingError} />;
    }

    return (
      <div className="w-full h-full overflow-hidden">
        <ModelPreview
          svgData={svgData}
          depth={depth}
          modelRotationY={modelRotationY}
          modelGroupRef={modelGroupRef}
          modelRef={modelRef}
          // Geometry settings
          bevelEnabled={bevelEnabled}
          bevelThickness={bevelThickness}
          bevelSize={bevelSize}
          bevelSegments={bevelSegments}
          isHollowSvg={isHollowSvg}
          spread={0}
          // Material settings
          useCustomColor={useCustomColor}
          customColor={customColor}
          roughness={roughness}
          metalness={metalness}
          clearcoat={clearcoat}
          transmission={transmission}
          envMapIntensity={envMapIntensity}
          // Environment settings
          backgroundColor={backgroundColor}
          useEnvironment={useEnvironment}
          environmentPreset={environmentPreset}
          customHdriUrl={customHdriUrl}
          // Rendering options
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
          useBloom={useBloom}
          bloomIntensity={bloomIntensity}
          bloomMipmapBlur={bloomMipmapBlur}
          isMobile={isMobile}
          onLoadStart={() => setIsModelLoading(true)}
          onLoadComplete={() => setIsModelLoading(false)}
          onError={(error) => {
            setSvgProcessingError(error.message || "Failed to process SVG");
            setIsModelLoading(false);
          }}
        />
      </div>
    );
  };

  return (
    <motion.main
      className="min-h-screen flex flex-col"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit">
      <motion.header
        className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}>
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToHome}
              aria-label="Back to home"
              className="rounded-md w-fit px-4 py-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            {svgData && (
              <ExportButtons
                fileName={fileName}
                modelGroupRef={modelGroupRef}
              />
            )}
          </div>
        </div>
      </motion.header>

      <div className="container flex-1 px-4 py-6">
        <AnimatePresence mode="wait">
          {isMobile && !continueOnMobile ? (
            <motion.div
              key="mobile-warning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}>
              <EditorMobileWarning
                onContinue={handleContinueOnMobile}
                onReturn={handleBackToHome}
              />
            </motion.div>
          ) : (
            <motion.div
              key="editor-content"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              variants={staggerContainer(0.2)}
              initial="hidden"
              animate="show">
              <motion.div
                variants={modelContainerAnimation}
                className="h-[400px] sm:h-[500px] lg:h-[600px] order-first lg:order-last relative overflow-hidden">
                <Card className="w-full h-full flex flex-col overflow-hidden border shadow-xs">
                  <CardHeader className="p-4 pb-4 border-b bg-background/80 backdrop-blur-xs z-10 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Preview</CardTitle>
                      <CardDescription className="text-xs">
                        {!svgData
                          ? "Loading SVG data..."
                          : isModelLoading
                          ? "Processing SVG..."
                          : "Interact with your 3D model"}
                      </CardDescription>
                    </div>
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              if (isFullscreen) {
                                document.exitFullscreen();
                              } else if (previewContainerRef.current) {
                                previewContainerRef.current.requestFullscreen();
                              }
                            }}
                            aria-label={
                              isFullscreen
                                ? "Exit fullscreen"
                                : "Enter fullscreen"
                            }>
                            {isFullscreen ? (
                              <Minimize2
                                className={`h-4 w-4 ${
                                  backgroundColor === "#FFFFFF" &&
                                  resolvedTheme === "dark"
                                    ? "text-black"
                                    : ""
                                }`}
                              />
                            ) : (
                              <Maximize2
                                className={`h-4 w-4 ${
                                  backgroundColor === "#FFFFFF" &&
                                  resolvedTheme === "dark"
                                    ? "text-black"
                                    : ""
                                }`}
                              />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="left"
                          align="center"
                          sideOffset={10}
                          className="text-xs py-2 px-4 z-99999 shadow-md">
                          Performance may be affected
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardHeader>

                  <div className="grow relative" ref={previewContainerRef}>
                    {renderModelPreview()}
                    {isFullscreen && (
                      <div className="absolute inset-0 pointer-events-none">
                        <TooltipProvider>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant={"ghost"}
                                onClick={() => document.exitFullscreen()}
                                aria-label="Exit fullscreen"
                                className={`absolute top-6 right-6 z-99999 pointer-events-auto bg-transparent
                                  ${
                                    backgroundColor === "#000000" || useBloom
                                      ? "hover:bg-white/10"
                                      : backgroundColor === "#FFFFFF" &&
                                        resolvedTheme === "dark"
                                      ? "hover:bg-black/10"
                                      : "hover:bg-background/80"
                                  } backdrop-blur-xs`}>
                                <Minimize2
                                  className={`h-4 w-4 ${
                                    backgroundColor === "#000000" || useBloom
                                      ? "text-white"
                                      : backgroundColor === "#FFFFFF" &&
                                        resolvedTheme === "dark"
                                      ? "text-black"
                                      : "text-primary/80"
                                  }`}
                                />
                                <span className="sr-only">Exit fullscreen</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="left"
                              align="center"
                              sideOffset={10}
                              className="text-xs py-2 px-4 z-99999 shadow-md">
                              Exit fullscreen
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
              <motion.div
                className="space-y-6 order-last lg:order-first"
                variants={cardAnimation}>
                <Card>
                  <CardHeader className="p-4 pb-4">
                    <CardTitle className="text-lg">Customize</CardTitle>
                    <CardDescription className="text-xs truncate">
                      {fileName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Tabs defaultValue="geometry">
                      <TabsList className="w-full flex justify-between mb-4 overflow-x-auto">
                        <TabsTrigger value="geometry" className="flex-1">
                          Geometry
                        </TabsTrigger>
                        <TabsTrigger value="material" className="flex-1">
                          Material
                        </TabsTrigger>
                        <TabsTrigger value="environment" className="flex-1">
                          Environment
                        </TabsTrigger>
                        <TabsTrigger value="background" className="flex-1">
                          Background
                        </TabsTrigger>
                      </TabsList>

                      <AnimatePresence mode="sync">
                        <TabsContent value="geometry" key="geometry">
                          <motion.div
                            key="geometry-content"
                            variants={tabContentAnimation}
                            initial="hidden"
                            animate="show"
                            exit="exit">
                            <GeometryControls />
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="material" key="material">
                          <motion.div
                            key="material-content"
                            variants={tabContentAnimation}
                            initial="hidden"
                            animate="show"
                            exit="exit">
                            <MaterialControls />
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="environment" key="environment">
                          <motion.div
                            key="environment-content"
                            variants={tabContentAnimation}
                            initial="hidden"
                            animate="show"
                            exit="exit">
                            <EnvironmentControls />
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="background" key="background">
                          <motion.div
                            key="background-content"
                            variants={tabContentAnimation}
                            initial="hidden"
                            animate="show"
                            exit="exit">
                            <BackgroundControls />
                          </motion.div>
                        </TabsContent>
                      </AnimatePresence>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}
