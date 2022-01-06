import NextImage from "next/image";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

interface IProps {
  image: string;
}

interface IParticle {
  x: number;
  y: number;
  imageDataFragment: ImageData;
  baseX: number;
  baseY: number;
  density: number;
  draw: () => void;
  update: () => void;
}

const CanvasContainer = styled.div`
  width: 480px;
  height: 270px;
  position: relative;

  &:hover {
    & > canvas {
      opacity: 1;
    }

    & img {
      opacity: 0;
    }
  }

  & > canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease-in;
  }

  & img {
    transition: opacity 0.3s ease-in;
    opacity: 1;
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    width: unset;
    height: unset;

    & * {
      max-height: 20vh !important;
      aspect-ratio: 16/9 !important;
    }
  }
`;

const ParticleCanvas: FC<IProps> = ({ image }) => {
  // const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [sameOriginImageUrl, setSameOriginImageUrl] = useState<string>("");

  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  const memoisedSameOriginImageUrlMap = useRef<Map<string, string>>(new Map());
  const memoisedParticlesMap = useRef<Map<string, IParticle[]>>(new Map());
  const memoisedPixelsMap = useRef<Map<string, Uint8ClampedArray>>(new Map());

  // const [mousePosition, setMousePosition] = useState<{
  //   x: number | null;
  //   y: number | null;
  // }>({ x: null, y: null });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // set the same origin image url to avoid canvas cors error
  useEffect(() => {
    const getSameOriginUrl = async (image: string) => {
      let url: string;
      // check if the image is already in the map
      const memoisedSameOriginImageUrl =
        memoisedSameOriginImageUrlMap.current.get(image);
      if (memoisedSameOriginImageUrl) {
        url = memoisedSameOriginImageUrl;
      } else {
        const data = await fetch(image);
        const blob = await data.blob();
        url = URL.createObjectURL(blob);
        memoisedSameOriginImageUrlMap.current.set(image, url);
      }
      setSameOriginImageUrl(url);
    };

    getSameOriginUrl(image);
  }, [image]);

  useEffect(() => {
    if (containerRef.current && canvasRef.current && shouldAnimate) {
      let ctx: CanvasRenderingContext2D | null = null;
      let canvasRefCurrent: HTMLCanvasElement = canvasRef.current;

      const mouse = {
        x: 0,
        y: 0,
        radius: 80,
        show: false,
      };

      // keeping track of last animation frame
      var animationRequest: number | null = null;

      // create a null variable animate which can be function too
      let animate: () => void;

      // keeping track of active timeouts
      let timeout: NodeJS.Timeout | null = null;

      // set canvas size to that of the container
      canvasRefCurrent.width =
        containerRef.current.getBoundingClientRect().width;
      canvasRefCurrent.height =
        containerRef.current.getBoundingClientRect().height;

      // track mouse position
      containerRef.current.addEventListener("mousemove", (e) => {
        mouse.x = e.offsetX;
        mouse.y = e.offsetY;
      });

      containerRef.current.addEventListener("mouseenter", (e) => {
        mouse.show = true;
        // cancel any existing animation
        animationRequest && cancelAnimationFrame(animationRequest);

        // clear any existing timeouts
        timeout && clearTimeout(timeout);

        // start new animation
        animate && requestAnimationFrame(animate);
      });

      containerRef.current.addEventListener("mouseleave", (e) => {
        mouse.show = false;
        timeout = setTimeout(() => {
          if (animationRequest) {
            cancelAnimationFrame(animationRequest);
            animationRequest = null;
          }
        }, 1000);
      });

      // load image
      const imageObj = new Image();
      imageObj.src = sameOriginImageUrl;

      imageObj.addEventListener("load", () => {
        // stop loading
        // setIsImageLoaded(true);

        if (!canvasRefCurrent) return;

        ctx = canvasRefCurrent.getContext("2d");
        if (!ctx) return;

        let pixels: Uint8ClampedArray | null = null;

        // get memoise pixels
        const memoisedPixels =
          memoisedPixelsMap.current.get(sameOriginImageUrl);

        if (memoisedPixels) {
          pixels = memoisedPixels;
        } else {
          // clear the canvas and draw image
          ctx.clearRect(0, 0, canvasRefCurrent.width, canvasRefCurrent.height);
          ctx.drawImage(
            imageObj,
            0,
            0,
            canvasRefCurrent.width,
            canvasRefCurrent.height
          );

          let imageData = ctx.getImageData(
            0,
            0,
            canvasRefCurrent.width,
            canvasRefCurrent.height
          );

          // getting pixels data
          pixels = imageData.data;

          // memoise pixels
          memoisedPixelsMap.current.set(sameOriginImageUrl, pixels);
        }

        // setting size for particles
        const SIZE_PIXELS = 5; // in px

        // implementing particles class for better control over the particles
        class Particle implements IParticle {
          x: number;
          y: number;
          imageDataFragment: ImageData;
          baseX: number;
          baseY: number;
          density: number;

          constructor(x: number, y: number, imageDataFragment: ImageData) {
            this.x = x;
            this.y = y;
            this.imageDataFragment = imageDataFragment;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = Math.random() * 20 + 10;
          }

          draw() {
            if (!ctx) return;

            // draw the imageData
            ctx.putImageData(this.imageDataFragment, this.x, this.y);
          }

          update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;

            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;

            let force = (maxDistance - distance) / maxDistance;

            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < maxDistance && mouse.show) {
              this.x -= directionX;
              this.y -= directionY;
            } else {
              if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
              }
              if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
              }
            }
          }
        }

        // an array to store particles
        let particlesArray: IParticle[] = [];

        const memoisedParticles =
          memoisedParticlesMap.current.get(sameOriginImageUrl);

        if (memoisedParticles) {
          particlesArray = memoisedParticles;
        } else {
          // get num of particles based on the canvas size each of them having 5px width and height
          const numOfParticlesX = canvasRefCurrent.width;
          const numOfParticlesY = canvasRefCurrent.height;

          for (let y = 0; y < numOfParticlesY; y += SIZE_PIXELS) {
            for (let x = 0; x < numOfParticlesX; x += SIZE_PIXELS) {
              // pixels have rgba values in a uIntClampedArray.. [r, g, b, a, r, g, b, a, ....]

              let imageDataFragment = ctx.getImageData(
                x,
                y,
                SIZE_PIXELS,
                SIZE_PIXELS
              );

              if (!imageDataFragment) {
                continue;
              }

              let particle = new Particle(x, y, imageDataFragment);

              particlesArray.push(particle);
            }
          }

          memoisedParticlesMap.current.set(sameOriginImageUrl, particlesArray);
        }

        animate = () => {
          if (!ctx || !canvasRefCurrent) return;
          ctx.clearRect(0, 0, canvasRefCurrent.width, canvasRefCurrent.height);

          // for loops are more performant than forEach
          for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
          }

          animationRequest = requestAnimationFrame(animate);
        };
      });

      return () => {
        if (ctx) {
          ctx.clearRect(0, 0, canvasRefCurrent.width, canvasRefCurrent.height);
        }
        if (animationRequest) {
          cancelAnimationFrame(animationRequest);
        }
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [sameOriginImageUrl, shouldAnimate]);

  // observe if the container is on the screen
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
        } else {
          setShouldAnimate(false);
        }
      });
    });

    const target = containerRef.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      target && observer.unobserve(target);
    };
  }, []);

  return (
    <CanvasContainer ref={containerRef}>
      <canvas ref={canvasRef} id="particle-canvas" />
      <NextImage height={270} width={480} src={image} alt="app-image-preview" />
    </CanvasContainer>
  );
};

export default ParticleCanvas;
