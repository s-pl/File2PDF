const fs = require('fs').promises;
const path = require('path');
const uploadsDir = path.join(__dirname, '..', 'uploads');

async function delFiles() {
    try {

        
        let files = await fs.readdir(uploadsDir);
        for (const file of files) {
            const filePath = path.join(uploadsDir, file);
            try {
                await fs.unlink(filePath);
                console.log(`File deleted: ${file}`);
            } catch (err) {
                console.log(`Error deleting file ${file}: ${err}`);
            }
        }
    } catch (err) {
        console.log(`Error reading directory: ${err}`);
    }
}

module.exports = {
    delFiles
};
