"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { FileUpload } from "@/components/file-upload";
import { MobileWarning } from "@/components/mobile-warning";
import { useMobileDetection } from "@/hooks/use-mobile-detection";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Upload,
  Palette,
  Download,
  Star,
  Users,
  Zap,
  Shield,
  ArrowDown,
  Play,
  Github,
} from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  logoAnimation,
  cardAnimation,
  scaleUp,
} from "@/lib/animation-values";

// Enhanced Hero Section with better value proposition
const HeroSection = ({
  onScrollToUpload,
}: {
  onScrollToUpload: () => void;
}) => (
  <motion.div
    className="text-center mb-16 md:mb-20"
    variants={staggerContainer(0.15)}
    initial="hidden"
    animate="show">
    <motion.h1
      className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight leading-tight md:leading-tight mb-6"
      variants={{
        hidden: { opacity: 0, filter: "blur(10px)" },
        show: {
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}>
      Transform Your Vectors <br className="hidden sm:block" />
      <motion.span
        className="text-primary"
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.4,
              delay: 0.2,
              ease: "easeOut",
            },
          },
        }}>
        in a New Dimension
      </motion.span>
    </motion.h1>

    <motion.p
      className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
      variants={fadeUp}>
      Convert your SVG logos and icons into stunning 3D models with professional
      materials, lighting, and export options. No 3D experience required.
    </motion.p>
  </motion.div>
);

const StatItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex flex-col items-center">
    <Icon className="h-6 w-6 text-primary mb-2" />
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

// Features Section
const FeaturesSection = () => (
  <motion.section
    className="py-20 px-6 md:px-12"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-100px" }}>
    <div className="max-w-6xl mx-auto">
      <motion.div className="text-center mb-16" variants={fadeUp}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Professional 3D Conversion
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to create stunning 3D models from your SVG files
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-8"
        variants={staggerContainer(0.2)}>
        <FeatureCard
          icon={Upload}
          title="Smart SVG Processing"
          description="Advanced algorithms automatically convert your SVG paths into optimized 3D geometry with proper depth and beveling."
          features={[
            "Auto path optimization",
            "Smart depth detection",
            "Bevel generation",
          ]}
        />
        <FeatureCard
          icon={Palette}
          title="Professional Materials"
          description="Choose from premium material presets including metal, glass, plastic, and more with realistic lighting."
          features={[
            "10+ material presets",
            "Custom colors",
            "Realistic lighting",
          ]}
        />
        <FeatureCard
          icon={Download}
          title="Multiple Export Formats"
          description="Export your 3D models in popular formats ready for use in any 3D software or web application."
          features={["GLB/GLTF export", "High resolution", "Web optimized"]}
        />
      </motion.div>
    </div>
  </motion.section>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  features,
}: {
  icon: any;
  title: string;
  description: string;
  features: string[];
}) => (
  <motion.div variants={cardAnimation}>
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </motion.div>
);

// How It Works Section
const HowItWorksSection = () => (
  <motion.section
    className="py-20 px-6 md:px-12 bg-muted/30"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-100px" }}>
    <div className="max-w-4xl mx-auto">
      <motion.div className="text-center mb-16" variants={fadeUp}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-xl text-muted-foreground">
          From SVG to 3D in three simple steps
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-8"
        variants={staggerContainer(0.3)}>
        <StepCard
          step="1"
          title="Upload Your SVG"
          description="Drop your SVG file or choose from our example icons. Works best with simple, clean designs."
        />
        <StepCard
          step="2"
          title="Customize & Preview"
          description="Adjust depth, materials, colors, and lighting in our real-time 3D editor until it's perfect."
        />
        <StepCard
          step="3"
          title="Export & Use"
          description="Download your 3D model in GLB format, ready for web, games, AR/VR, or 3D printing."
        />
      </motion.div>
    </div>
  </motion.section>
);

const StepCard = ({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) => (
  <motion.div className="text-center relative" variants={scaleUp}>
    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
      {step}
    </div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-muted-foreground">{description}</p>

    {step !== "3" && (
      <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-muted-foreground" />
    )}
  </motion.div>
);

// Enhanced Header with GitHub stars
const EnhancedHeader = ({ stars }: { stars: number }) => (
  <motion.header
    className="w-full py-6 px-6 md:px-12 flex justify-between items-center"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    }}>
    <motion.div
      className="flex items-center space-x-2"
      variants={logoAnimation}
      initial="hidden"
      animate="show">
      <Logo className="h-8 w-8 text-primary" />
      <span className="text-xl font-semibold">MeshGenx</span>
    </motion.div>
    <motion.div
      className="flex items-center space-x-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}>
      <Link
        href="https://github.com/adityayaduvanshi/meshgenx"
        target="_blank"
        rel="noopener noreferrer">
        <Button variant="outline" className="flex items-center gap-2">
          <Github size={16} />
          <Star size={16} />
          <span className="font-mono">{stars.toLocaleString()}</span>
        </Button>
      </Link>
      <ModeToggle />
    </motion.div>
  </motion.header>
);

