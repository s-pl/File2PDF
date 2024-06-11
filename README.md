# File2PDF

Convierte cualquier archivo a PDF gracias a esta aplicación

## Descripción del Código

El servidor utiliza Express.js para manejar las solicitudes HTTP y async.js para gestionar una cola de tareas para la conversión de archivos. El proceso de conversión se realiza utilizando unoconv, que es una herramienta para convertir entre diferentes formatos de archivo gracias a Libreoffice.

## Instalación

Primero necesitaremos instalar Libreoffice [Aquí.](https://www.libreoffice.org/get-help/install-howto/)

Tras haberlo instalado, necesitaremos clonar el repositorio:
```bash
git clone https://github.com/s-pl/File2PDF

```

También será necesario instalar todas las dependencias:
```bash
pip install -r requeriments.txt
npm install async express uuid path

```
Ahora procederemos a iniciar el servidor con ``node index.js``





    
## Uso de la API

#### Subir archivo

```http
  POST /upload
```

| Parametros | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `fileExt` | `string` | **Obligatorio**. El nombre del archivo (Con la extensión) |
| `file` | `string` | **Obligatorio**. El archivo en Base64 |

#### Conocer estado de la cola
```http
  GET /queueStatus
```

- Esta solicitud devolverá un body en JSON con el estado de la cola:
```JSON
{ queueStatus: numero de peticiones en la cola }
```



## Uso con el cliente

También podremos hacer la conversión en el cliente HTML accediendo a ``localhost:3000``

![img](https://i.ibb.co/JFTFyLy/Captura.png)
