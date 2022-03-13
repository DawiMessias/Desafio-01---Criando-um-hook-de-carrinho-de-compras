import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {

    const storagedCart = localStorage.getItem("@RocketShoes:cart")
    
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    console.log("Storeged", storagedCart)

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart]
      const productExists = updatedCart.find(product => product.id === productId)

      const stock = await api.get(`/stock/${productId}`);

      const stockAmount = stock.data.amount;
      const currentAmount = productExists ? productExists.amount : 0;

      const amount = currentAmount + 1;

      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora do stock")
        return;
      }
      
      if(productExists) {
        productExists.amount = amount;
      } else {
        const product = await api.get(`/products/${productId}`)
        const newProduct = {
          ...product.data,
          amount: 1
        }
        updatedCart.push(newProduct)
      }
      setCart(updatedCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const newCarts = [...cart]
      const productIndex = newCarts.findIndex(product => product.id === productId)
      
      if(productIndex >= 0) {
        newCarts.splice(productIndex, 1)
        setCart(newCarts)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCarts))
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO: Incrementar pelo ProductId e somar o valor
      if(amount <= 0 ) {
        return;
      }
      const stock = await api.get(`/stock/${productId}`)
      const stockAmount = stock.data.amount
      if(amount > stockAmount) {
        return toast.error('Quantidade solicitada fora de estoque');
      }
      const updatedCart = [...cart]
      const productExist = updatedCart.find(product => product.id === productId)

      if(productExist) {
        productExist.amount = amount
          setCart(updatedCart)
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
      } else {
        throw Error()
      }
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
