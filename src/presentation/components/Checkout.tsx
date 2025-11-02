import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppSelector, useAppDispatch } from "../../infrastructure/store/hooks";
import { clearCart } from "../../infrastructure/store/slices/cartSlice";
import { FiLock, FiCreditCard, FiUser, FiMail, FiPhone, FiMapPin, FiXCircle, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import CreditCard from "./CreditCard";
import ProductImage from "./ProductImage";
import { formatCurrency } from "../../infrastructure/utils/formatCurrency";
import { processTransaction, TransactionError } from "../../infrastructure/api/productsApi";
import PaymentProcessingModal from "./PaymentProcessingModal";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .required("El nombre completo es requerido"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es requerido"),
  phone: Yup.string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .required("El teléfono es requerido"),
  address: Yup.string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .required("La dirección es requerida"),
  city: Yup.string()
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .required("La ciudad es requerida"),
  country: Yup.string().required("El país es requerido"),
  cardNumber: Yup.string()
    .required("El número de tarjeta es requerido")
    .matches(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "El número de tarjeta debe tener 16 dígitos"),
  cardHolder: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre en la tarjeta es requerido"),
  expMonth: Yup.string()
    .required("El mes es requerido")
    .matches(/^(0[1-9]|1[0-2])$/, "Mes inválido (01-12)"),
  expYear: Yup.string()
    .required("El año es requerido")
    .matches(/^\d{2}$/, "Año inválido (AA)"),
  cvc: Yup.string()
    .required("El CVC es requerido")
    .matches(/^\d{3,4}$/, "El CVC debe tener 3 o 4 dígitos")
});

const STORAGE_KEY = "checkout_form_data";

