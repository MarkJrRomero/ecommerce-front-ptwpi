function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Ecommerce</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Inicio
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Productos
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Carrito
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

