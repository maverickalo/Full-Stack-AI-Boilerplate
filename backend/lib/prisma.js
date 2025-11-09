const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Health check for database connection
async function healthCheck() {
  try {
    await prisma.$queryRaw`SELECT NOW()`;
    return { status: 'healthy', timestamp: new Date() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

// Graceful shutdown
async function disconnect() {
  await prisma.$disconnect();
}

module.exports = {
  prisma,
  healthCheck,
  disconnect
};