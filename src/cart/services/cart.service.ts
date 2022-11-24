import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { ProductService } from 'src/product/product.service';
import { v4 } from 'uuid';
import { Cart } from '../models';


type CartItemsRaw = { product_id: string, cart_id: string, count: number };

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  constructor(
      @Inject('Db') private client: Client, 
      @Inject('ProductService') private products: ProductService
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    const { id } = await this.client.query('SELECT id FROM carts LIMIT 1').then(result => result.rows[0]);

    if (!id) {
      return null;
    }

    const products = await this.products.getProducts();
    const cartItems = await this.client.query<CartItemsRaw>('SELECT * FROM cart_items WHERE cart_id::text=$1', [id]).then(response => response.rows);

    return {
      id,
      items: cartItems.map(({ product_id, count }) => ({
        count,
        product: products.find(product => product.id === product_id),
      })),
    };
  }

  async createByUserId(userId: string) {
    const id = v4(v4());
    const userCart = {
      id,
      items: [],
    };

    await this.client.query('INSERT INTO carts (id) values ($1)', [id]);

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { count, product }: any): Promise<Cart> {
    const { id, items } = await this.findOrCreateByUserId(userId);
    const isProductExists = items.find(cartItem => cartItem.product.id === product.id);

    const payload = [id, product.id, count];

    console.log('payload = ', payload);

    const query = isProductExists
      ? 'UPDATE cart_items SET count = $3 WHERE cart_id = $1 AND product_id = $2'
      : 'INSERT INTO cart_items (cart_id, product_id, count) values ($1, $2, $3)';

    console.log('query = ', query);

    const queryResult = await this.client.query(query, payload);

    console.log('query result = ', queryResult);

    const updatedCart = await this.findByUserId(null);

    return { ...updatedCart };
  }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }

}
