import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./HomePage";
import EditPage from "./EditPage";
import StructurePage from "./StructurePage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="edit" element={<EditPage />} />
                    <Route path="edit/structure" element={<StructurePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}