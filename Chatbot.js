const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

// Caminho para o seu executável do Chrome (ajuste conforme necessário)
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ffmpegPath = "C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe";
ffmpeg.setFfmpegPath(ffmpegPath);

const client = new Client({
    puppeteer: {
        executablePath: chromePath,
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente está pronto!');
});

async function handleGifConversionAndSend(msg, gifUrl, gifFileName, mp4FileName) {
    try {
        console.log(Recebido comando ${msg.body});
        
        const response = await axios.get(gifUrl, { responseType: 'arraybuffer' });
        console.log('GIF baixado com sucesso.');
        
        const buffer = Buffer.from(response.data, 'binary');
        const gifPath = path.resolve(__dirname, gifFileName);
        const mp4Path = path.resolve(__dirname, mp4FileName);

        fs.writeFileSync(gifPath, buffer);
        console.log('GIF salvo no sistema de arquivos.');

        await new Promise((resolve, reject) => {
            ffmpeg(gifPath)
                .output(mp4Path)
                .videoCodec('libx264')
                .outputOptions(['-profile:v baseline', '-pix_fmt yuv420p', '-movflags +faststart'])
                .on('end', () => {
                    console.log('Conversão para MP4 concluída.');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Erro durante a conversão:', err);
                    reject(err);
                })
                .run();
        });

        if (fs.existsSync(mp4Path)) {
            console.log('Arquivo MP4 foi gerado com sucesso.');
            const media = MessageMedia.fromFilePath(mp4Path);

            console.log('Tipo de arquivo:', media.mimetype);
            console.log('Tamanho do arquivo:', fs.statSync(mp4Path).size);

            console.log('Enviando MP4...');
            await client.sendMessage(msg.from, media);
            console.log('MP4 enviado');

            // Excluir os arquivos após 10 segundos
            setTimeout(() => {
                fs.unlinkSync(gifPath);
                fs.unlinkSync(mp4Path);
                console.log('Arquivos excluídos após 10 segundos');
            }, 10000); // 10000 milissegundos = 10 segundos
        } else {
            console.error('Arquivo MP4 não foi gerado.');
        }
    } catch (error) {
        console.error('Erro ao enviar o MP4:', error);
    }
}

// Mensagem de boas vindas
client.sendMessage(msg.from, `Olá, seja bem-vindo(a) ao Chatbot LIBRAS do SESI!\n Para começar a buscar, utilize ! e coloque sua mensagem para procurar!\n Exemplo: \"!gif1\"`);

client.on('message', async (msg) => {
    if (msg.body === '!gif1') {
        const gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDJ2NzZqbzdhcGtieXhkazA3cjE0ZTU3cWdyazEzZnBna29keHlrbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QKy5SPvsZE5UtGY580/giphy.gif';
        await handleGifConversionAndSend(msg, gifUrl, 'gif1.gif', 'video1.mp4');
    }

    if (msg.body === '!gif2') {
        client.sendMessage(msg.from, `Certo! Enviando vídeo representando a palavra ${msg.body}`);
        const gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjloeWF3MmEwNjFybnlsd3JrZ2VjM3A3M3hkYTRhYmJzYWkyMHU3ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SQdjS9IS5OCmM7EtRj/giphy.gif';
        await handleGifConversionAndSend(msg, gifUrl, 'gif2.gif', 'video2.mp4');
    }

    if (msg.body === '!gif3') {
        client.sendMessage(msg.from, `Certo! Enviando vídeo representando a palavra ${msg.body}`);
        const gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXE0NTFheWlsMThwY3JnN3M3dm51dnlpaW1yc29yajN1YXh5NWRlZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wpHsOblQw13oo67ctj/giphy.gif';
        await handleGifConversionAndSend(msg, gifUrl, 'gif3.gif', 'video3.mp4');
    }

    if (msg.body === '!gif4') {
        client.sendMessage(msg.from, `Certo! Enviando vídeo representando a palavra ${msg.body}`);
        const gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjloeWF3MmEwNjFybnlsd3JrZ2VjM3A3M3hkYTRhYmJzYWkyMHU3ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SQdjS9IS5OCmM7EtRj/giphy.gif';
        await handleGifConversionAndSend(msg, gifUrl, 'gif4.gif', 'video4.mp4');
    }

});

client.initialize();