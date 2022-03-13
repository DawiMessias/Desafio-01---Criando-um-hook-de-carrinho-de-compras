import React from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBasket } from 'react-icons/md';

import logo from '../../assets/images/logo.svg';
import { Container, Cart } from './styles';
import { useCart } from '../../hooks/useCart';

const Header = (): JSX.Element => {
  // TODO: 
  // Você deve receber o array cart
  // do hook useCart e mostrar em tela
  // a quantidade de produtos distintos adicionados ao carrinho.
  // Dessa forma, se o carrinho possui 4 unidades do
  // item A e 1 unidade do item B o valor a ser mostrado é 2 itens.

  const { cart } = useCart();
  const cartSize = cart.length

  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Rocketshoes" />
      </Link>

      <Cart to="/cart">
        <div>
          <strong>Meu carrinho</strong>
          <span data-testid="cart-size">
            {cartSize === 1 ? `${cartSize} item` : `${cartSize} itens`}
          </span>
        </div>
        <MdShoppingBasket size={36} color="#FFF" />
      </Cart>
    </Container>
  );
};
export default Header;