function Checkout() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = totalPrice;
  const shipping = 15000;
  const tax = totalPrice * 0.15;
  const finalTotal = subtotal + shipping + tax;

  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getInitialValues = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch {
        return getDefaultValues();
      }
    }
    return getDefaultValues();
  };

  const getDefaultValues = () => ({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "México",
    cardNumber: "",
    cardHolder: "",
    expMonth: "",
    expYear: "",
    cvc: ""
  });

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema,
    onSubmit: async (values) => {
      setError(null);
      setSuccessMessage(null);
      setIsProcessing(true);

      try {
        const cardNumberClean = values.cardNumber.replace(/\s/g, "");

        if (cartItems.length === 0) {
          throw new Error("No hay productos en el carrito");
        }

        const transaction = {
          products: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          delivery: {
            address: values.address,
            city: values.city,
            country: values.country,
            customer: {
              fullName: values.fullName,
              email: values.email,
              phone: values.phone
            },
            productId: cartItems[0].productId
          },
          card: {
            number: cardNumberClean,
            exp_month: values.expMonth,
            exp_year: values.expYear,
            cvc: values.cvc,
            card_holder: values.cardHolder
          }
        };

        await processTransaction(transaction);

        localStorage.removeItem(STORAGE_KEY);
        dispatch(clearCart());
        setSuccessMessage("¡Transacción procesada exitosamente! Tu pedido ha sido confirmado.");
        
        formik.resetForm();
        
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (err) {
        if (err instanceof TransactionError) {
          if (err.errors) {
            const validationMessages = Object.entries(err.errors)
              .map(([field, messages]) => {
                const fieldName = field === 'card.number' ? 'Número de tarjeta' :
                                 field === 'card.exp_month' ? 'Mes de expiración' :
                                 field === 'card.exp_year' ? 'Año de expiración' :
                                 field === 'card.cvc' ? 'CVC' :
                                 field === 'card.card_holder' ? 'Nombre en la tarjeta' :
                                 field === 'delivery.address' ? 'Dirección' :
                                 field === 'delivery.city' ? 'Ciudad' :
                                 field === 'delivery.country' ? 'País' :
                                 field === 'delivery.customer.fullName' ? 'Nombre completo' :
                                 field === 'delivery.customer.email' ? 'Correo electrónico' :
                                 field === 'delivery.customer.phone' ? 'Teléfono' :
                                 field;
                return `${fieldName}: ${messages.join(', ')}`;
              })
              .join('\n');
            setError(`${err.message}\n\n${validationMessages}`);
          } else {
            setError(err.message);
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error inesperado al procesar la transacción. Por favor, intenta nuevamente.");
        }
      } finally {
        setIsProcessing(false);
      }
    }
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formik.values));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formik.values]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\s/g, "").replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    formik.setFieldValue("cardNumber", formatted.slice(0, 19));
  };

  const handleExpMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const month = value.slice(0, 2);
    if (month.length === 2) {
      const monthNum = parseInt(month, 10);
      if (monthNum > 12) {
        formik.setFieldValue("expMonth", "12");
      } else if (monthNum === 0) {
        formik.setFieldValue("expMonth", "01");
      } else {
        formik.setFieldValue("expMonth", month.padStart(2, "0"));
      }
    } else {
      formik.setFieldValue("expMonth", month);
    }
  };

  const handleExpYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    formik.setFieldValue("expYear", value.slice(0, 2));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    formik.setFieldValue("cvc", value.slice(0, 4));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Carrito vacío</h1>
            <p className="mt-4 text-gray-600">No hay productos en tu carrito.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PaymentProcessingModal isOpen={isProcessing} />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar compra</h1>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div className="mt-10 lg:mt-0">
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                <FiUser className="size-5" />
                Información de contacto
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                      formik.touched.fullName && formik.errors.fullName
                        ? "border-red-500"
                        : "border-gray-300 focus:border-indigo-500"
                    }`}
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{String(formik.errors.fullName)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiMail className="size-4" />
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : "border-gray-300 focus:border-indigo-500"
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{String(formik.errors.email)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiPhone className="size-4" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                      formik.touched.phone && formik.errors.phone
                        ? "border-red-500"
                        : "border-gray-300 focus:border-indigo-500"
                    }`}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{String(formik.errors.phone)}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                <FiMapPin className="size-5" />
                Dirección de envío
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                      formik.touched.address && formik.errors.address
                        ? "border-red-500"
                        : "border-gray-300 focus:border-indigo-500"
                    }`}
                  />
                  {formik.touched.address && formik.errors.address && (
                    <p className="mt-1 text-sm text-red-600">{String(formik.errors.address)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                      formik.touched.city && formik.errors.city
                        ? "border-red-500"
                        : "border-gray-300 focus:border-indigo-500"
                    }`}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <p className="mt-1 text-sm text-red-600">{String(formik.errors.city)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                      formik.touched.country && formik.errors.country
                        ? "border-red-500"
                        : "border-gray-300 focus:border-indigo-500"
                    }`}
                  >
                    <option value="México">México</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Canadá">Canadá</option>
                  </select>
                  {formik.touched.country && formik.errors.country && (
                    <p className="mt-1 text-sm text-red-600">{String(formik.errors.country)}</p>
                  )}
                </div>
              </div>
            </section>

            <form id="checkout-form-main" onSubmit={formik.handleSubmit}>
              <section className="mt-10">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <FiCreditCard className="size-5" />
                  Método de pago
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Número de tarjeta
                    </label>
                    <div className="relative">
                      <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formik.values.cardNumber}
                        onChange={handleCardNumberChange}
                        onBlur={formik.handleBlur}
                        className={`w-full rounded-md border px-4 py-2 pl-10 focus:ring-indigo-500 ${
                          formik.touched.cardNumber && formik.errors.cardNumber
                            ? "border-red-500"
                            : "border-gray-300 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                    {formik.touched.cardNumber && formik.errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{String(formik.errors.cardNumber)}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre en la tarjeta
                    </label>
                    <input
                      type="text"
                      id="cardHolder"
                      name="cardHolder"
                      value={formik.values.cardHolder}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                        formik.touched.cardHolder && formik.errors.cardHolder
                          ? "border-red-500"
                          : "border-gray-300 focus:border-indigo-500"
                      }`}
                    />
                    {formik.touched.cardHolder && formik.errors.cardHolder && (
                      <p className="mt-1 text-sm text-red-600">{String(formik.errors.cardHolder)}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="expMonth" className="block text-sm font-medium text-gray-700 mb-2">
                        Mes
                      </label>
                      <input
                        type="text"
                        id="expMonth"
                        name="expMonth"
                        placeholder="MM"
                        value={formik.values.expMonth}
                        onChange={handleExpMonthChange}
                        onBlur={formik.handleBlur}
                        className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                          formik.touched.expMonth && formik.errors.expMonth
                            ? "border-red-500"
                            : "border-gray-300 focus:border-indigo-500"
                        }`}
                      />
                      {formik.touched.expMonth && formik.errors.expMonth && (
                        <p className="mt-1 text-sm text-red-600">{String(formik.errors.expMonth)}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="expYear" className="block text-sm font-medium text-gray-700 mb-2">
                        Año
                      </label>
                      <input
                        type="text"
                        id="expYear"
                        name="expYear"
                        placeholder="AA"
                        value={formik.values.expYear}
                        onChange={handleExpYearChange}
                        onBlur={formik.handleBlur}
                        className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                          formik.touched.expYear && formik.errors.expYear
                            ? "border-red-500"
                            : "border-gray-300 focus:border-indigo-500"
                        }`}
                      />
                      {formik.touched.expYear && formik.errors.expYear && (
                        <p className="mt-1 text-sm text-red-600">{String(formik.errors.expYear)}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        name="cvc"
                        placeholder="123"
                        value={formik.values.cvc}
                        onChange={handleCvcChange}
                        onFocus={() => setIsCardFlipped(true)}
                        onBlur={(e) => {
                          setIsCardFlipped(false);
                          formik.handleBlur(e);
                        }}
                        className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                          formik.touched.cvc && formik.errors.cvc
                            ? "border-red-500"
                            : "border-gray-300 focus:border-indigo-500"
                        }`}
                      />
                      {formik.touched.cvc && formik.errors.cvc && (
                        <p className="mt-1 text-sm text-red-600">{String(formik.errors.cvc)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <div className="mt-12">
                <CreditCard
                  cardNumber={formik.values.cardNumber}
                  cardName={formik.values.cardHolder}
                  expiryDate={formik.values.expMonth && formik.values.expYear ? `${formik.values.expMonth}/${formik.values.expYear}` : ""}
                  cvv={formik.values.cvc}
                  isFlipped={isCardFlipped}
                />
              </div>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex items-start gap-3">
                    <FiXCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-800 mb-2">Error al procesar el pago</h4>
                      <div className="text-sm text-red-700 whitespace-pre-line">{error}</div>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <FiXCircle className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="size-5 text-green-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-800">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 lg:hidden">
                <button
                  type="submit"
                  disabled={!formik.isValid || isProcessing}
                  className="w-full rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiLock className="size-5" />
                  {isProcessing ? "Procesando..." : "Completar pedido"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-10 lg:mt-0 lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Resumen del pedido</h2>

              <div className="flow-root max-h-96 overflow-y-auto">
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
                            <h3>{item.name}</h3>
                            <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.color}
                            {item.size && ` - Talla: ${item.size}`}
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Cantidad: {item.quantity}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-gray-900">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impuestos</span>
                  <span className="text-gray-900">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form-main"
                disabled={!formik.isValid || isProcessing}
                className="mt-6 w-full rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FiLock className="size-5" />
                {isProcessing ? "Procesando..." : "Completar pedido"}
              </button>

              <p className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                <FiLock className="size-3" />
                Tus datos están protegidos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

