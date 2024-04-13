import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import ListPage from "./pages/ListPage";
import EditPage from "./pages/EditPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RequireAuth />}>
          <Route index element={<ListPage />}></Route>
          <Route path="edit" element={<EditPage />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
