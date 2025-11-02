import { useAppDispatch } from "../../infrastructure/store/hooks";
import { addToCart, openCart } from "../../infrastructure/store/slices/cartSlice";
import type { Product } from "../../domain/types/product.types";
import ProductImage from "./ProductImage";
import { formatCurrency } from "../../infrastructure/utils/formatCurrency";

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

function ProductCard({ product, onProductClick }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const hasStock = (product.stock || 0) > 0;

  const handleProductClick = () => {
    if (hasStock) {
      onProductClick(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasStock) {
      dispatch(addToCart({
        productId: product.id,
        name: product.name,
        color: product.color,
        price: product.price,
        image: product.image,
        quantity: 1
      }));
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasStock) {
      dispatch(addToCart({
        productId: product.id,
        name: product.name,
        color: product.color,
        price: product.price,
        image: product.image,
        quantity: 1
      }));
      dispatch(openCart());
    }
  };

  return (
    <div className="group relative">
      <div className="relative">
        {!hasStock && (
          <div className="absolute top-2 right-2 z-20 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Sin Stock
          </div>
        )}
        <div
          onClick={handleProductClick}
          className={hasStock ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
        >
          <ProductImage
            src={product.image}
            alt={product.alt}
            className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80 cursor-pointer transition-opacity duration-300"
          />
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm text-gray-700">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{product.color}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">{formatCurrency(product.price)}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
          <button
            onClick={handleAddToCart}
            disabled={!hasStock}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              hasStock
                ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                : "bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            Agregar al carrito
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!hasStock}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              hasStock
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Comprar ahora
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

