import { useAppDispatch, useAppSelector } from "../../infrastructure/store/hooks";
import { openCart, closeCart } from "../../infrastructure/store/slices/cartSlice";
import { FiShoppingCart } from "react-icons/fi";
import CartDrawer from "./CartDrawer";
import { Link } from "react-router-dom";

function Header() {
  const dispatch = useAppDispatch();
  const isCartOpen = useAppSelector((state) => state.cart.isCartOpen);
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
             <Link to="/"> <h1 className="text-xl font-bold text-gray-900">Ecommerce</h1></Link>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => dispatch(openCart())}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FiShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={() => dispatch(closeCart())} />
    </>
  );
}

export default Header;

