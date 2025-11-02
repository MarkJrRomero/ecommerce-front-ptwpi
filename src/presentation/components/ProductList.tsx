import { useState } from "react";
import QuickView from "./QuickView";
import { useAppDispatch, useAppSelector } from "../../infrastructure/store/hooks";
import { setSelectedProduct } from "../../infrastructure/store/slices/productsSlice";
import type { Product } from "../../domain/types/product.types";

function ProductList() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const selectedProduct = useAppSelector((state) => state.products.selectedProduct);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    dispatch(setSelectedProduct(product));
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    dispatch(setSelectedProduct(null));
  };

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <button
                  onClick={() => handleProductClick(product)}
                  className="w-full text-left"
                >
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80 cursor-pointer"
                  />
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <span aria-hidden="true" className="absolute inset-0"></span>
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${product.price}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuickView
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        product={selectedProduct}
      />
    </>
  );
}

export default ProductList;

