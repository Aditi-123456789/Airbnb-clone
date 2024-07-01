import './App.css';
import Hotels from './pages/hotels';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Hotels />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
