import "./App.css";
import { Routes, Route } from "react-router-dom";
import AppShell from "./component/AppShell.tsx";
import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile.tsx";
import HitokuchiPortfolio from "./pages/HitokuchiPortfolio.tsx";
import AibaDiary from "./pages/AibaDiary.tsx";
import BakenPortfolio from "./pages/BakenPortfolio.tsx";
import BakenMonthlyPost from "./pages/BakenMonthlyPost.tsx";
import NotFound from "./pages/NotFound.tsx";
import BlogList from "./pages/BlogList.tsx";
import StudyList from "./pages/StudyList.tsx";
import AnalysisList from "./pages/AnalysisList.tsx";
import PredictList from "./pages/PredictList.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import StudyPost from "./pages/StudyPost.tsx";
import AnalysisPost from "./pages/AnalysisPost.tsx";
import PredictPost from "./pages/PredictPost.tsx";

/** ルート定義。BrowserRouter / StaticRouter の内側で使う */
export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:article_name" element={<BlogPost />} />
        <Route path="/study" element={<StudyList />} />
        <Route path="/study/:article_name" element={<StudyPost />} />
        <Route path="/analysis" element={<AnalysisList />} />
        <Route path="/analysis/:article_name" element={<AnalysisPost />} />
        <Route path="/predict" element={<PredictList />} />
        <Route path="/predict/:article_name" element={<PredictPost />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/profile/hitokuchi-portfolio"
          element={<HitokuchiPortfolio />}
        />
        <Route
          path="/profile/hitokuchi-portfolio/:bamei"
          element={<AibaDiary />}
        />
        <Route path="/profile/baken-portfolio" element={<BakenPortfolio />} />
        <Route
          path="/profile/baken-portfolio/:yearMonth"
          element={<BakenMonthlyPost />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
