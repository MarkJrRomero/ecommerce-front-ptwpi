import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./presentation/components/Header";
import Hero from "./presentation/components/Hero";
import ProductList from "./presentation/components/ProductList";
import Footer from "./presentation/components/Footer";
import Checkout from "./presentation/components/Checkout";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <ProductList />
                </>
              }
            />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
