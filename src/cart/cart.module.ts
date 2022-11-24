import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';
import { ProductService } from 'src/product/product.service';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { Db } from 'src/db/db.module';


@Module({
  imports: [ OrderModule, ProductService ],
  providers: [ CartService, Db, ProductService ],
  controllers: [ CartController ],
  exports: [ Db, ProductService ]
})
export class CartModule {}
