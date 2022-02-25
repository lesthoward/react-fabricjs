
import { useState } from 'react';
import Canvas from "./components/canvas/Canvas";
import Form from "./components/form/Form";
import Container from "./layout/Container";

const App = (): JSX.Element => {
  
	return (
    <Container>
      <Canvas/>
      <Form />
    </Container>
	);
};

export default App;
