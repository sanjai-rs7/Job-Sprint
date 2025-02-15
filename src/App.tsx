import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import HomePage from "./routes/home";
import SignInPage from "./routes/sign-in";
import SignUpPage from "./routes/sign-up";
import ProtectedRoute from "./routes/ProtectedRoute";
import Generate from "./views/Generate";
import Dashboard from "./routes/Dashboard";
import MainLayout from "./layouts/MainLayout";
import CreateEditPage from "./routes/CreateEditPage";
import MockLoadPage from "./routes/MockLoadPage";
import MockInterviewPage from "./routes/MockInterviewPage";
import Feedback from "./routes/Feedback";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes*/}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/generate" element={<Generate />}>
            <Route index element={<Dashboard />} />
            <Route path=":interviewId" element={<CreateEditPage />} />
            <Route path="interview/:interviewId" element={<MockLoadPage />} />
            <Route
              path="interview/:interviewId/start"
              element={<MockInterviewPage />}
            />
            <Route path="feedback/:interviewId" element={<Feedback />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
