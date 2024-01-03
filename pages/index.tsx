import { gql } from "graphql-request";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRef } from "react";
import styled from "styled-components";
import MetaTags from "../components/metatags";
import APeekInLifeSection from "../components/sections/a-peek-in-life-section";
import ApplicationsSection from "../components/sections/applications-section";
import ContactSection from "../components/sections/contact-section";
import HeroSection from "../components/sections/hero-section";
import TechStackSection from "../components/sections/tech-stack-section";
import WorksSection from "../components/sections/works-section";
import { client, client2 } from "../config/graphql-request";
import type {
  IAchievement,
  IApplication,
  IResponsibility,
  IStack,
  IVolunteer,
  IPixWingStack,
  IVision,
  IProduct,
  ICluture,
  ICorprate
} from "../config/types/dataTypes";
import useIsomorphicLayoutEffect from "../hooks/use-isomorphic-layout-effect";

// types
type IInitialHomePageProps = {
  stacks: IStack[];
  applications: IApplication[];
  achievements: IAchievement[];
  volunteers: IVolunteer[];
  responsibilities: IResponsibility[];
};

type IInitialHomePagePropsPix={
  pixwingstacks: IPixWingStack[];
  visions: IVision[];
  ourProducts: IProduct[];
  ourCultures:ICluture[];
  corprateSocialRs:ICorprate[];
}

// a responsive container for the page
const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding-left: ${({ theme }) => theme.space.xxl};
  padding-right: ${({ theme }) => theme.space.xxl};

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    padding-left: ${({ theme }) => theme.space.lg};
    padding-right: ${({ theme }) => theme.space.lg};
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding-left: ${({ theme }) => theme.space.md};
    padding-right: ${({ theme }) => theme.space.md};
  }
`;

const Home: NextPage = ({
  initialHomePageProps,initialHomePagePropsPixWingAi,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const windowWidth = window.innerWidth;

    const skewConfigs = {
      ease: 0.1,
      current: 0,
      prevous: 0,
      rounded: 0,
    };

    const skewScrolling = () => {
      if (!windowWidth || !containerRef.current) return;

      skewConfigs.current = window.scrollY;
      skewConfigs.prevous +=
        (skewConfigs.current - skewConfigs.prevous) * skewConfigs.ease;

      skewConfigs.rounded = Math.round(skewConfigs.prevous * 100) / 100;

      // variables
      const difference = skewConfigs.current - skewConfigs.rounded;
      const acceleration = difference / windowWidth;
      const velocity = +acceleration;
      const skew = velocity * 7.5;

      containerRef.current.style.transform = `skewY(${skew}deg)`;

      requestAnimationFrame(skewScrolling);
    };
    requestAnimationFrame(skewScrolling);
  }, []);

  return (
    <>
      <MetaTags />
       {/* @ts-ignore */}
      <Container ref={containerRef}>
        <HeroSection />
        <TechStackSection stacks={initialHomePageProps.stacks} pixwingstacks={initialHomePagePropsPixWingAi.pixwingstacks} />
        <ApplicationsSection products={initialHomePagePropsPixWingAi.ourProducts} />
        <WorksSection
          ourCultures={initialHomePagePropsPixWingAi.ourCultures}
          corprateSocialRs={initialHomePagePropsPixWingAi.corprateSocialRs}
          visions={initialHomePagePropsPixWingAi.visions}
        />
        {/* <APeekInLifeSection /> */}
        <ContactSection />
      </Container>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const query = gql`
    query InitialData {
      stacks {
        id
        name
        image {
          url
          fileName
        }
      }
      applications {
        id
        name
        description
        image {
          url
          fileName
        }
        liveUrl
        sourceCodeUrl
        stacks {
          id
          name
          image {
            url
            fileName
          }
        }
      }
      achievements {
        id
        name
        description
        relevantLink
      }
      volunteers {
        id
        name
        description
        relevantLink
      }
      responsibilities {
        id
        name
        location
        description
        startDate
        endDate
        isOngoing
      }
    }
  `;
  const querypixwingai = gql`
    query InitialData {
      stacks {
        id
        name
        image {
          url
          fileName
        }
      }
      visions{
        vId
        description
      }
      ourProducts{
        id
        description
        productId
      }
      corprateSocialRs{
        csrId
        desc
        title
      }
      ourCultures{
        title
        id_Culture
        description
      }
    }
  `;
  const data = await client.request(query);
  const data1=await client2.request(querypixwingai);
  const initialHomePageProps: IInitialHomePageProps = {
    stacks: data.stacks,
    applications: data.applications,
    achievements: data.achievements,
    volunteers: data.volunteers,
    responsibilities: data.responsibilities,
  };
  const initialHomePagePropsPixWingAi: IInitialHomePagePropsPix = {
    pixwingstacks: data1.stacks,
    visions: data1.visions,
    ourProducts: data1.ourProducts,
    ourCultures:data1.ourCultures,
    corprateSocialRs: data1.corprateSocialRs,
  };
  return {
    props: { initialHomePageProps,initialHomePagePropsPixWingAi },
  };
};
