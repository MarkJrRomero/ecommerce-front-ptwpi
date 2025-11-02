import { useState, useEffect } from "react";
import QuickView from "./QuickView";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useAppDispatch, useAppSelector } from "../../infrastructure/store/hooks";
import { setSelectedProduct, fetchProducts } from "../../infrastructure/store/slices/productsSlice";
import type { Product } from "../../domain/types/product.types";

function ProductList() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const selectedProduct = useAppSelector((state) => state.products.selectedProduct);
  const isLoading = useAppSelector((state) => state.products.isLoading);
  const error = useAppSelector((state) => state.products.error);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
      <div className="bg-white" id="products">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Lista de Productos</h2>

          {error && (
            <div className="mt-6 text-center py-12">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))
            )}
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

