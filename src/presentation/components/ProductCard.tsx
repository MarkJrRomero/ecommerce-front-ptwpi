import { useAppDispatch } from "../../infrastructure/store/hooks";
import { addToCart, openCart } from "../../infrastructure/store/slices/cartSlice";
import type { Product } from "../../domain/types/product.types";

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

function ProductCard({ product, onProductClick }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      color: product.color,
      price: product.price,
      image: product.image,
      quantity: 1
    }));
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      color: product.color,
      price: product.price,
      image: product.image,
      quantity: 1
    }));
    dispatch(openCart());
  };

  return (
    <div className="group relative">
      <div className="relative">
        <div
          onClick={() => onProductClick(product)}
          className="cursor-pointer"
        >
          <img
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
            <p className="text-sm font-medium text-gray-900">${product.price}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Agregar al carrito
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors duration-200"
          >
            Comprar ahora
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

