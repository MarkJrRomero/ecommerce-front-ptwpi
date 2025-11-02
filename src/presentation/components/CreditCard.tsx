interface CreditCardProps {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  isFlipped?: boolean;
}

function CreditCard({ cardNumber, cardName, expiryDate, cvv, isFlipped = false }: CreditCardProps) {
  const getCardType = (number: string): "visa" | "mastercard" | "unknown" => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) {
      return "visa";
    } else if (cleaned.startsWith("5") && cleaned.length >= 1) {
      const firstTwo = cleaned.substring(0, 2);
      if (parseInt(firstTwo) >= 51 && parseInt(firstTwo) <= 55) {
        return "mastercard";
      }
    }
    return "unknown";
  };

  const cardType = getCardType(cardNumber);
  const displayNumber = cardNumber || "•••• •••• •••• ••••";
  const displayName = cardName || "NOMBRE EN LA TARJETA";
  const displayExpiry = expiryDate || "MM/AA";
  const displayCvv = cvv || "•••";

  const isVisa = cardType === "visa";
  const isMastercard = cardType === "mastercard";

  return (
    <div className="relative h-60 w-full max-w-md mx-auto perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute inset-0 backface-hidden">
          <div 
            className={`relative h-full w-full rounded-2xl overflow-hidden shadow-2xl ${
              isVisa 
                ? "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"
                : isMastercard
                ? "bg-gradient-to-br from-orange-600 via-red-600 to-pink-600"
                : "bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
            
            <div className="relative h-full p-6 flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <div className="relative">
                  <div className="w-12 h-8 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                    <div className="grid grid-cols-4 gap-0.5">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-0.5 h-0.5 bg-white/60 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {isVisa && (
                    <div className="text-2xl font-bold tracking-wider text-white drop-shadow-2xl">
                      VISA
                    </div>
                  )}
                  {isMastercard && (
                    <div className="flex items-center relative">
                      <div className="w-8 h-8 rounded-full bg-red-500 -mr-3 shadow-xl"></div>
                      <div className="w-8 h-8 rounded-full bg-orange-500 shadow-xl"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-4 mt-5">
                <div className="text-2xl font-mono tracking-[0.2em] font-light letter-spacing-wide text-center">
                  {displayNumber}
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex-1">
                    <div className="text-[10px] text-white/60 mb-1 uppercase tracking-widest font-light">Nombre del titular</div>
                    <div className="text-sm uppercase tracking-wider font-semibold">
                      {displayName}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[10px] text-white/60 mb-1 uppercase tracking-widest font-light">Fecha de vencimiento</div>
                    <div className="text-sm font-mono">{displayExpiry}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div 
            className={`relative h-full w-full rounded-2xl overflow-hidden shadow-2xl ${
              isVisa 
                ? "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"
                : isMastercard
                ? "bg-gradient-to-br from-orange-600 via-red-600 to-pink-600"
                : "bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
            
            <div className="relative h-full p-4 flex flex-col text-white">
              <div className="h-10 bg-black/40 mt-3 mb-6"></div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-white/90 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest">CVV</span>
                    {isVisa && (
                      <div className="text-[10px] font-bold text-gray-700">VISA</div>
                    )}
                    {isMastercard && (
                      <div className="flex items-center gap-0.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-mono tracking-widest font-bold text-gray-900">
                      {displayCvv}
                    </div>
                  </div>
                </div>
                
                <div className="text-[10px] text-white/70 italic text-center">
                  Autorizado por el portador de la tarjeta
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditCard;

