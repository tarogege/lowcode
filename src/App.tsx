import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import ListPage from "./pages/ListPage";
import EditPage from "./pages/EditPage";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RequireAuth />}>
        <Route index element={<ListPage />}></Route>
        <Route path="edit" element={<EditPage />}></Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
