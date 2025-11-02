import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PaymentProcessingModalProps {
  isOpen: boolean;
}

function PaymentProcessingModal({ isOpen }: PaymentProcessingModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardReaderRef = useRef<HTMLDivElement>(null);
  const successBarRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const card = cardRef.current;
    const cardReader = cardReaderRef.current;
    const successBar = successBarRef.current;
    const text = textRef.current;

    if (!overlay || !card || !cardReader || !successBar || !text) return;

    if (!isOpen) {
      gsap.killTweensOf([overlay, card, successBar, text, cardReader]);
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (overlay) overlay.style.display = "none";
        }
      });
      return;
    }

    gsap.killTweensOf([overlay, card, successBar, text, cardReader]);

    overlay.style.display = "flex";
    gsap.set(overlay, { opacity: 0 });
    gsap.set(card, { y: -80, opacity: 0, scale: 0.95 });
    gsap.set(successBar, { scaleX: 0, opacity: 0 });
    gsap.set(cardReader, { scale: 1, opacity: 1 });
    gsap.set(text, { opacity: 0, y: 10 });

    const mainTimeline = gsap.timeline();

    mainTimeline
      .to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(text, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.2")
      .to(card, {
        y: -8,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3")
      .to(card, {
        y: 24,
        duration: 1.4,
        ease: "power1.inOut"
      })
      .to(successBar, {
        scaleX: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=1.0")
      .to({}, {
        duration: 1.0
      })
      .to(successBar, {
        scaleX: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      })
      .to(card, {
        y: 120,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "power2.in"
      })
      .set(card, { y: -80, opacity: 0, scale: 0.95 })
      .to({}, { duration: 0.4 });

    const loopTimeline = gsap.timeline({ repeat: -1 });
    
    loopTimeline
      .to(card, {
        y: -8,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      })
      .to(card, {
        y: 24,
        duration: 1.4,
        ease: "power1.inOut"
      })
      .to(successBar, {
        scaleX: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=1.0")
      .to({}, {
        duration: 1.0
      })
      .to(successBar, {
        scaleX: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      })
      .to(card, {
        y: 120,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "power2.in"
      })
      .set(card, { y: -80, opacity: 0, scale: 0.95 })
      .to({}, { duration: 0.4 });

    mainTimeline.add(loopTimeline);

    return () => {
      gsap.killTweensOf([overlay, card, successBar, text, cardReader]);
      mainTimeline.kill();
      loopTimeline.kill();
    };
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-md"
      style={{ display: "none" }}
    >
      <div className="flex flex-col items-center gap-10">
        <div className="text-center" ref={textRef}>
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">Procesando pago</h3>
          <p className="text-sm text-gray-500">Por favor, espera un momento...</p>
        </div>

        <div className="relative w-80 h-52 flex items-center justify-center">
          <div
            ref={cardReaderRef}
            className="relative w-64 h-36 bg-gray-800 rounded-2xl shadow-2xl overflow-visible"
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-56 h-6 bg-gray-700 rounded-t-xl"></div>
            
            <div className="absolute top-6 left-0 w-full h-28 flex flex-col items-center justify-center gap-2">
              <div className="w-48 h-1 bg-gray-600 rounded-full"></div>
              <div className="w-48 h-1 bg-gray-600 rounded-full"></div>
              <div className="w-48 h-1 bg-gray-600 rounded-full"></div>
            </div>

            <div
              ref={cardRef}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-32 bg-blue-600 rounded-xl shadow-2xl flex items-center justify-end pr-4 border-2 border-blue-700/50"
              style={{ y: -80 }}
            >
              <div className="flex items-center gap-1.5">
                <div className="relative w-9 h-9">
                  <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-red-500"></div>
                  <div className="absolute right-0 top-0 w-9 h-9 rounded-full bg-orange-500"></div>
                </div>
              </div>
            </div>

            <div
              ref={successBarRef}
              className="absolute top-[88px] left-0 w-full h-2.5 bg-green-500 origin-left shadow-lg z-10"
              style={{ transform: "scaleX(0)" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentProcessingModal;
