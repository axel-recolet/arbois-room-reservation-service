export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  jwt: {
    secrete: process.env.JWT_SECRETE,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRESIN,
    },
  },
  mongodb: {
    uri:
      process.env.MONGODB_URI ??
      `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin`,
    user: process.env.MONGODB_USERNAME,
    pass: process.env.MONGODB_PASSWORD,
  },
});
