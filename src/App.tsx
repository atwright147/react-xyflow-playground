import { ReactFlowProvider } from '@xyflow/react';
import { Flow } from './Flow/Flow';

import '@xyflow/react/dist/style.css';
import './App.css';

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
