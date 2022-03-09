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
    console.log(storagedCart)

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO: Copiar as informações pelo ID ?
      // TODO: Fazer um get(Axios) products/productId para obter as infos via Id do Produto

  
      // const newProduct:Product = {
      //   id: productId,
      //   amount,
      //   image,
      //   price,
      //   title
      // }
      //setCart()
    } catch {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const newCarts = [...cart]
      const removeProductFromId =  newCarts.filter(cart => cart.id !== productId)
      setCart(removeProductFromId)
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO: Incrementar pelo ProductId e somar o valor

      // const newCart = [...cart, productId, amount] 
      // setCart(newCart)
    } catch {
      // TODO
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
