const express = require('express');
const cors =require('cors');
const Docker = require('dockerode');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3001;
const docker = new Docker();

app.use(cors());
app.use(express.json());

const languageConfig = {
    javascript: {
        image: 'node:18-slim',
        extension: 'js',
        command: (fileName) => ['node', fileName],
    },
    python: {
        image: 'python:3.9-slim',
        extension: 'py',
        command: (fileName) => ['python', fileName],
    }
};

app.post('/run', async (req, res) => {
    const { language, code } = req.body;
    if (!code) {
        return res.status(400).send('Code is required.');
    }

    const config = languageConfig[language];
    if (!config) {
        return res.status(400).send(`Unsupported language: ${language}.`);
    }

    let tempDir;
    try {
        // Create a secure, temporary directory
        tempDir = await fs.mkdtemp(path.join(__dirname, 'temp-'));
        const tempFileName = `code.${config.extension}`;
        const tempFilePath = path.join(tempDir, tempFileName);
        await fs.writeFile(tempFilePath, code);

        const containerOptions = {
            Image: config.image,
            Cmd: config.command(tempFileName),
            HostConfig: {
                Binds: [`${tempDir}:/app`], // Securely mount only the temp directory
            },
            WorkingDir: '/app',
            Tty: false,
        };

        let output = '';
        const container = await docker.createContainer(containerOptions);
        await container.start();

        const stream = await container.logs({ follow: true, stdout: true, stderr: true });
        stream.on('data', (chunk) => output += chunk.toString('utf8'));
        await new Promise((resolve, reject) => {
            stream.on('end', resolve);
            stream.on('error', reject);
        });

        await container.remove();
        res.send({ output });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error executing code.');
    } finally {
        // Clean up the temporary directory
        if (tempDir) {
            await fs.rm(tempDir, { recursive: true, force: true });
        }
    }
});

app.post('/ai-assist', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).send('Prompt is required.');
    }

    const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_TOKEN;
    if (!HUGGING_FACE_TOKEN) {
        return res.status(500).send('Hugging Face API token is not configured.');
    }

    const API_URL = 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-1.3b-instruct';

    try {
        const response = await axios.post(
            API_URL,
            { inputs: prompt },
            { headers: { Authorization: `Bearer ${HUGGING_FACE_TOKEN}` } }
        );

        const generatedText = response.data[0]?.generated_text || '';
        res.send({ response: generatedText });

    } catch (error) {
        console.error('Error calling Hugging Face API:', error.response ? error.response.data : error.message);
        res.status(500).send('Error getting response from AI model.');
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
