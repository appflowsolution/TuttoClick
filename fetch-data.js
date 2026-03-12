// fetch-data.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ¡IMPORTANTE! Reemplaza este enlace con el enlace CSV público de TU hoja de Google Sheets.
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTzjgw5ZW7HysdQVgNSLbJ3XWcu25PHdr4u0k4q0UBXnwlnJs0L-fvEMOFlnVjE_xNeTCy3-7DVpMTM/pub?output=csv';

const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'ofertas.json');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

async function fetchAndParseCSV() {
  try {
    console.log(`Descargando datos desde: ${GOOGLE_SHEETS_CSV_URL}`);

    const response = await fetch(GOOGLE_SHEETS_CSV_URL);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const csvText = await response.text();
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      console.warn('El CSV parece estar vacío o solo tiene los encabezados.');
      return;
    }

    const headers = parseCSVLine(lines[0]).map(h => h.trim());
    const results = [];

    for (let i = 1; i < lines.length; i++) {
      const rowData = parseCSVLine(lines[i]);
      
      if (rowData.length > 0 && rowData[0]) {
        const rowObject = {};
        for (let j = 0; j < headers.length; j++) {
          rowObject[headers[j]] = rowData[j] || '';
        }
        
        const rawUrl = rowObject['amazonUrl'] || rowObject['Enlace Afiliado'] || rowObject['Amazon URL'] || '';
        let detectedPlatform = rowObject['platform'] || rowObject['Plataforma'] || '';

        // Detección automática de plataforma basada en la URL si no está especificada o es Amazon por defecto
        if (!detectedPlatform || detectedPlatform.toLowerCase() === 'amazon') {
          if (rawUrl.includes('target.com')) detectedPlatform = 'Target';
          else if (rawUrl.includes('walmart.com')) detectedPlatform = 'Walmart';
          else if (rawUrl.includes('bestbuy.com')) detectedPlatform = 'BestBuy';
          else if (rawUrl.includes('ebay.com')) detectedPlatform = 'eBay';
          else detectedPlatform = 'Amazon';
        }

        const product = {
          id: rowObject['id'] || rowObject['ID'] || String(i),
          title: rowObject['title'] || rowObject['Titulo'] || rowObject['Title'] || `Producto ${i}`,
          image: rowObject['image'] || rowObject['Imagen'] || rowObject['Image'] || 'https://via.placeholder.com/300',
          price: rowObject['price'] || rowObject['Precio'] || rowObject['Price'] || '0.00',
          originalPrice: rowObject['originalPrice'] || rowObject['Precio Original'] || rowObject['Original Price'] || null,
          rating: parseFloat(rowObject['rating'] || rowObject['Estrellas'] || rowObject['Rating'] || '5'),
          amazonUrl: rawUrl || '#',
          platform: detectedPlatform,
          category: rowObject['category'] || rowObject['Categoria'] || rowObject['Category'] || 'General'
        };
        results.push(product);
      }
    }

    const dataDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`✅ ¡Éxito! ${results.length} productos actualizados y guardados en ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ Error al actualizar los datos:', error.message);
    process.exit(1);
  }
}

fetchAndParseCSV();
