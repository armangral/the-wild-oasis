import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";

const H1 = styled.h1`
  font-weight: 600;
  font-size: 36px;
`;

const Button = styled.button`
  font-size: 1.4rem;
  padding: 1.2rem 1.6rem;
  font-weight: 500;
  border: none;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-brand-600);
  color: white;
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <div>
        <H1>Hello</H1>
        <Button>Click</Button>
      </div>
    </>
  );
}

export default App;
