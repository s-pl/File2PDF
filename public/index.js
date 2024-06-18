const convertButton = document.getElementById("convertButton");
const loader = document.getElementById("loader");
const errorDiv = document.getElementById("error");

document.getElementById('file').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        convertButton.disabled = false;
        errorDiv.textContent = '';
    } else {
        convertButton.disabled = true;
        errorDiv.textContent = 'Por favor, selecciona un archivo válido.';
    }
});

convertButton.addEventListener("click", () => {
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    if (!file) {
        showError("No has seleccionado ningún archivo.");
        return;
    }

    convertButton.disabled = true;
    loader.style.display = "block";
    errorDiv.textContent = "";

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
        postFile({
            fileExt: file.name,
            file: reader.result
        });
    };

    reader.onerror = function () {
        showError("Error al leer el archivo.");
        resetUI();
    };
});

async function postFile(data) {
    try {
        const response = await fetch("/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.file.data) {
            const binaryDataBuffer = result.file.data;
            const bufferArray = new Uint8Array(binaryDataBuffer).buffer;

            const blob = new Blob([bufferArray], {
                type: "application/pdf",
            });

            const url = URL.createObjectURL(blob);
            const downloadSection = document.getElementById("downloadSection");

            downloadSection.innerHTML = '';

            const pdfPreview = document.createElement("div");
            pdfPreview.classList.add("pdfPreview");
            pdfPreview.innerHTML = `<iframe src="${url}" frameborder="0"></iframe>`;
            downloadSection.appendChild(pdfPreview);

            const downloadButton = document.createElement("button");
            downloadButton.textContent = "Descargar PDF " + result.id ;
            downloadButton.classList.add("pdfButton");
            downloadButton.onclick = () => {
                const a = document.createElement("a");
                a.href = url;
                a.download = "result.pdf";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };
            downloadSection.appendChild(downloadButton);
        }

        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
        showError("Error al convertir el archivo.");
    } finally {
        resetUI();
    }
}

function showError(message) {
    errorDiv.textContent = message;
}

function resetUI() {
    loader.style.display = "none";
    convertButton.disabled = false;
}