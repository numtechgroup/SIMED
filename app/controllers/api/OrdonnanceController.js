const Ordonnance = require('../../models/Ordonnance');
const generateOrdonnancePDF = require("../../helpers/pdf");
const {validationResult} = require("express-validator");
const {validation, error, success} = require("../../helpers/responseApi");
const User = require("../../models/user");


exports.generateOrdonnance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        const {nomOrdonnance, patient, details} = req.body;
        if (!user)
            return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
        else {
            if (user.role !== "docteur") {
                return res.status(403).json(error("Accès non autorisé", res.statusCode));
            } else {
                const ordonnanceDetails = {
                    nom: '.............',
                    age: '................',
                    patient: req.body.patient,
                    details: req.body.details,
                };
                const pdfPath = await generateOrdonnancePDF(ordonnanceDetails);

                let ordonnance = new Ordonnance({
                    nomOrdonnance: nomOrdonnance,
                    patient: patient,
                    details: details,
                    doctor: user
                });

                await ordonnance.save();
                // Send the generated PDF as a response
                res.download(pdfPath, `ordonnance_${new Date().toISOString()}.pdf`);

                res.status(201).json(success('Ordonnance crée avec succès', ordonnance));
            }
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.downloadOrdonnance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
        }

        const ordonnance = await Ordonnance.findById(req.params.id);

        if (!ordonnance) {
            return res.status(404).json(error("Ordonnance non trouvée", res.statusCode));
        }

        if (user.role !== "docteur" || ordonnance.doctor.toString() !== user._id.toString()) {
            return res.status(403).json(error("Accès non autorisé", res.statusCode));
        }

        const ordonnanceDetails = {
            nom: '.............',
            age: '................',
            patient: ordonnance.patient,
            details: ordonnance.details,
        };

        const pdfPath = await generateOrdonnancePDF(ordonnanceDetails);

        res.download(pdfPath, `ordonnance_${new Date().toISOString()}.pdf`);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllOrdonnances = async function (req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(422).json(validation(errors.array()));
    try{
        const user = await User.findById(req.user.id).select("-password");

        if (!user)
            return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
        else{
            if(user.role != "docteur"){
                return res.status(403).json(error("Accès non autorisé", res.statusCode));
            }else{
                const ordonnances = await Ordonnance.find({doctor:user});
                res.status(200).json(success('liste des ordonnances', ordonnances));
            }
        }
    }catch (err) {
        console.error(err.message);
        res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};

exports.getOrdonnanceById = async function (req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(422).json(validation(errors.array()));
    try{
        const user = await User.findById(req.user.id).select("-password");

        if (!user)
            return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
        else{
            if(user.role !== "docteur"){
                return res.status(403).json(error("Accès non autorisé", res.statusCode));
            }else{
                const ordonnance = await Ordonnance.findById(req.params.id);
                if (!ordonnance) {
                    return res.status(404).json({message: "Ordonnance introuvable !"})
                }
                res.status(200).json(ordonnance);
            }
        }
    }catch (err) {
        console.error(err.message);
        res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};

exports.deleteOrdonnanceById = async (req, res) =>{
    try{

        const user = await User.findById(req.user.id).select("-password");

        if (!user)
            return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
        else{
            if(user.role != "docteur"){
                return res.status(403).json(error("Accès non autorisé", res.statusCode));
            }else{
                const deletedOrdonnance = await Ordonnance.findByIdAndRemove(req.params.id);
                if (!deletedOrdonnance) {
                    return res.status(404).json({message: "Ordonnance introuvable !"})
                }else{
                    return res.status(200).json({message: "Ordonnance supprimée avec succès !!!"})
                }
            }
        }
    }catch(err){
        console.error(err.message);
        res.status(500).json(error("Erreur serveur interne", res.statusCode));    }
};
