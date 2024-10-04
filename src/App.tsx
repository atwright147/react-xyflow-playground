import { ReactFlowProvider } from '@xyflow/react';
import './App.css';
import { Flow } from './Flow/Flow';

function App() {
  return (
    <>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </>
  );
}

export default App;
