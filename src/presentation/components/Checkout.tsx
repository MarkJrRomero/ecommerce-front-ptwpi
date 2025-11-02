import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "../../infrastructure/store/hooks";
import { FiLock, FiCreditCard, FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import CreditCard from "./CreditCard";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es requerido"),
  lastName: Yup.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .required("El apellido es requerido"),
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
  postalCode: Yup.string()
    .min(5, "El código postal debe tener al menos 5 caracteres")
    .required("El código postal es requerido"),
  country: Yup.string().required("El país es requerido"),
  cardNumber: Yup.string()
    .required("El número de tarjeta es requerido")
    .matches(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "El número de tarjeta debe tener 16 dígitos"),
  cardName: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre en la tarjeta es requerido"),
  expiryDate: Yup.string()
    .required("La fecha de vencimiento es requerida")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato inválido (MM/AA)"),
  cvv: Yup.string()
    .required("El CVV es requerido")
    .matches(/^\d{3,4}$/, "El CVV debe tener 3 o 4 dígitos")
});

const STORAGE_KEY = "checkout_form_data";

function Checkout() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = totalPrice;
  const shipping = 15.0;
  const tax = totalPrice * 0.16;
  const finalTotal = subtotal + shipping + tax;

  const [isCardFlipped, setIsCardFlipped] = useState(false);

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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "México",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema,
    onSubmit: (values) => {
      console.log("Procesando pago:", values);
      localStorage.removeItem(STORAGE_KEY);
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

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,2}/g)?.join("/") || cleaned;
    formik.setFieldValue("expiryDate", formatted.slice(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, "");
    formik.setFieldValue("cvv", cleaned.slice(0, 4));
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                        formik.touched.firstName && formik.errors.firstName
                          ? "border-red-500"
                          : "border-gray-300 focus:border-indigo-500"
                      }`}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{String(formik.errors.firstName)}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                        formik.touched.lastName && formik.errors.lastName
                          ? "border-red-500"
                          : "border-gray-300 focus:border-indigo-500"
                      }`}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{String(formik.errors.lastName)}</p>
                    )}
                  </div>
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Código postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formik.values.postalCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                        formik.touched.postalCode && formik.errors.postalCode
                          ? "border-red-500"
                          : "border-gray-300 focus:border-indigo-500"
                      }`}
                    />
                    {formik.touched.postalCode && formik.errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{String(formik.errors.postalCode)}</p>
                    )}
                  </div>
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
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre en la tarjeta
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formik.values.cardName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                        formik.touched.cardName && formik.errors.cardName
                          ? "border-red-500"
                          : "border-gray-300 focus:border-indigo-500"
                      }`}
                    />
                    {formik.touched.cardName && formik.errors.cardName && (
                      <p className="mt-1 text-sm text-red-600">{String(formik.errors.cardName)}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de vencimiento
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/AA"
                        value={formik.values.expiryDate}
                        onChange={handleExpiryDateChange}
                        onBlur={formik.handleBlur}
                        className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                          formik.touched.expiryDate && formik.errors.expiryDate
                            ? "border-red-500"
                            : "border-gray-300 focus:border-indigo-500"
                        }`}
                      />
                      {formik.touched.expiryDate && formik.errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">{String(formik.errors.expiryDate)}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formik.values.cvv}
                        onChange={handleCvvChange}
                        onFocus={() => setIsCardFlipped(true)}
                        onBlur={(e) => {
                          setIsCardFlipped(false);
                          formik.handleBlur(e);
                        }}
                        className={`w-full rounded-md border px-4 py-2 focus:ring-indigo-500 ${
                          formik.touched.cvv && formik.errors.cvv
                            ? "border-red-500"
                            : "border-gray-300 focus:border-indigo-500"
                        }`}
                      />
                      {formik.touched.cvv && formik.errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{String(formik.errors.cvv)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <div className="mt-12">
                <CreditCard
                  cardNumber={formik.values.cardNumber}
                  cardName={formik.values.cardName}
                  expiryDate={formik.values.expiryDate}
                  cvv={formik.values.cvv}
                  isFlipped={isCardFlipped}
                />
              </div>

              <div className="mt-10 lg:hidden">
                <button
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                  className="w-full rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiLock className="size-5" />
                  {formik.isSubmitting ? "Procesando..." : "Completar pedido"}
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
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-full object-cover"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
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
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-gray-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impuestos</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form-main"
                disabled={!formik.isValid || formik.isSubmitting}
                className="mt-6 w-full rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FiLock className="size-5" />
                {formik.isSubmitting ? "Procesando..." : "Completar pedido"}
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

