const express = require('express');
const app = express();
const fs = require('fs');
const uuid = require('uuid').v4;
const path = require('path');
const unoconv = require('./node-unoconv');
const async = require('async');

const PORT = process.env.PORT || 3000;
const MAX_FILE_SIZE = '50mb';
const UPLOADS_DIR = path.join(__dirname, 'uploads');

app.use(express.json({ limit: MAX_FILE_SIZE }));
app.use(express.urlencoded({ limit: MAX_FILE_SIZE }));

// Ruta para servir el archivo HTML
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Configuración de la cola de tareas
const queue = async.queue(async (task, callback) => {
    const { ext, b64File, res } = task;

    if (!ext || !b64File) {
        const errorMessage = "Faltan parámetros requeridos.";
        console.error(errorMessage);
        return res.status(400).json({ error: errorMessage });
    }

    const b64String = b64File.split(";base64,").pop();
    const id = uuid();
    const fileToWrite = `${id}.${ext}`;

    try {
        if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR);
        }

        fs.writeFile(path.join(UPLOADS_DIR, fileToWrite), b64String, { encoding: 'base64' }, async function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Ha ocurrido un error al guardar el archivo." });
            }

            try {
                const result = await unoconv.convert(path.join(UPLOADS_DIR, fileToWrite));
                res.status(200).json({ id, file: result });
            } catch (convertErr) {
                console.error(convertErr);
                res.status(500).json({ error: "Ha ocurrido un error al convertir el archivo." });
            }

            callback();
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ha ocurrido un error inesperado." });
        callback(err);
    }
}, 1);

// Ruta para manejar las solicitudes de carga de archivos
app.post('/upload', function(req, res) {
    const { fileExt, file } = req.body;

    if (!fileExt || !file) {
        return res.status(400).json({ error: "Faltan parámetros requeridos." });
    }

    queue.push({ ext: fileExt.split(".").pop(), b64File: file, res }, function(err) {
        if (err) {
            console.error('Error procesando la tarea:', err);
        } else {
            console.log('Tarea completada con éxito');
        }
    });
});

// Ruta para obtener el estado de la cola
app.get('/queueStatus', (req, res) => {
    res.json({ queueStatus: queue.length() });
});

// Manejadores de errores
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: "Ha ocurrido un error en el servidor." });
});

// Iniciar el servidor
app.listen(PORT, function() {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
