const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Génère un reçu PDF pour un paiement validé
 */
const generateReceiptPDF = async (payment) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `receipt-${payment.receiptId}.pdf`;
      const filePath = path.join(__dirname, '../../../uploads/receipts', filename);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // --- Header ---
      doc
        .fillColor('#0ea5e9') // Indigo/Blue
        .fontSize(25)
        .text('TontiPay', { align: 'center' })
        .moveDown();

      doc
        .fillColor('#444444')
        .fontSize(16)
        .text('REÇU DE PAIEMENT', { align: 'center' })
        .moveDown();

      doc
        .strokeColor('#eeeeee')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown();

      // --- Content ---
      doc.fontSize(12).fillColor('#333333');
      
      const details = [
        ['Identifiant du Reçu', payment.receiptId],
        ['Date de Paiement', new Date(payment.datePaiement).toLocaleDateString('fr-FR')],
        ['Date de Validation', new Date(payment.dateValidation).toLocaleDateString('fr-FR')],
        ['Utilisateur', `${payment.user.prenom} ${payment.user.nom}`],
        ['Téléphone', payment.user.telephone],
        ['Tontine', payment.tontine.nom],
        ['Tour de Cotisation', `Tour n°${payment.tour}`],
        ['Référence Transaction', payment.reference],
        ['Moyen de Paiement', payment.moyenPaiement],
      ];

      details.forEach(([label, value]) => {
        doc
          .font('Helvetica-Bold')
          .text(`${label} : `, { continued: true })
          .font('Helvetica')
          .text(value)
          .moveDown(0.5);
      });

      doc.moveDown();
      
      // --- Total ---
      doc
        .strokeColor('#eeeeee')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown();

      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .fillColor('#0ea5e9')
        .text(`MONTANT : ${payment.montant.toLocaleString()} FCFA`, { align: 'right' });

      // --- Footer ---
      const footerY = doc.page.height - 100;
      doc
        .fontSize(10)
        .fillColor('#999999')
        .text(
          'TontiPay - Solution d\'épargne collective sécurisée. Ce document fait office de preuve de versement.',
          50,
          footerY,
          { align: 'center', width: 500 }
        );

      doc.end();

      stream.on('finish', () => {
        resolve(`/uploads/receipts/${filename}`);
      });

      stream.on('error', (err) => {
        reject(err);
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateReceiptPDF };
