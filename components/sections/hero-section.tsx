import gsap from "gsap";
import Image from "next/image";
import { FC, MouseEventHandler, useContext, useRef } from "react";
import styled from "styled-components";
import { CursorContext } from "../../context/cursor-context";
import { WindowLoadingContext } from "../../context/window-loading-context";
import useIsomorphicLayoutEffect from "../../hooks/use-isomorphic-layout-effect";

// styled-components

const HeroSectionContainer = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
  /* align items to center of the container */
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform-origin: top;
  overflow: hidden;

  /* center the container */
  margin: 0 auto;
  & .logo {
    font-size: 30vw;
    display: inline-block;
    transition: all 0.2s ease-out;
    position: absolute;
    left:55vw;
    overflow:hidden;
    top:0;
   max-width: 70%;
   height: 70%;

    &:hover {
      transform: scale(1.1) translateY(-10px) rotate(5deg);
    }
  }
  @media only screen and (max-width: 1560px) {
    gap: ${({ theme }) => theme.space.xl};
  }

  @media only screen and (max-width: 640px) {
    gap: ${({ theme }) => theme.space.lg};
  }
`;

const BigHeading = styled.h1`
  font-size: 7vw;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  opacity: 0;

  & .letterHeading {
    display: inline-block;
    transition: all 0.3s ease-out;

    &:hover {
      transform: scale(1.1) translateY(-10px) rotate(5deg);
    }
  }

  & .letterHeading2 {
    font-size: 3vw;
  font-weight: ${({ theme }) => theme.fontWeights.regular};
    display: inline-block;
    transition: all 0.2s ease-out;

    &:hover {
      transform: scale(1.1) translateY(-10px) rotate(5deg);
    }
    @media only screen and (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    
     font-size:5vw;
    }
    @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}px) {
   
      & .letterHeading {
        font-size:6vw;
       }
    }
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.xl}px) {
    
    & .letterHeading {
     font-size:8vw;
    }
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}px) {
   
    & .letterHeading {
      font-size:13vw;
     }
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
 
    & .letterHeading {
      font-size:16vw;
     }
  }
`;

const HeadingAnimatedWrapper = styled.div`
  position: relative;
  width: fit-content;

  & > .banner {
    position: absolute;
    top: 0;
    width: 10px;
    height: 100%;
    pointer-events: none;

    &.lightRedBanner {
      background-color: ${({ theme }) => theme.colors.lightRed};
    }

    &.greenBanner {
      background-color: ${({ theme }) => theme.colors.green};
    }

    &.blueBanner {
      background-color: ${({ theme }) => theme.colors.blue};
    }
  }
`;

const OutlinedBigHeading = styled(BigHeading)`
  color: transparent;
  -webkit-text-stroke: 2px ${({ theme }) => theme.colors.textPrimary};
  margin-top: 5rem;
  text-transform: uppercase;
  background-image: linear-gradient(
    to right,
    transparent 0%,
    transparent 29%,
    transparent 67%,
    white 100%
  );
  background-size: auto auto;
  background-clip: border-box;
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  transition: background-position 0.3s ease-in;

  &:hover {
    background-position: 200% 0;
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    margin-top: 3rem;
  }
`;

const HiddenCatContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  transition: all 0.3s ease-in;
  opacity: 0;
  pointer-events: none;
  animation: infiniteBounce 1s linear infinite alternate;

  @keyframes infiniteBounce {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(10px);
    }
  }

  &::before {
    content: "Keep Scrolling Please!";
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    text-transform: uppercase;
    padding: 0.5rem;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.colors.lightRed};
    z-index: 10;
  }
`;

const HeroSection: FC = () => {
  const { isLoading } = useContext(WindowLoadingContext);
  const { cursorElement } = useContext(CursorContext);

  const gsapTimeLineRef = useRef(gsap.timeline());

  const heroImageContainerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!isLoading) {
      gsapTimeLineRef.current
        .to(".banner", {
          duration: 1,
          width: "100%",
          ease: "power4.out",
        })
        .to(".banner", {
          duration: 1,
          width: "0%",
          right: 0,
          ease: "power4.out",
        })
        .fromTo(
          ".heroHeading",
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 1,
            ease: "power4.out",
          },
          "-=1"
        )
        .then(() => {
          // window.umami("section-visit-hero");
        });
    }
  }, [isLoading]);

  const handleHover: MouseEventHandler<HTMLHeadingElement> = (e) => {
    if (cursorElement) {
      cursorElement.style.transform = "scale(2) translate(-50%, -50%)";
    }

    // handling the outlined banner
    const target = e.target as Element;

    if (
      target.classList.contains("outlined") &&
      heroImageContainerRef.current
    ) {
      heroImageContainerRef.current.style.opacity = "1";
      // window.umami("cat-banner-hover");
    }
  };

  const handleHoverOut: MouseEventHandler<HTMLHeadingElement> = (e) => {
    if (cursorElement) {
      cursorElement.style.transform = "scale(1) translate(-50%, -50%)";
    }

    // handling the outlined banner
    const target = e.target as Element;

    if (
      target.classList.contains("outlined") &&
      heroImageContainerRef.current
    ) {
      heroImageContainerRef.current.style.opacity = "0";
    }
  };

  return (
    <HeroSectionContainer>
      <img className="logo"  src="/logo_pixwingai.svg" alt="logo" />
      <HeadingAnimatedWrapper>
         {/* @ts-ignore */}
        <BigHeading
          onMouseEnter={handleHover}
          onMouseLeave={handleHoverOut}
          className="heroHeading"
        >
          <span className="letterHeading">P</span>
          <span className="letterHeading">i</span>
          <span className="letterHeading">x</span>
          <span className="letterHeading">W</span>
          <span className="letterHeading">i</span>
          <span className="letterHeading">n</span>
          <span className="letterHeading">g</span>
          <span className="letterHeading">A</span>
          <span className="letterHeading">i</span>
        </BigHeading>
        <div className="lightRedBanner banner"></div>
      </HeadingAnimatedWrapper>
      <HeadingAnimatedWrapper>
         {/* @ts-ignore */}
        <BigHeading
          onMouseEnter={handleHover}
          onMouseLeave={handleHoverOut}
          className="heroHeading"
        >
          <span className="letterHeading2">U</span>
          <span className="letterHeading2">n</span>
          <span className="letterHeading2">l</span>
          <span className="letterHeading2">e</span>
          <span className="letterHeading2">a</span>
          <span className="letterHeading2">s</span>
          <span className="letterHeading2">h</span>
          <span className="letterHeading2">i</span>
          <span className="letterHeading2">n</span>
          <span className="letterHeading2">g</span>
          <span> </span>
          <span className="letterHeading2">P</span>
          <span className="letterHeading2">r</span>
          <span className="letterHeading2">e</span>
          <span className="letterHeading2">c</span>
          <span className="letterHeading2">i</span>
          <span className="letterHeading2">s</span>
          <span className="letterHeading2">i</span>
          <span className="letterHeading2">o</span>
          <span className="letterHeading2">n</span>
          <span> </span>
          <span className="letterHeading2">w</span>
          <span className="letterHeading2">i</span>
          <span className="letterHeading2">t</span>
          <span className="letterHeading2">h</span>
          <span> </span>
          <span className="letterHeading2">infinite</span>
          <br></br>
          <span className="letterHeading2">P</span>
          <span className="letterHeading2">e</span>
          <span className="letterHeading2">r</span>
          <span className="letterHeading2">s</span>
          <span className="letterHeading2">p</span>
          <span className="letterHeading2">e</span>
          <span className="letterHeading2">c</span>
          <span className="letterHeading2">t</span>
          <span className="letterHeading2">i</span>
          <span className="letterHeading2">v</span>
          <span className="letterHeading2">e</span>
        </BigHeading>
        <div className="greenBanner banner"></div>
      </HeadingAnimatedWrapper>
      
     
    </HeroSectionContainer>
  );
};

export default HeroSection;
