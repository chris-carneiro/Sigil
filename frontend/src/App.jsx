import TopBar from './components/layout/TopBar';
import Main from './components/layout/Main';
import UploadPage from './components/upload/UploadPage';


function App() {
  return (
    <>
      <TopBar />
      <Main>
        <UploadPage />
      </Main>
    </>
  )
}

export default App
