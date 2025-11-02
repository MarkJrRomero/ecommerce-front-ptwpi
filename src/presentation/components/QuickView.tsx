import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAppDispatch } from "../../infrastructure/store/hooks";
import { addToCart } from "../../infrastructure/store/slices/cartSlice";
import type { Product } from "../../domain/types/product.types";
import ProductImage from "./ProductImage";
import { formatCurrency } from "../../infrastructure/utils/formatCurrency";

interface QuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

function QuickView({ isOpen, onClose, product }: QuickViewProps) {
  const dispatch = useAppDispatch();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;

    if (!dialog || !panel || !backdrop) return;

    const handleDialogClose = () => {
      document.body.style.overflow = "";
    };

    dialog.addEventListener("close", handleDialogClose);

    if (isOpen) {
      document.body.style.overflow = "hidden";
      dialog.showModal();

      gsap.killTweensOf([panel, backdrop]);
      
      gsap.set(backdrop, { opacity: 0 });
      gsap.set(panel, { opacity: 0, scale: 0.95, y: 20 });

      const timeline = gsap.timeline();
      timeline
        .to(backdrop, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        })
        .to(
          panel,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          },
          "-=0.15"
        );
    } else {
      if (!dialog.open) {
        document.body.style.overflow = "";
        return;
      }

      gsap.killTweensOf([panel, backdrop]);

      gsap.set(panel, { clearProps: false });
      
      const currentOpacity = window.getComputedStyle(panel).opacity;

      if (currentOpacity === "0" || currentOpacity === "") {
        gsap.set(panel, { opacity: 1, scale: 1, y: 0 });
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          if (dialog.open) {
            dialog.close();
          }
          document.body.style.overflow = "";
        }
      });

      timeline
        .to(
          panel,
          {
            opacity: 0,
            scale: 0.95,
            y: 20,
            duration: 0.3,
            ease: "power2.in",
            force3D: true,
            immediateRender: false
          },
          0
        )
        .to(
          backdrop,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            immediateRender: false
          },
          0
        );
    }

    return () => {
      dialog.removeEventListener("close", handleDialogClose);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      const dialog = dialogRef.current;
      if (dialog && dialog.open) {
        dialog.close();
      }
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen && product && (product.stock || 0) === 0) {
      onClose();
    }
  }, [isOpen, product, onClose]);

  if (!product || (product.stock || 0) === 0) return null;

  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
      className="relative z-10"
    >
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-gray-500/75"
      ></div>

      <div tabIndex={0} className="fixed inset-0 z-10 w-screen overflow-y-auto focus:outline-none">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <div
            ref={panelRef}
            className="flex w-full transform text-left text-base md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="relative flex w-full items-stretch overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
              >
                <span className="sr-only">Cerrar</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  className="size-6"
                >
                  <path
                    d="M6 18 18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="grid w-full grid-cols-1 items-stretch gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                <ProductImage
                  src={product.image}
                  alt={product.alt || product.name}
                  className="aspect-2/3 w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5"
                />
                <div className="sm:col-span-8 lg:col-span-7 flex flex-col h-full">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                      {product.name}
                    </h2>

                    <section aria-labelledby="information-heading" className="mt-2">
                      <h3 id="information-heading" className="sr-only">
                        Información del producto
                      </h3>

                      <p className="text-2xl text-gray-900">{formatCurrency(product.price)}</p>
                      
                      <div className="mt-2">
                        <p className={`text-sm font-medium ${(product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Stock: {(product.stock || 0) > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}
                        </p>
                      </div>
                      
                      {product.description && (
                        <p className="mt-4 text-base text-gray-700">
                          {product.description}
                        </p>
                      )}
                    </section>
                  </div>

                  <section aria-labelledby="options-heading" className="mt-auto pt-6">
                    <h3 id="options-heading" className="sr-only">
                      Opciones del producto
                    </h3>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (product && (product.stock || 0) > 0) {
                          dispatch(
                            addToCart({
                              productId: product.id,
                              name: product.name,
                              color: product.color || "Estándar",
                              price: product.price,
                              image: product.image,
                              quantity: 1
                            })
                          );
                          onClose();
                        }
                      }}
                    >
                      <button
                        type="submit"
                        disabled={(product.stock || 0) === 0}
                        className={`flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium focus:ring-2 focus:ring-offset-2 focus:outline-hidden ${
                          (product.stock || 0) > 0
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                      >
                        {(product.stock || 0) > 0 ? "Agregar al carrito" : "Sin stock disponible"}
                      </button>
                    </form>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default QuickView;

