import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { KnittingGrid } from "./components/KnittingGrid";
import { Footer } from "./components/Footer";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <KnittingGrid />
          <Footer />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
