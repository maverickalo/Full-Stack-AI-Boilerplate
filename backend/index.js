require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const OpenAI = require('openai');
const {prisma, healthCheck, disconnect} = require('./lib/prisma');

const app = express();

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Full-Stack AI Boilerplate API',
            version: '1.0.0',
            description: 'Clean, production-ready API with OpenAI integration. Ready for your custom implementation.',
        },
    },
    apis: ['./index.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(express.json());

const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here'
    ? new OpenAI({apiKey: process.env.OPENAI_API_KEY})
    : null;

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check for API and database
 *     description: Returns a simple confirmation that the API and database connection are alive.
 */
app.get('/api/health', async (req, res) => {
    try {
        const dbHealth = await healthCheck();

        res.json({
            status: 'ok',
            database: dbHealth.status,
            timestamp: dbHealth.timestamp,
            openai: openai ? 'configured' : 'not_configured'
        });
    } catch (err) {
        console.error('Health check failed:', err);
        res.status(500).json({
            status: 'error',
            error: err.message,
            database: 'disconnected'
        });
    }
});

/**
 * @openapi
 * /api/ai/generate-text:
 *   post:
 *     summary: Generate text using OpenAI
 *     description: Example endpoint showing OpenAI integration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: Text prompt for AI generation
 *               max_tokens:
 *                 type: integer
 *                 default: 100
 *                 description: Maximum tokens to generate
 */
app.post('/api/ai/generate-text', async (req, res) => {
    if (!openai) {
        return res.status(500).json({error: 'OpenAI not configured. Add OPENAI_API_KEY to your environment.'});
    }

    const {prompt, max_tokens = 100} = req.body;

    if (!prompt) {
        return res.status(400).json({error: 'Missing required field: prompt'});
    }

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: prompt}],
            max_tokens,
            temperature: 0.7,
        });

        res.json({
            success: true,
            generated_text: completion.choices[0].message.content,
            usage: completion.usage,
            model: completion.model
        });
    } catch (err) {
        console.error('OpenAI API Error:', err);

        if (err.code === 'insufficient_quota') {
            return res.status(402).json({error: 'OpenAI API quota exceeded'});
        }

        if (err.code === 'invalid_api_key') {
            return res.status(401).json({error: 'Invalid OpenAI API key'});
        }

        res.status(500).json({
            error: 'Failed to generate text',
            details: err.message,
        });
    }
});

// Add your custom endpoints here

const port = process.env.PORT || 4000;

async function startServer() {
    try {
        await prisma.$connect();
        console.log('📊 Database connected successfully');

        app.listen(port, () => {
            console.log(`🚀 API server running on http://localhost:${port}`);
            console.log(`📚 API documentation available at http://localhost:${port}/api-docs`);
            console.log(`🔍 Health check: http://localhost:${port}/api/health`);

            if (openai) {
                console.log('✅ OpenAI integration configured');
            } else {
                console.log('⚠️  OpenAI integration not configured (add OPENAI_API_KEY to enable)');
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await disconnect();
    process.exit(0);
});

startServer();