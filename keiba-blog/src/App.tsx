//css
import "./App.css";
//3rd party
import { BrowserRouter, Routes, Route } from "react-router-dom";
//Components
import Header from "./component/Header.tsx";
import Footer from "./component/Footer.tsx";
//Pages
import Home from "./pages/Home.tsx";

export default function App() {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
