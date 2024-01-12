// generateOrdonnancePDF.js

const pdf = require('pdfkit');
const fs = require('fs');

async function generateOrdonnancePDF(ordonnanceDetails) {
    return new Promise((resolve, reject) => {
        const pdfPath = `ordonnances/ordonnance_${new Date().toISOString()}.pdf`;

        const doc = new pdf();
        const writeStream = fs.createWriteStream(pdfPath);

        writeStream.on('error', (error) => {
            console.error('Error writing to PDF stream:', error);
            reject(`Error writing to PDF stream: ${error.message}`);
        });

        doc.on('error', (error) => {
            console.error('Error during PDF document creation:', error);
            reject(`Error during PDF document creation: ${error.message}`);
        });

        doc.pipe(writeStream);


        doc.image('logo-chrsl.png', 50, 50, { width: 100 });
        doc.text(`Centre Hospitalier Regional`, 40, 110);  // Adjusted positioning
        doc.text(`L.T Colonel Mamadou Diouf`, 40, 130);
        doc.text(`Tel : +221 33 938 24 00`, 40, 150);

        // Add patient information at the top-right
        doc.font('Helvetica-Bold');
        doc.text(`Informations Patient`, { align: 'right' });
        doc.font('Helvetica'); // Reset font to default        // Add more patient information as needed
        doc.text(`Nom: ${ordonnanceDetails.nom}`, { align: 'right' });
        doc.text(`Patient: ${ordonnanceDetails.patient}`, { align: 'right' });
        doc.text(`Age: ${ordonnanceDetails.age}`, { align: 'right' });

        // Add "Ordonnance" object in the middle
        doc.font('Helvetica-Bold');
        doc.text('Ordonnance', { align: 'center', fontSize: 20, marginTop:5 });
        doc.font('Helvetica'); // Reset font to default        // Add more patient information as needed

        // Add ordonnance details

        doc.text(`${ordonnanceDetails.details}`);
        // Add more ordonnance details as needed

        doc.end();

        writeStream.on('finish', () => {
            resolve(pdfPath);
        });
    });
}

module.exports = generateOrdonnancePDF;
