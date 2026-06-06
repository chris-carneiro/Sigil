import TopBar from './components/layout/TopBar';
import Main from './components/layout/Main';
import UploadPage from './components/upload/UploadPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DownloadPage from './components/download/DownloadPage';
import { NotFound } from './components/common/NotFound';

function App() {
    return (
        <>
            <TopBar />
            <BrowserRouter>
                <Main>
                    <Routes>
                        <Route path='/' element={<UploadPage />} />
                        <Route path='/documents/download/:id' element={<DownloadPage />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </Main>
            </BrowserRouter>
        </>
    );
}

export default App;
