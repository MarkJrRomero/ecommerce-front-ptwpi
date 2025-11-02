import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const column1Images = [
  "https://i.blogs.es/a1af9b/s23-ultra/840_560.jpeg",
  "https://img.interempresas.net/fotos/2719589.png",
  "https://media.gq.com.mx/photos/5f06154185180fb067835271/16:9/w_2560%2Cc_limit/GettyImages-1125585679.jpg",
];

const column2Images = [
  "https://laciudadrevista.com/wp-content/uploads/2021/11/smartphones.jpg",
  "https://http2.mlstatic.com/D_NQ_954523-MLA72205869627_102023-OO.jpg",
  "https://www.guiadelaudifono.com/uploads/casas/eu/guiadelaudifono/webs/4c66ac9941edf64da22f30592d587c08_dwjh.jpg"
];

const column3Images = [
  "https://powerdeal.com.co/cdn/shop/collections/COMPONENTE-PC_1200x1200.jpg?v=1725571264",
  "https://www.consumer.es/app/uploads/2019/10/smartwatch.jpg",
  "https://www.apple.com/v/macbook-pro/at/images/overview/welcome/hero_endframe__e4ls9pihykya_xlarge.jpg"
];

function Hero() {
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const column3Ref = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const containers = [column1Ref.current, column2Ref.current, column3Ref.current];
    const allImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    containers.forEach((container) => {
      if (container) {
        const images = container.querySelectorAll("img");
        images.forEach((img) => {
          allImages.push(img);
          if (img.complete) {
            loadedCount++;
          } else {
            img.addEventListener("load", () => {
              loadedCount++;
              if (loadedCount === allImages.length) {
                setTimeout(() => setImagesLoaded(true), 150);
              }
            }, { once: true });
          }
        });
      }
    });

    if (loadedCount === allImages.length && allImages.length > 0) {
      setTimeout(() => setImagesLoaded(true), 150);
    }
  }, []);

  useEffect(() => {
    const col1 = column1Ref.current;
    const col2 = column2Ref.current;
    const col3 = column3Ref.current;

    if (!col1 || !col2 || !col3 || !imagesLoaded) return;

    const initAnimations = () => {
      const ctx = gsap.context(() => {
        const getSingleSetHeight = (element: HTMLElement) => {
          const firstSet = element.children[0] as HTMLElement;
          if (!firstSet) return 0;
          
          const setRect = firstSet.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(firstSet);
          const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
          
          return setRect.height + marginBottom;
        };

        const height1 = getSingleSetHeight(col1);
        const height2 = getSingleSetHeight(col2);
        const height3 = getSingleSetHeight(col3);

        if (height1 === 0 || height2 === 0 || height3 === 0) {
          requestAnimationFrame(initAnimations);
          return;
        }

        gsap.killTweensOf([col1, col2, col3]);
        
        gsap.set([col1, col2], { y: 0 });
        gsap.set(col3, { y: -height3 });

        const timeline1 = gsap.timeline({ repeat: -1 });
        timeline1.to(col1, {
          y: -height1,
          duration: 20,
          ease: "none"
        });

        const timeline2 = gsap.timeline({ repeat: -1 });
        timeline2.to(col2, {
          y: -height2,
          duration: 15,
          ease: "none"
        });

        const timeline3 = gsap.timeline({ repeat: -1 });
        timeline3.to(col3, {
          y: 0,
          duration: 18,
          ease: "none"
        });
      });

      return () => {
        ctx.revert();
      };
    };

    const cleanup = initAnimations();
    return cleanup;
  }, [imagesLoaded]);

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48 relative">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Los mejores productos del mercado
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Productos tecnologicos de alta calidad, con los mejores precios del mercado.
            </p>
          </div>
          <div>
            <div className="mt-10">
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:translate-x-8 lg:-translate-y-1/2">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="relative overflow-hidden h-[800px]">
                      <div
                        ref={column1Ref}
                        className="flex flex-col shrink-0"
                        style={{ willChange: "transform" }}
                      >
                        {[...Array(3)].map((_, setIndex) => (
                          <div key={setIndex} className={`flex flex-col space-y-6 lg:space-y-8 ${setIndex === 0 ? 'mb-6 lg:mb-8' : ''}`}>
                            {column1Images.map((image, index) => (
                              <div
                                key={`col1-${setIndex}-${index}`}
                                className={`h-64 w-44 shrink-0 overflow-hidden rounded-lg min-h-[256px] ${
                                  setIndex === 0 && index === 0
                                    ? "sm:opacity-0 lg:opacity-100"
                                    : ""
                                }`}
                              >
                                <img
                                  src={image}
                                  alt=""
                                  className="size-full object-cover"
                                  loading={setIndex > 0 ? "lazy" : "eager"}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="relative overflow-hidden h-[800px]">
                      <div
                        ref={column2Ref}
                        className="flex flex-col shrink-0"
                        style={{ willChange: "transform" }}
                      >
                        {[...Array(3)].map((_, setIndex) => (
                          <div key={setIndex} className={`flex flex-col space-y-6 lg:space-y-8 ${setIndex === 0 ? 'mb-6 lg:mb-8' : ''}`}>
                            {column2Images.map((image, index) => (
                              <div
                                key={`col2-${setIndex}-${index}`}
                                className="h-64 w-44 shrink-0 overflow-hidden rounded-lg min-h-[256px]"
                              >
                                <img
                                  src={image}
                                  alt=""
                                  className="size-full object-cover"
                                  loading={setIndex > 0 ? "lazy" : "eager"}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="relative overflow-hidden h-[800px]">
                      <div
                        ref={column3Ref}
                        className="flex flex-col shrink-0"
                        style={{ willChange: "transform" }}
                      >
                        {[...Array(3)].map((_, setIndex) => (
                          <div key={setIndex} className={`flex flex-col space-y-6 lg:space-y-8 ${setIndex === 0 ? 'mb-6 lg:mb-8' : ''}`}>
                            {column3Images.map((image, index) => (
                              <div
                                key={`col3-${setIndex}-${index}`}
                                className="h-64 w-44 shrink-0 overflow-hidden rounded-lg min-h-[256px]"
                              >
                                <img
                                  src={image}
                                  alt=""
                                  className="size-full object-cover"
                                  loading={setIndex > 0 ? "lazy" : "eager"}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#products"
                className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Ver productos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;

