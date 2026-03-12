// fetch-data.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ¡IMPORTANTE! Reemplaza este enlace con el enlace CSV público de TU hoja de Google Sheets.
// Para obtenerlo en Google Sheets: Archivo > Compartir > Publicar en la web > Selecciona tu hoja > Elige valores separados por comas (.csv) > Publicar.
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTzjgw5ZW7HysdQVgNSLbJ3XWcu25PHdr4u0k4q0UBXnwlnJs0L-fvEMOFlnVjE_xNeTCy3-7DVpMTM/pub?output=csv'; // Reemplazar con el enlace real

// Archivo donde guardaremos los datos limpios para que React los lea.
const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'ofertas.json');

async function fetchAndParseCSV() {
  try {
    console.log(`Descargando datos desde: ${GOOGLE_SHEETS_CSV_URL}`);

    // Si la URL es la de ejemplo, simplemente creamos un JSON vacío o con datos de prueba
    if (GOOGLE_SHEETS_CSV_URL.includes('2PACX-1vS6y_d3W3K7n1m1x_Z8Y8Z6X7m8_z_F1C2B5Z4X5C6V7B8N9M0')) {
      console.log("Detectada URL de ejemplo. Saltando descarga y usando datos predeterminados en src/data/ofertas.json.");
      return;
    }

    const response = await fetch(GOOGLE_SHEETS_CSV_URL);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const csvText = await response.text();

    // Parser simple de CSV a JSON
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      console.warn('El CSV parece estar vacío o solo tiene los encabezados.');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    const results = [];

    // Iteramos desde la segunda línea (los datos)
    for (let i = 1; i < lines.length; i++) {
      // Expresión regular para separar por comas, ignorando comas dentro de comillas
      const rowData = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

      if (rowData && rowData.length > 0) {
        const rowObject = {};
        for (let j = 0; j < headers.length; j++) {
          if (rowData[j]) {
            rowObject[headers[j]] = rowData[j].trim().replace(/^"|"$/g, '');
          } else {
            rowObject[headers[j]] = "";
          }
        }
        // Mapeamos los campos a lo que espera nuestra ProductCard
        // (Asegúrate de que los encabezados de tu Google Sheet coincidan con esto, o ajusta las reglas)
        const product = {
          id: rowObject['id'] || rowObject['ID'] || i,
          title: rowObject['title'] || rowObject['Titulo'] || rowObject['Title'] || `Producto ${i}`,
          image: rowObject['image'] || rowObject['Imagen'] || rowObject['Image'] || 'https://via.placeholder.com/300',
          price: rowObject['price'] || rowObject['Precio'] || rowObject['Price'] || '0.00',
          originalPrice: rowObject['originalPrice'] || rowObject['Precio Original'] || rowObject['Original Price'] || null,
          rating: parseFloat(rowObject['rating'] || rowObject['Estrellas'] || rowObject['Rating'] || '5'),
          amazonUrl: rowObject['amazonUrl'] || rowObject['Enlace Afiliado'] || rowObject['Amazon URL'] || '#'
        };
        results.push(product);
      }
    }

    // Si la carpeta src/data no existe, la creamos
    const dataDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Escribimos el archivo JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`✅ ¡Éxito! ${results.length} productos actualizados y guardados en ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ Error al actualizar los datos:', error.message);
    process.exit(1); // Importante para que el despliegue falle si los datos no se pueden obtener
  }
}

fetchAndParseCSV();
