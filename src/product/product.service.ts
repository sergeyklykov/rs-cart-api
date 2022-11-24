import https from 'https';
import { Injectable } from '@nestjs/common';
import { Product } from 'src/cart';


const productsUrl = 'https://ykja1huv6c.execute-api.eu-west-1.amazonaws.com/dev/products';

const getJson = <T>(url: string): Promise<T> => new Promise((resolve, reject) => {
    https.get(url, (response) => {
        let data = '';

        response.on('data', chunk => data += chunk);
        response.on('end', () => resolve(JSON.parse(data)));
        response.on('error', error => reject(error));
    });
});


@Injectable()
export class ProductService {
    async getProducts(): Promise<Product[]> {
        return getJson(productsUrl);
    }
}