export default function Home() {
  const [svgData, setSvgData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [stars, setStars] = useState(1200);
  const router = useRouter();
  const { isMobile, continueOnMobile, handleContinueOnMobile } =
    useMobileDetection();

  const handleFileUpload = (data: string, name: string) => {
    setSvgData(data);
    setFileName(name);

    setTimeout(() => {
      const element = document.getElementById("continue-button-section");
      if (element) {
        window.scrollTo({
          top: element.offsetTop - window.innerHeight / 4,
          behavior: "smooth",
        });
      }
    }, 300);
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);

    setTimeout(() => {
      const element = document.getElementById("continue-button-section");
      if (element) {
        window.scrollTo({
          top: element.offsetTop - window.innerHeight / 4,
          behavior: "smooth",
        });
      }
    }, 500);
  };

  const handleContinue = async () => {
    if (svgData) {
      setIsLoading(true);

      try {
        localStorage.setItem("svgData", svgData);
        localStorage.setItem("fileName", fileName);
        localStorage.setItem("selectedIcon", selectedIcon);

        if (isMobile) {
          localStorage.setItem("continueOnMobile", "true");
        }

        await new Promise((resolve) => setTimeout(resolve, 100));

        router.push("/edit");
      } catch (error) {
        console.error("Error during navigation:", error);
        setIsLoading(false);
      }
    }
  };

  const scrollToUpload = () => {
    const element = document.getElementById("upload-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetch("https://api.github.com/repos/adityayaduvanshi/meshgenx")
      .then((response) => response.json())
      .then((data) => {
        const starCount = data.stargazers_count;
        setStars(starCount);
      })
      .catch(() => setStars(1200));
  }, []);

  return (
    <motion.main
      className="min-h-screen flex flex-col relative w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      exit={{ opacity: 0 }}>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                opacity: { duration: 0.2 },
              }}>
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-xl font-medium">Preparing your 3D model...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Header */}
      <EnhancedHeader stars={stars} />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col">
        <div className="px-6 md:px-12 py-16">
          <HeroSection onScrollToUpload={scrollToUpload} />

          {/* Upload Section */}
          <div id="upload-section">
            <AnimatePresence mode="wait">
              {isMobile && !continueOnMobile ? (
                <motion.div
                  key="mobile-warning"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}>
                  <MobileWarning onContinue={handleContinueOnMobile} />
                </motion.div>
              ) : (
                <motion.div
                  key="desktop-content"
                  className="w-full max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 100,
                  }}>
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    fileName={fileName}
                    selectedIcon={selectedIcon}
                    onIconSelect={handleIconSelect}
                  />
                  <motion.p
                    className="text-base text-center text-muted-foreground mt-4 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}>
                    *Works best with SVGs having simple geometry and transparent
                    background.
                  </motion.p>

                  <div
                    id="continue-button-section"
                    className="h-20 mb-8 mt-2 flex items-center justify-center">
                    <AnimatePresence>
                      {svgData && (
                        <motion.div
                          key="continue-button"
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                            mass: 1,
                            delay: 0.05,
                          }}
                          className="w-full flex justify-center">
                          <RainbowButton
                            className="max-w-xl w-full md:w-1/2 mx-auto text-md py-6"
                            onClick={handleContinue}
                            disabled={isLoading}>
                            <span className="flex items-center gap-2">
                              {isLoading ? (
                                <>
                                  <Loader2 size={16} className="animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Continue to Editor <ArrowRight size={16} />
                                </>
                              )}
                            </span>
                          </RainbowButton>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <HowItWorksSection />
      </div>

      {/* Enhanced Footer */}
      <motion.footer
        className="w-full py-8 px-6 md:px-12 border-t border-border/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.4,
          ease: "easeOut",
        }}>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1 mb-4 md:mb-0">
            <Logo className="h-5 w-5 text-primary" />
            <span>© 2024 MeshGenX. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1">
            Developed by
            <Link
              href="https://adityayads.vercel.app"
              className="hover:underline font-medium hover:text-primary transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer">
              adityayaduvanshi
            </Link>
          </div>
        </div>
      </motion.footer>
    </motion.main>
  );
}
