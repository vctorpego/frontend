const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa o pacote CORS
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();

app.use(cors());

// Configuração do CORS para permitir requisições do frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configurações da impressora
const PRINTER_NAME = 'Generic / Text Only'; // Substitua pelo nome exato da sua impressora no Windows
const PORT = 3002;

/**
 * Gera o código ZPL para as etiquetas
 * @param {string} codigo - Código do produto para o código de barras
 * @param {number} quantidade - Quantidade de etiquetas a gerar
 * @returns {string} Código ZPL pronto para impressão
 */
function gerarCodigoZPL(codigo, quantidade) {
  const ETIQUETAS_POR_LINHA = 3;
  const POSICOES_X = [50, 330, 610]; // Posições horizontais das etiquetas
  const POSICAO_Y = 60; // Posição vertical fixa

  let zpl = '';

  for (let i = 0; i < quantidade; i++) {
    const posX = POSICOES_X[i % ETIQUETAS_POR_LINHA];

    // Inicia novo bloco ZPL a cada 3 etiquetas
    if (i % ETIQUETAS_POR_LINHA === 0) {
      if (i !== 0) zpl += '^XZ\n'; // Fecha bloco anterior
      zpl += '^XA\n^BY1\n'; // Inicia novo bloco com configurações
    }

    // Adiciona código de barras
    zpl += `^FO${posX},${POSICAO_Y}^BCN,100,Y,N,N^FD${codigo}^FS\n`;
  }

  return zpl + '^XZ'; // Fecha o último bloco
}

/**
 * Rota para impressão de etiquetas
 */
app.post('/imprimir', (req, res) => {
  console.log('Recebendo requisição:', req.body); // Log para debug

  try {
    const { codigo, quantidade } = req.body;

    // Validação dos dados
    if (!codigo || !quantidade || isNaN(quantidade)) {
      console.error('Dados inválidos recebidos:', { codigo, quantidade });
      return res.status(400).json({
        success: false,
        error: 'Por favor, forneça um código válido e a quantidade de etiquetas'
      });
    }

    // Gera o código ZPL
    const zpl = gerarCodigoZPL(codigo, quantidade);
    console.log('Código ZPL gerado:\n', zpl);

    // Cria arquivo temporário
    const arquivoTemp = path.join(__dirname, 'etiqueta_temp.zpl');
    fs.writeFileSync(arquivoTemp, zpl);

    // Comando para imprimir no Windows
    const comando = `powershell -Command "Get-Content -Path '${arquivoTemp}' | Out-Printer -Name '${PRINTER_NAME}'"`;

    // Executa o comando de impressão
    exec(comando, (error, stdout, stderr) => {
      // Remove o arquivo temporário após impressão
      try {
        fs.unlinkSync(arquivoTemp);
      } catch (err) {
        console.error('Erro ao remover arquivo temporário:', err);
      }

      if (error) {
        console.error('Erro na impressão:', error.message);
        return res.status(500).json({
          success: false,
          error: 'Falha ao enviar para a impressora. Verifique a conexão.'
        });
      }

      console.log('Etiquetas impressas com sucesso!');
      res.json({
        success: true,
        message: `${quantidade} etiqueta(s) enviada(s) para impressão com sucesso!`
      });
    });

  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno no servidor'
    });
  }
});

// Rota de teste para verificar se o servidor está online
app.get('/imprimir', (req, res) => {
  res.json({
    status: 'online',
    message: 'Servidor de impressão está funcionando',
    printer: PRINTER_NAME
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`\nServidor de impressão rodando na porta ${PORT}`);
  console.log(`Impressora configurada: ${PRINTER_NAME}`);
  console.log(`Teste o servidor acessando: http://localhost:${PORT}\n`);
});
