import { BrowserRouter, Route, Routes } from 'react-router';

import {
  AboutPage,
  CitizenPage,
  GlobalAlertsPage,
  HomePage,
  MonitorPage,
  RequestsPage,
} from '@/capabilities/rota-segura';

import { AppShell } from './AppShell';

// Under GitHub Pages project sites the app is served from /<repo>/, exposed
// via PUBLIC_PATH (inlined by DefinePlugin). Strip the trailing slash —
// react-router rejects it. Locally PUBLIC_PATH is unset → basename ''.
const basename = (process.env.PUBLIC_PATH || '/').replace(/\/$/, '');

export function MainRouter() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/alertas" element={<GlobalAlertsPage />} />
          <Route path="/central" element={<MonitorPage />} />
          <Route path="/cidadao" element={<CitizenPage />} />
          <Route path="/chamados" element={<RequestsPage />} />
          <Route path="/sobre" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
