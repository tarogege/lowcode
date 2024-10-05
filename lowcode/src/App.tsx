import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import ListPage from "./pages/ListPage";
import EditPage from "./pages/EditPage";
import RequireAuth from "./components/RequireAuth";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RequireAuth />}>
        <Route path="/list" element={<ListPage></ListPage>}></Route>
        <Route index element={<EditPage></EditPage>}></Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
