const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
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
  const posY = 60;

  let etiquetas = '';
  for (let i = 0; i < quantidade; i++) {
    const posX = arrayX[i % etiquetasPorLinha];

    // Início de novo bloco ZPL a cada 3 etiquetas
    if (i % etiquetasPorLinha === 0) {
      if (i !== 0) {
        etiquetas += `\n^XZ`; // Fecha bloco anterior
      }
      etiquetas += `\n^XA\n^BY2`; // Inicia novo bloco
    }

    etiquetas += `\n^FO${posX},${posY}^BCN,100,Y,N,N^FD${codigo}^FS`;
  }

  etiquetas += `\n^XZ`; // Finaliza o último bloco

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor de impressão escutando em http://localhost:${PORT}`);
});
