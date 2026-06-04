import { ToastContainer } from 'react-toastify';

import { RotaSeguraProvider } from '@/capabilities/rota-segura';
import { MainRouter } from '@/routes/MainRouter';

const App = () => (
  <RotaSeguraProvider>
    <MainRouter />
    <ToastContainer position="top-right" theme="dark" autoClose={4_000} />
  </RotaSeguraProvider>
);

export default App;
