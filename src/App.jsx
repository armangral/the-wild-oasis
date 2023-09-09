import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import Heading from "./ui/Heading";
import Row from "./ui/Row";

const Button = styled.button`
  font-size: 1.4rem;
  padding: 1.2rem 1.6rem;
  font-weight: 500;
  border: none;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-brand-600);
  color: white;
`;

const StyledApp = styled.div`
  /* background-color: aqua; */
  padding: 20px;
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <Row type="horizontal">
          <Heading as="h1">Hello</Heading>
          <Button>Click</Button>
          <Heading as="h3">Hello</Heading>
        </Row>

        <Row type="vertical">
          <Heading as="h1">Hello</Heading>
          <Button>Click</Button>
          <Heading as="h3">Hello</Heading>
        </Row>
      </StyledApp>
    </>
  );
}

export default App;
