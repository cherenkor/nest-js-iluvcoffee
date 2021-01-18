import { registerAs } from '@nestjs/config';

export default registerAs('coffees', () => ({
    database: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 1234,
    },
}));
