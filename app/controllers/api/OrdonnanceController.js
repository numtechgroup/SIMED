// ordonnanceController.js


const generateOrdonnancePDF = require("../../helpers/pdf");
exports.generateOrdonnance = async (req, res) => {
    try {
        // Assuming you retrieve the ordonnance details from the request or database
        const ordonnanceDetails = {
            nom : req.body.nom,
            age: req.body.age,
            patient: req.body.patient, // Adjust this based on your setup
            details: req.body.details,
        };

        // Generate the PDF
        const pdfPath = await generateOrdonnancePDF(ordonnanceDetails);

        // Send the generated PDF as a response
        res.download(pdfPath, `ordonnance_${new Date().toISOString()}.pdf`);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
