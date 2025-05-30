const express = require('express');
const cors = require('cors'); // Importa o pacote CORS
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();

// Habilita o CORS para todas as origens (ou configure abaixo para um domínio específico)
app.use(cors());

// Se quiser permitir apenas um domínio específico, use:
// app.use(cors({ origin: 'http://localhost:5173' }));

app.use(bodyParser.json());

// Nome da impressora no Windows
const nomeImpressora = 'Generic / Text Only';

app.post('/imprimir', (req, res) => {
  const { codigo, quantidade } = req.body;

  if (!codigo || !quantidade || isNaN(quantidade)) {
    return res.status(400).json({ erro: 'Código ou quantidade inválida.' });
  }

  const etiquetasPorLinha = 3;
  const arrayX = [50, 330, 610];
  const alturaEtiqueta = 150; // Espaçamento vertical entre linhas
  const baseY = 60;

  let etiquetas = '\n^XA\n^BY2'; // Início do único bloco ZPL

  for (let i = 0; i < quantidade; i++) {
    const posX = arrayX[i % etiquetasPorLinha];
    const linhaAtual = Math.floor(i / etiquetasPorLinha);
    const posY = baseY + (linhaAtual * alturaEtiqueta);

    etiquetas += `\n^FO${posX},${posY}^BCN,100,Y,N,N^FD${codigo}^FS`;
  }

  etiquetas += '\n^XZ'; // Final do bloco

  console.log(etiquetas); // Debug

  const zplPath = path.join(__dirname, 'etiqueta.zpl');
  fs.writeFileSync(zplPath, etiquetas.trim());

  const comando = `powershell -Command "Get-Content -Path '${zplPath}' | Out-Printer -Name '${nomeImpressora}'"`;

  exec(comando, (error, stdout, stderr) => {
    if (error) {
      console.error('Erro ao imprimir:', stderr || error);
      return res.status(500).json({ erro: 'Falha ao enviar para impressão.' });
    }

    return res.status(200).json({ mensagem: 'Etiqueta(s) enviada(s) para impressão.' });
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Servidor de impressão escutando em http://localhost:${PORT}`);
});
