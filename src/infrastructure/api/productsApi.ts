interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
}

export interface TransactionRequest {
  products: Array<{
    productId: number;
    quantity: number;
  }>;
  delivery: {
    address: string;
    city: string;
    country: string;
    customer: {
      fullName: string;
      email: string;
      phone: string;
    };
    productId: number;
  };
  card: {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
    card_holder: string;
  };
}

export const fetchProducts = async (): Promise<ApiProduct[]> => {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/products`);
  
  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.statusText}`);
  }
  
  return response.json();
};

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export class TransactionError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'TransactionError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const processTransaction = async (transaction: TransactionRequest): Promise<void> => {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      let validationErrors: Record<string, string[]> | undefined;

      try {
        const errorData: ApiError = await response.json();
        
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        if (errorData.errors) {
          validationErrors = errorData.errors;
        }

        if (validationErrors) {
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ');
          errorMessage = `${errorMessage}${errorMessages ? ` - ${errorMessages}` : ''}`;
        }
      } catch {
        if (response.status === 400) {
          errorMessage = 'Datos de la transacción inválidos. Por favor, verifica la información.';
        } else if (response.status === 401) {
          errorMessage = 'Error de autenticación. Por favor, intenta nuevamente.';
        } else if (response.status === 402) {
          errorMessage = 'Pago rechazado. Verifica los datos de tu tarjeta.';
        } else if (response.status === 404) {
          errorMessage = 'Producto no encontrado.';
        } else if (response.status === 422) {
          errorMessage = 'Datos de validación incorrectos. Por favor, verifica todos los campos.';
        } else if (response.status === 500) {
          errorMessage = 'Error en el servidor. Por favor, intenta más tarde.';
        } else if (response.status === 503) {
          errorMessage = 'Servicio no disponible. Por favor, intenta más tarde.';
        }
      }

      throw new TransactionError(errorMessage, response.status, validationErrors);
    }
  } catch (error) {
    if (error instanceof TransactionError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new TransactionError(
        'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.',
        0
      );
    }
    
    throw new TransactionError(
      'Error inesperado al procesar la transacción. Por favor, intenta nuevamente.',
      0
    );
  }
};

