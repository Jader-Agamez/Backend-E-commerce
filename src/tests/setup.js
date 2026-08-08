// Load test env FIRST - no DB_HOST means SQLite
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
delete process.env.DB_HOST;
