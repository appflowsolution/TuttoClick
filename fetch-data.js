// fetch-data.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = '1XQoY_4MpFV0nr9Ohm1ZoSClq29pCtwrPNYlezuws8lM';
const SHEET_RANGE = 'Sheet1';
const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'ofertas.json');
const CREDENTIALS_FILE = path.join(__dirname, 'service-account.json');

async function fetchFromSheets() {
  try {
    console.log('Descargando datos desde Google Sheets...');

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'));
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_RANGE
    });

    const values = response.data.values;

    if (!values || values.length < 2) {
      console.warn('El sheet parece estar vacío o solo tiene los encabezados.');
      return;
    }

    const headers = values[0].map(h => h.toLowerCase().trim());
    const results = [];

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      if (row.length > 0 && row[0]) {
        const rowObject = {};
        for (let j = 0; j < headers.length; j++) {
          rowObject[headers[j]] = row[j] || '';
        }
        
        const active = (rowObject['active'] || '').toLowerCase().trim();
        if (active !== 'si' && active !== 'yes' && active !== 'true' && active !== '1') {
          continue;
        }
        
        const rawUrl = rowObject['url'] || rowObject['amazonurl'] || rowObject['enlace afiliado'] || '';
        let detectedPlatform = rowObject['plataform'] || rowObject['platform'] || '';

        if (!detectedPlatform || detectedPlatform.toLowerCase() === 'amazon') {
          if (rawUrl.includes('target.com')) detectedPlatform = 'Target';
          else if (rawUrl.includes('walmart.com')) detectedPlatform = 'Walmart';
          else if (rawUrl.includes('bestbuy.com')) detectedPlatform = 'BestBuy';
          else if (rawUrl.includes('ebay.com')) detectedPlatform = 'eBay';
          else detectedPlatform = 'Amazon';
        }

        const product = {
          id: rowObject['id'] || String(i),
          title: rowObject['title'] || `Producto ${i}`,
          image: rowObject['image'] || 'https://via.placeholder.com/300',
          price: rowObject['price'] || '0.00',
          originalPrice: rowObject['originalprice'] || rowObject['precio original'] || null,
          rating: parseFloat(rowObject['rating'] || rowObject['estrellas'] || '5'),
          amazonUrl: rawUrl || '#',
          platform: detectedPlatform,
          category: rowObject['category'] || rowObject['categoria'] || 'General'
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

fetchFromSheets();
