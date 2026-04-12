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
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // --- Header Pro ---
      doc.fillColor('#0ea5e9').fontSize(20).text('TontiPay', { align: 'center' });
      doc.fontSize(10).fillColor('#666666').text('Épargne Collective & Confiance', { align: 'center' });
      doc.moveDown();

      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(30, doc.y).lineTo(doc.page.width - 30, doc.y).stroke();
      doc.moveDown();

      // --- Receipt Info ---
      doc.fillColor('#111827').fontSize(14).text(`REÇU DE PAIEMENT : ${payment.receiptId}`, { underline: true });
      doc.moveDown(0.5);

      const details = [
        ['Membre', `${payment.user.prenom} ${payment.user.nom}`],
        ['Tontine', payment.tontine.nom],
        ['Montant', `${payment.amount.toLocaleString()} FCFA`],
        ['Méthode', payment.method.toUpperCase()],
        ['Référence', payment.reference],
        ['Date de transaction', new Date(payment.createdAt).toLocaleDateString('fr-FR')],
        ['Statut', 'VALIDÉ par l\'administrateur'],
      ];

      details.forEach(([label, value]) => {
        doc.fontSize(10).fillColor('#4b5563').text(`${label}: `, { continued: true })
           .fillColor('#111827').font('Helvetica-Bold').text(value).font('Helvetica');
        doc.moveDown(0.3);
      });

      doc.moveDown();
      
      // --- Badge Validé ---
      doc.rect(doc.page.width - 120, doc.y, 90, 30).fill('#10b981');
      doc.fillColor('#ffffff').fontSize(10).text('VALIDÉ', doc.page.width - 110, doc.y + 10, { width: 70, align: 'center' });

      // --- Footer ---
      const footerY = doc.page.height - 50;
      doc.fontSize(8).fillColor('#9ca3af').text('Ceci est un document officiel généré par TontiPay. En cas de litige, veuillez contacter le support avec la référence unique.', 30, footerY, { align: 'center', width: doc.page.width - 60 });

      doc.end();

      stream.on('finish', () => resolve(`/uploads/receipts/${filename}`));
      stream.on('error', (err) => reject(err));

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateReceipt };
