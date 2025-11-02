import Header from "./presentation/components/Header";
import Hero from "./presentation/components/Hero";
import ProductList from "./presentation/components/ProductList";
import Footer from "./presentation/components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ProductList />
      </main>
      <Footer />
    </div>
  );
}

export default App;
