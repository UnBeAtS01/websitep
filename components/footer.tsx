import Link from "next/link";
import styled from "styled-components";

const FooterComponent = styled.footer`
  position: absolute;
  bottom: 10px;
  left: 50%;
  z-index:9000;
  transform: translateX(-50%);

  & * {
    color: ${({ theme }) => theme.colors.textSecondary};
    letter-spacing: 0.1rem;
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    position: relative;
    bottom: unset;
    left: unset;
    transform: unset;
    text-align: center;
    margin-top: ${({ theme }) => theme.space.xl};
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterComponent>
      <div className="container">
        Engineered with ❤️ by{" "}
        <Link href="https://www.linkedin.com/company/pixwingai/about/" passHref>
          <a target="_blank" rel="noopener noreferrer">
            PixWingAi
          </a>
        </Link>
      </div>
    </FooterComponent>
  );
};

export default Footer;
