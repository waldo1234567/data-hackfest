import { Routes, Route, Navigate } from 'react-router-dom';

import Landing from "./pages/Landing";
import TaskPage from "./pages/TaskPage";
import MindMap from './component/MindMap';
import ReportPage from './pages/ReportPage';

import LandingLayout from './layouts/LandingLayout';
import TaskPageLayout from './layouts/TaskPageLayout';
import MindMapLayout from './layouts/MindMapLayout';
import ReportPageLayout from './layouts/ReportPageLayout';
import HistoryPageLayout from './layouts/HistoryPageLayout';
import HistoryPage from './pages/HistoryPage';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path='/' element={<Landing />} />
        </Route>

        <Route
          element={<ProtectedRoute />}
        >
          <Route element={<TaskPageLayout />}>
            <Route path='/task' element={<TaskPage />} />
          </Route>

          <Route element={<MindMapLayout />}>
            <Route path='/mindmap' element={<MindMap />} />
          </Route>

          <Route element={<ReportPageLayout />}>
            <Route path='/report' element={<ReportPage />} />
          </Route>

          <Route element={<HistoryPageLayout />}>
            <Route path='/history' element={<HistoryPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
