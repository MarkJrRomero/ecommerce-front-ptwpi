import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useAppDispatch, useAppSelector } from "../../infrastructure/store/hooks";
import { removeFromCart, updateQuantity, closeCart } from "../../infrastructure/store/slices/cartSlice";
import { FiShoppingCart, FiX, FiPlus, FiMinus } from "react-icons/fi";
import { formatCurrency } from "../../infrastructure/utils/formatCurrency";
import ProductImage from "./ProductImage";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate("/checkout");
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const drawer = drawerRef.current;
    const overlay = overlayRef.current;

    if (!drawer || !overlay) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.killTweensOf([drawer, overlay]);
      
      gsap.set(overlay, { opacity: 0, display: "block" });
      gsap.set(drawer, { x: "100%", display: "block" });

      const timeline = gsap.timeline();
      timeline
        .to(overlay, {
          opacity: 1,
          backdropFilter: "blur(4px)",
          duration: 0.3,
          ease: "power2.out"
        })
        .to(
          drawer,
          {
            x: 0,
            duration: 0.4,
            ease: "power3.out"
          },
          "-=0.2"
        );
    } else {
      gsap.killTweensOf([drawer, overlay]);

      const currentOverlayOpacity = gsap.getProperty(overlay, "opacity");
      if (currentOverlayOpacity === 0 || !currentOverlayOpacity) {
        gsap.set([drawer, overlay], { display: "none" });
        document.body.style.overflow = "";
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set([drawer, overlay], { display: "none" });
          document.body.style.overflow = "";
        }
      });

      timeline
        .to(drawer, {
          x: "100%",
          duration: 0.3,
          ease: "power3.in"
        })
        .to(
          overlay,
          {
            opacity: 0,
            backdropFilter: "blur(0px)",
            duration: 0.3,
            ease: "power2.in"
          },
          "-=0.2"
        );
    }

    return () => {
      gsap.killTweensOf([drawer, overlay]);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      const drawer = drawerRef.current;
      const overlay = overlayRef.current;
      if (drawer && overlay) {
        gsap.killTweensOf([drawer, overlay]);
      }
    };
  }, []);

  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 size-auto max-h-none max-w-none overflow-hidden bg-transparent z-50"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gray-500/75 backdrop-blur-sm z-40 cursor-pointer"
        style={{ display: "none" }}
        onClick={handleOverlayClick}
      ></div>

      <div
        tabIndex={0}
        className="absolute inset-0 pl-10 focus:outline-none sm:pl-16 z-50 pointer-events-none"
      >
        <div
          ref={drawerRef}
          className="ml-auto block size-full max-w-md transform pointer-events-auto"
          style={{ display: "none" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Carrito de compras
                </h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="absolute -inset-0.5"></span>
                    <span className="sr-only">Cerrar panel</span>
                    <FiX className="size-6" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                {cartItems.length === 0 ? (
                  <div className="flex h-full items-center justify-center py-12">
                    <div className="text-center">
                      <FiShoppingCart className="mx-auto size-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">Tu carrito está vacío</p>
                    </div>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item, index) => (
                        <li key={`${item.productId}-${item.color}-${item.size}-${index}`} className="flex py-6">
                          <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <ProductImage
                              src={item.image}
                              alt={item.name}
                              className="size-full object-cover"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a href="#">{item.name}</a>
                                </h3>
                                <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.color}
                                {item.size && ` - Talla: ${item.size}`}
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <p className="text-gray-500">Cantidad:</p>
                                <button
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      dispatch(
                                        updateQuantity({
                                          productId: item.productId,
                                          quantity: item.quantity - 1,
                                          color: item.color,
                                          size: item.size
                                        })
                                      );
                                    } else {
                                      dispatch(
                                        removeFromCart({
                                          productId: item.productId,
                                          color: item.color,
                                          size: item.size
                                        })
                                      );
                                    }
                                  }}
                                  className="rounded-md border border-gray-300 p-1 hover:bg-gray-100"
                                >
                                  <FiMinus className="size-3" />
                                </button>
                                <span className="w-8 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    dispatch(
                                      updateQuantity({
                                        productId: item.productId,
                                        quantity: item.quantity + 1,
                                        color: item.color,
                                        size: item.size
                                      })
                                    )
                                  }
                                  className="rounded-md border border-gray-300 p-1 hover:bg-gray-100"
                                >
                                  <FiPlus className="size-3" />
                                </button>
                              </div>

                              <div className="flex">
                                <button
                                  type="button"
                                  onClick={() =>
                                    dispatch(
                                      removeFromCart({
                                        productId: item.productId,
                                        color: item.color,
                                        size: item.size
                                      })
                                    )
                                  }
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>{formatCurrency(totalPrice)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Los gastos de envío e impuestos se calculan al finalizar la compra.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    Proceder al pago
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    o{" "}
                    <button
                      type="button"
                      onClick={onClose}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Continuar comprando
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;

