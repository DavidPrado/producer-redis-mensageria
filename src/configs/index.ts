export default {
    redis:{
        host: process.env.REDIS_HOST!,
        password: process.env.REDIS_PASSWORD!,
        port: Number(process.env.REDIS_PORT!),
    },
};
