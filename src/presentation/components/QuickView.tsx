import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAppDispatch } from "../../infrastructure/store/hooks";
import { addToCart } from "../../infrastructure/store/slices/cartSlice";
import type { Product } from "../../domain/types/product.types";

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
  const [selectedColor, setSelectedColor] = useState("white");
  const [selectedSize, setSelectedSize] = useState("S");

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
      const currentTransform = window.getComputedStyle(panel).transform;

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

  if (!product) return null;

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
            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
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

              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                <img
                  src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-quick-preview-02-detail.jpg"
                  alt="Dos camisas de cada color: gris, blanco y negro, dispuestas sobre una mesa."
                  className="aspect-2/3 w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5"
                />
                <div className="sm:col-span-8 lg:col-span-7">
                  <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                    {product.description || `${product.name} - Pack de 6`}
                  </h2>

                  <section aria-labelledby="information-heading" className="mt-2">
                    <h3 id="information-heading" className="sr-only">
                      Información del producto
                    </h3>

                    <p className="text-2xl text-gray-900">${product.price * 6}</p>

                    <div className="mt-6">
                      <h4 className="sr-only">Reseñas</h4>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="size-5 shrink-0 text-gray-900"
                          >
                            <path
                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            />
                          </svg>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="size-5 shrink-0 text-gray-900"
                          >
                            <path
                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            />
                          </svg>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="size-5 shrink-0 text-gray-900"
                          >
                            <path
                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            />
                          </svg>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="size-5 shrink-0 text-gray-900"
                          >
                            <path
                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            />
                          </svg>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="size-5 shrink-0 text-gray-200"
                          >
                            <path
                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="sr-only">3.9 de 5 estrellas</p>
                        <a
                          href="#"
                          className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          117 reseñas
                        </a>
                      </div>
                    </div>
                  </section>

                  <section aria-labelledby="options-heading" className="mt-10">
                    <h3 id="options-heading" className="sr-only">
                      Opciones del producto
                    </h3>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (product) {
                          dispatch(
                            addToCart({
                              productId: product.id,
                              name: product.name,
                              color: selectedColor,
                              price: product.price,
                              image: product.image,
                              quantity: 1,
                              size: selectedSize
                            })
                          );
                          onClose();
                        }
                      }}
                    >
                      <fieldset aria-label="Elige un color">
                        <legend className="text-sm font-medium text-gray-900">
                          Color
                        </legend>

                        <div className="mt-4 flex items-center gap-x-3">
                          <div className="flex rounded-full outline -outline-offset-1 outline-black/10">
                            <input
                              type="radio"
                              name="color"
                              value="white"
                              checked={selectedColor === "white"}
                              onChange={(e) => setSelectedColor(e.target.value)}
                              aria-label="Blanco"
                              className="size-8 appearance-none rounded-full bg-white forced-color-adjust-none checked:outline-2 checked:outline-offset-2 checked:outline-gray-400 focus-visible:outline-3 focus-visible:outline-offset-3"
                            />
                          </div>
                          <div className="flex rounded-full outline -outline-offset-1 outline-black/10">
                            <input
                              type="radio"
                              name="color"
                              value="gray"
                              checked={selectedColor === "gray"}
                              onChange={(e) => setSelectedColor(e.target.value)}
                              aria-label="Gris"
                              className="size-8 appearance-none rounded-full bg-gray-200 forced-color-adjust-none checked:outline-2 checked:outline-offset-2 checked:outline-gray-400 focus-visible:outline-3 focus-visible:outline-offset-3"
                            />
                          </div>
                          <div className="flex rounded-full outline -outline-offset-1 outline-black/10">
                            <input
                              type="radio"
                              name="color"
                              value="black"
                              checked={selectedColor === "black"}
                              onChange={(e) => setSelectedColor(e.target.value)}
                              aria-label="Negro"
                              className="size-8 appearance-none rounded-full bg-gray-900 forced-color-adjust-none checked:outline-2 checked:outline-offset-2 checked:outline-gray-900 focus-visible:outline-3 focus-visible:outline-offset-3"
                            />
                          </div>
                        </div>
                      </fieldset>

                      <fieldset aria-label="Elige una talla" className="mt-10">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            Talla
                          </div>
                          <a
                            href="#"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Guía de tallas
                          </a>
                        </div>

                        <div className="mt-2 grid grid-cols-4 gap-3">
                          <label className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-600 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-600 has-[:disabled]:border-gray-400 has-[:disabled]:bg-gray-200 has-[:disabled]:opacity-25">
                            <input
                              type="radio"
                              name="size"
                              value="XXS"
                              checked={selectedSize === "XXS"}
                              onChange={(e) => setSelectedSize(e.target.value)}
                              className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                            />
                            <span className="text-sm font-medium text-gray-900 uppercase group-has-[:checked]:text-white">
                              XXS
                            </span>
                          </label>
                          <label className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-600 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-600 has-[:disabled]:border-gray-400 has-[:disabled]:bg-gray-200 has-[:disabled]:opacity-25">
                            <input
                              type="radio"
                              name="size"
                              value="XS"
                              checked={selectedSize === "XS"}
                              onChange={(e) => setSelectedSize(e.target.value)}
                              className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                            />
                            <span className="text-sm font-medium text-gray-900 uppercase group-has-[:checked]:text-white">
                              XS
                            </span>
                          </label>
                          <label className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-600 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-600 has-[:disabled]:border-gray-400 has-[:disabled]:bg-gray-200 has-[:disabled]:opacity-25">
                            <input
                              type="radio"
                              name="size"
                              value="S"
                              checked={selectedSize === "S"}
                              onChange={(e) => setSelectedSize(e.target.value)}
                              className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                            />
                            <span className="text-sm font-medium text-gray-900 uppercase group-has-[:checked]:text-white">
                              S
                            </span>
                          </label>
                          <label className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-600 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-600 has-[:disabled]:border-gray-400 has-[:disabled]:bg-gray-200 has-[:disabled]:opacity-25">
                            <input
                              type="radio"
                              name="size"
                              value="M"
                              checked={selectedSize === "M"}
                              onChange={(e) => setSelectedSize(e.target.value)}
                              className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                            />
                            <span className="text-sm font-medium text-gray-900 uppercase group-has-[:checked]:text-white">
                              M
                            </span>
                          </label>
                          <label className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-600 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-600 has-[:disabled]:border-gray-400 has-[:disabled]:bg-gray-200 has-[:disabled]:opacity-25">
                            <input
                              type="radio"
                              name="size"
                              value="L"
                              checked={selectedSize === "L"}
                              onChange={(e) => setSelectedSize(e.target.value)}
                              className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                            />
                            <span className="text-sm font-medium text-gray-900 uppercase group-has-[:checked]:text-white">
                              L
                            </span>
                          </label>
                          <label className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-600 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-600 has-[:disabled]:border-gray-400 has-[:disabled]:bg-gray-200 has-[:disabled]:opacity-25">
                            <input
                              type="radio"
                              name="size"
                              value="XL"
                              checked={selectedSize === "XL"}
                              onChange={(e) => setSelectedSize(e.target.value)}
                              className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                            />
                            <span className="text-sm font-medium text-gray-900 uppercase group-has-[:checked]:text-white">
                              XL
                            </span>
                          </label>
                          <label className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-600 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-600 has-[:disabled]:border-gray-400 has-[:disabled]:bg-gray-200 has-[:disabled]:opacity-25">
                            <input
                              type="radio"
                              name="size"
                              value="XXL"
                              checked={selectedSize === "XXL"}
                              onChange={(e) => setSelectedSize(e.target.value)}
                              className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                            />
                            <span className="text-sm font-medium text-gray-900 uppercase group-has-[:checked]:text-white">
                              XXL
                            </span>
                          </label>
                          <label className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-600 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-600 has-[:disabled]:border-gray-400 has-[:disabled]:bg-gray-200 has-[:disabled]:opacity-25">
                            <input
                              type="radio"
                              name="size"
                              value="XXXL"
                              checked={selectedSize === "XXXL"}
                              onChange={(e) => setSelectedSize(e.target.value)}
                              disabled
                              className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                            />
                            <span className="text-sm font-medium text-gray-900 uppercase group-has-[:checked]:text-white">
                              XXXL
                            </span>
                          </label>
                        </div>
                      </fieldset>

                      <button
                        type="submit"
                        className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                      >
                        Agregar al carrito
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

