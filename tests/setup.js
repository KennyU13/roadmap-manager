process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://todo_user:todo_password@localhost:5432/todo_db?schema=public';
process.env.JWT_SECRET = 'test_secret_with_more_than_32_characters';
process.env.JWT_EXPIRES_IN = '1h';
process.env.BCRYPT_SALT_ROUNDS = '4';
process.env.RATE_LIMIT_MAX = '1000';
