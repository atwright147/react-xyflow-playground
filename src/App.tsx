import { ReactFlowProvider } from '@xyflow/react';

import { Flow } from './Flow/Flow';

import '@xyflow/react/dist/style.css';
import './App.module.scss';

function App() {
  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </div>
    </>
  );
}

export default App;
