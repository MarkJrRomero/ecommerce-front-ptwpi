import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAppDispatch, useAppSelector } from "../../infrastructure/store/hooks";
import { removeFromCart, updateQuantity, clearCart } from "../../infrastructure/store/slices/cartSlice";
import { FiShoppingCart, FiX, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    const overlay = overlayRef.current;

    if (!drawer || !overlay) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.killTweensOf([drawer, overlay]);
      gsap.set([drawer, overlay], { opacity: 0 });
      gsap.set(drawer, { x: 400, scale: 0.95 });

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
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.35,
            ease: "power3.out",
            force3D: true
          },
          "-=0.2"
        );
    } else {
      const currentOverlayOpacity = window.getComputedStyle(overlay).opacity;
      if (currentOverlayOpacity === "0" || currentOverlayOpacity === "") {
        document.body.style.overflow = "";
        return;
      }

      gsap.killTweensOf([drawer, overlay]);

      const currentDrawerX = gsap.getProperty(drawer, "x");
      if (currentDrawerX === 400 || currentDrawerX === "400px") {
        gsap.set(drawer, { x: 0, opacity: 1, scale: 1 });
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
        }
      });

      timeline
        .to(drawer, {
          opacity: 0,
          x: 400,
          scale: 0.95,
          duration: 0.4,
          ease: "power3.in",
          force3D: true
        })
        .to(
          overlay,
          {
            opacity: 0,
            backdropFilter: "blur(0px)",
            duration: 0.35,
            ease: "power2.in"
          },
          "-=0.25"
        );
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const restoreScroll = () => {
        document.body.style.overflow = "";
      };
      
      const timer = setTimeout(restoreScroll, 400);
      
      return () => {
        clearTimeout(timer);
        restoreScroll();
      };
    }
  }, [isOpen]);

  const handleOverlayClick = () => {
    onClose();
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen && cartItems.length === 0) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={handleOverlayClick}
        style={{ display: isOpen ? "block" : "none" }}
      ></div>
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <FiShoppingCart className="text-2xl text-gray-900" />
              <h2 className="text-lg font-semibold text-gray-900">
                Carrito ({totalItems})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cartItems.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <FiShoppingCart className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-500">Tu carrito está vacío</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.color}-${item.size}-${index}`}
                    className="flex gap-4 border-b pb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-md object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            Color: {item.color} {item.size && `| Talla: ${item.size}`}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            dispatch(
                              removeFromCart({
                                productId: item.productId,
                                color: item.color,
                                size: item.size
                              })
                            )
                          }
                          className="text-gray-400 hover:text-red-600"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
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
                            <FiMinus className="text-sm" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
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
                            <FiPlus className="text-sm" />
                          </button>
                        </div>
                        <p className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="mb-4 flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button className="w-full rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700">
                Proceder al pago
              </button>
              <button
                onClick={() => {
                  dispatch(clearCart());
                }}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CartDrawer;

