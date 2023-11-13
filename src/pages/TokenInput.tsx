import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthTokenStoreFacade from "../stores/useAuthTokenStore/useAuthTokenStore.facade";
import useUserInfoStoreFacade from "../stores/useUserInfoStore/useUserInfoStore.facade";
import { useUserLogin } from "../hooks/useUserLogin";
import { AccordionItemData } from "../types/MiscTypes";
import LoadingDots from "../components/LoadingDots";
import Button from "../components/Button";
import HelpSpan from "../components/HelpSpan";
import FallingText from "../components/FallingText";
import Emoji from "../components/Emoji";
import Accordion from "../components/Accordion";
import SvgIcon from "../components/SvgIcon";
import WavesBgImgDark from "../images/layered-waves-bg.svg";
import WavesBgImgLight from "../images/layered-waves-bg-light.svg";
import LogoIcon from "../images/logo.svg?react";
import {
  FixedCenterContainer,
  MainContent,
} from "../styles/BaseStyledComponents";
import styled from "styled-components";

const Content = styled(MainContent)`
  height: 100%;
  padding: 20px 15px;
  background-color: var(--background-color);
  background-image: url(${WavesBgImgLight});
  background-size: cover;
  @media (prefers-color-scheme: dark) {
    background-image: url(${WavesBgImgDark});
  }
`;

const TokenInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Input = styled.input`
  max-width: 400px;
  background-color: white;
  color: black;
  margin: 10px 0;
`;

const SubmitButton = styled(Button)`
  padding: 10px;
  border-radius: 12px;
  font-size: 1rem;
  margin-top: 10px;
`;

const InputContainer = styled.div`
  background-color: var(--foreground-color);
  padding: 16px 12px;
  border-radius: 10px;
`;

const HelpContentParagraph = styled.p`
  margin: 0;
  font-size: 1rem;
`;

// TODO: display error icon
const ErrorTxt = styled.p`
  margin-bottom: 0;
`;

const HeadingAndLogoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  gap: 10px 10px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  all: unset;
  line-height: 1.5;
`;

const List = styled.ol`
  padding-inline-start: 30px;
  li:not(:last-child) {
    margin-bottom: 5px;
  }
`;

const accordionItems: AccordionItemData[] = [
  {
    value: "help-info",
    title: (
      <Title>
        Erm I'm confused, how do I use this app?{" "}
        <Emoji symbol="😵‍💫" label="confused, spiral eyes face" />
      </Title>
    ),
    content: (
      <div>
        <p>
          Hakubun is meant to be used with{" "}
          <a href="https://www.wanikani.com/" target="_blank">
            Wanikani
          </a>
          , a Japanese language learning tool. To use this app, you'll need to
          do the following:
        </p>
        <List>
          <li>
            Create a Wanikani account{" "}
            <em>
              (the first three levels are free, no credit card info needed)
            </em>
          </li>
          <li>
            Navigate to your{" "}
            <a
              href="https://www.wanikani.com/settings/personal_access_tokens"
              target="_blank"
            >
              API tokens page
            </a>{" "}
            and create a Wanikani API token with all permissions allowed
          </li>
          <li>Enter your API token above </li>
          <li>
            Start studying! <Emoji symbol="🥳" label="partying face" />
          </li>
        </List>
      </div>
    ),
  },
];

// TODO: change so bg image is set for page content instead of page
const TokenInput = () => {
  const navigate = useNavigate();
  const { login } = useUserLogin();
  const [hasError, setHasError] = useState(false);
  const [tokenPageLoading, setTokenPageLoading] = useState(false);
  const { isAuthLoading, authToken, isAuthenticated } =
    useAuthTokenStoreFacade();
  const { userInfo } = useUserInfoStoreFacade();

  // logs user in if auth info already in storage
  useEffect(() => {
    if (authToken) {
      setAuth(authToken);
    }
  }, []);

  useEffect(() => {
    if (userInfo !== undefined && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [userInfo]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const apiToken = formData.get("api-token");
    if (apiToken === "") {
      // TODO: show a toast
      console.log("Hey, you need to enter a token!");
    }
    if (apiToken) {
      setAuth(apiToken.toString());
    }
  };

  const setAuth = async (token: string) => {
    setTokenPageLoading(true);
    let success = await login(token);
    // *testing
    console.log("🚀 ~ file: TokenInput.tsx:170 ~ setAuth ~ success:", success);
    // *testing

    if (success) {
      console.log("Successfully logged in!");
      setHasError(false);
    } else {
      setTokenPageLoading(false);
      setHasError(true);
    }
  };

  const HelpPopoverContents = (
    <HelpContentParagraph>
      You can find this on your{" "}
      <a
        href="https://www.wanikani.com/settings/personal_access_tokens"
        target="_blank"
      >
        API tokens page
      </a>
      , make sure to allow all permissions
    </HelpContentParagraph>
  );

  return (
    <>
      {!isAuthLoading && !tokenPageLoading ? (
        <Content>
          <HeadingAndLogoContainer>
            <LogoContainer>
              <SvgIcon icon={<LogoIcon />} width="100%" height="25vh" />
            </LogoContainer>
            <FallingText text="Hakubun" delay={0.5} duration={0.25} />
          </HeadingAndLogoContainer>
          <p>
            A <em>(third-party)</em> Japanese Study App for Wanikani
          </p>
          <form onSubmit={handleSubmit}>
            <InputContainer>
              <TokenInputLabel htmlFor="api-token-input">
                <HelpSpan helpPopoverContents={HelpPopoverContents}>
                  Wanikani API Token
                </HelpSpan>
                <Input
                  id="api-token-input"
                  type="text"
                  name="api-token"
                  data-private
                  data-sentry-mask
                />
              </TokenInputLabel>
              {hasError && (
                <ErrorTxt>
                  Oh no! An error occurred retrieving your info, please make
                  sure your API token is correct
                </ErrorTxt>
              )}
            </InputContainer>
            <ButtonRow>
              <SubmitButton
                aria-label="Submit token"
                type="submit"
                backgroundColor="var(--ion-color-tertiary)"
                color="black"
                style={{ fontSize: "1.25rem" }}
              >
                Let's Study!
              </SubmitButton>
            </ButtonRow>
          </form>
          <Accordion items={accordionItems} />
        </Content>
      ) : (
        <FixedCenterContainer>
          <LoadingDots />
        </FixedCenterContainer>
      )}
    </>
  );
};

export default TokenInput;
