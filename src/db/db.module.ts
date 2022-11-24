
import { Module } from '@nestjs/common';
import { Client } from 'pg';


const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOSTNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});


client.connect();


@Module({
    providers: [
        {
            provide: 'Db',
            useValue: client,
        },
    ],
})
export class Db {}
