const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Générateur de reçu PDF professionnel
 */
const generateReceipt = async (payment) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A5', margin: 30 });
      const filename = `${payment.receiptId}.pdf`;
      const uploadDir = path.join(__dirname, '../../uploads/receipts');
      
      // Assurer l'existence du dossier
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // --- Header ---
      doc.fillColor('#0ea5e9').fontSize(20).text('TontiPay', { align: 'center' });
      doc.fontSize(10).fillColor('#666666').text('Épargne Collective & Confiance', { align: 'center' });
      doc.moveDown();

      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(30, doc.y).lineTo(doc.page.width - 30, doc.y).stroke();
      doc.moveDown();

      // --- Info ---
      doc.fillColor('#111827').fontSize(12).font('Helvetica-Bold').text(`REÇU DE PAIEMENT : ${payment.receiptId}`);
      doc.moveDown(0.5);

      const details = [
        ['Membre', `${payment.user.prenom} ${payment.user.nom}`],
        ['Tontine', payment.tontine.nom],
        ['Montant', `${payment.amount.toLocaleString()} FCFA`],
        ['Méthode', payment.method.toUpperCase()],
        ['Référence', payment.reference],
        ['Date', new Date(payment.createdAt).toLocaleDateString('fr-FR')],
        ['Statut', 'APPROUVÉ'],
      ];

      doc.font('Helvetica').fontSize(10).fillColor('#4b5563');
      details.forEach(([label, value]) => {
        doc.text(`${label}: `, { continued: true }).fillColor('#111827').text(value);
        doc.fillColor('#4b5563').moveDown(0.3);
      });

      doc.moveDown();
      
      // --- Badge Validé ---
      doc.rect(doc.page.width - 110, doc.y, 80, 25).fill('#10b981');
      doc.fillColor('#ffffff').fontSize(10).text('APPROUVÉ', doc.page.width - 105, doc.y + 8, { width: 70, align: 'center' });

      // --- Footer ---
      const footerY = doc.page.height - 50;
      doc.fontSize(8).fillColor('#9ca3af').text('Document officiel généré par TontiPay. En cas de litige, utilisez l\'ID unique de reçu.', 30, footerY, { align: 'center', width: doc.page.width - 60 });

      doc.end();

      stream.on('finish', () => resolve(`/uploads/receipts/${filename}`));
      stream.on('error', (err) => reject(err));

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateReceipt };
