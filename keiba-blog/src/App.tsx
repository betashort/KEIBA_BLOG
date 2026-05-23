import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/Header.tsx";
import Footer from "./component/Footer.tsx";
import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";
import BlogList from "./pages/BlogList.tsx";
import StudyList from "./pages/StudyList.tsx";
import AnalysisList from "./pages/AnalysisList.tsx";
import PredictList from "./pages/PredictList.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import StudyPost from "./pages/StudyPost.tsx";
import AnalysisPost from "./pages/AnalysisPost.tsx";
import PredictPost from "./pages/PredictPost.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
