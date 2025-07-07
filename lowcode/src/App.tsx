import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
// import ListPage from "./pages/ListPage";
// import EditPage from "./pages/EditPage";
import RequireAuth from "./components/RequireAuth";
import { lazy, Suspense } from "react";
// 动态 import
const ListPage = lazy(() => import("./pages/ListPage"));
const EditPage = lazy(() => import("./pages/EditPage"));

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RequireAuth />}>
        <Route path="/list" element={<Suspense fallback={<div>Loading...</div>}><ListPage></ListPage></Suspense>}></Route>
        <Route index element={<Suspense fallback={<div>Loading...</div>}><EditPage></EditPage></Suspense>}></Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
