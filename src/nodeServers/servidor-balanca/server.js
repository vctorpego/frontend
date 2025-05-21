// Servidor Node.js simples para balança Toledo
const express = require('express');
const { SerialPort } = require('serialport');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SERIAL_PORT = 'COM8';  // Ajuste para sua porta serial
const BAUD_RATE = parseInt('4800');

// Último peso lido
let lastWeight = null;
let lastWeightTimestamp = null;
let isProcessingRequest = false;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializando a porta serial
const serialPort = new SerialPort({
  path: SERIAL_PORT,
  baudRate: BAUD_RATE,
  dataBits: 8,
  parity: 'none',
  stopBits: 1
});

// Evento para dados recebidos
serialPort.on('data', (data) => {
  if (!isProcessingRequest) return;
  
  try {
    console.log(`Dados recebidos: ${data.toString()}`);
    
    // Processe os dados para extrair o peso
    const asciiStr = data.toString();
    const weightMatch = asciiStr.match(/(\d+[\.,]\d+)|(\d+)/);
    
    if (weightMatch) {
      const extractedWeight = parseFloat(weightMatch[0].replace(',', '.'));
      if (!isNaN(extractedWeight)) {
        lastWeight = extractedWeight;
        lastWeightTimestamp = new Date().toISOString();
        console.log(`Peso obtido: ${lastWeight}`);
        isProcessingRequest = false;
      }
    }
  } catch (error) {
    console.error('Erro ao processar dados:', error.message);
    isProcessingRequest = false;
  }
});

// Evento de erro na porta serial
serialPort.on('error', (err) => {
  console.error('Erro na porta serial:', err.message);
});

// Função para enviar comando "T" para solicitar peso
function requestWeight() {
  return new Promise((resolve, reject) => {
    if (!serialPort.isOpen) {
      return reject(new Error('Porta serial não está aberta'));
    }
    
    isProcessingRequest = true;
    const command = Buffer.from('T');
    
    serialPort.write(command, (err) => {
      if (err) {
        isProcessingRequest = false;
        console.error('Erro ao enviar comando:', err.message);
        reject(err);
        return;
      }
      
      console.log('Comando "T" enviado');
      resolve();
    });
  });
}

// Endpoint principal para obter o peso
app.get('/getPeso', async (req, res) => {
  try {
    // Resetar o peso antes de solicitar um novo
    lastWeight = null;
    
    // Enviar comando para solicitar o peso
    await requestWeight();

    // Aguardar resposta com timeout
    let timeout = 1000; // 3 segundos
    const startTime = Date.now();
    
    while (isProcessingRequest && Date.now() - startTime < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    res.json({
      peso: lastWeight,
      success: lastWeight !== null
    });
  } catch (error) {
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro ao comunicar com a balança',
      erro: error.message
    });
  }
});

// Endpoint para verificar o status do servidor
app.get('/status', (req, res) => {
  res.json({
    servidor: 'online',
    porta_serial: SERIAL_PORT,
    baud_rate: BAUD_RATE,
    conexao_balanca: serialPort.isOpen,
    ultimo_peso: lastWeight,
    ultimo_timestamp: lastWeightTimestamp
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor da balança rodando na porta ${PORT}`);
  console.log(`Conectado à porta serial ${SERIAL_PORT} a ${BAUD_RATE} baud`);
  
  // Listar portas seriais disponíveis
  SerialPort.list().then(ports => {
    console.log('Portas seriais disponíveis:');
    ports.forEach(port => {
      console.log(`  ${port.path} - ${port.manufacturer || 'Fabricante desconhecido'}`);
    });
  }).catch(err => {
    console.error('Erro ao listar portas seriais:', err);
  });
});