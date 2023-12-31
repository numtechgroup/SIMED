const User = require('../../models/user')  
const {success, error, validation } = require('../../helpers/responseApi');
const { validationResult, body } = require('express-validator');
const Dossier = require('../../models/Dossier');
const config = require("config");
const uploadFilesMiddleware = require('../../middleware/multerMiddleware');


exports.createDossierOphtalmo = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(validation(errors.array()));
  }


  try {
   const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
    } else {
      if (user.role !== 'docteur') {
        return res.status(403).json(error("Accès non autorisé", res.statusCode));
      } else {
        // const existDossier = await Dossier.findOne({
        //   'identification.patient': req.body.identification.patient,
        // });

        // if (existDossier) {
        //   return res.status(401).json(error("Ce dossier existe déjà ! "));
        // } else {
          await uploadFilesMiddleware(req, res);

          if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "You must select at least 1 file." });
          }
      
          // Extract file links from req.files
          const fileLinks = {};
          Object.keys(req.files).forEach(key => {
            fileLinks[key] = req.files[key][0].filename;
          });      
          const nouveauDossier = await Dossier.create({
            ...req.body,
            ...fileLinks
          });

          res.status(201).json(success('Dossier médical créé avec succès', nouveauDossier));
      };
            
      }
    //}
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Erreur interne serveur", res.statusCode));
  }
};

// exports.uploadFiless = async (req, res) => {
//   try {
//     await uploadFilesMiddleware(req, res);
//     console.log(req.files);


//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.send({
//         message: "You must select at least 1 file.",
//       });
//     }

//     // Convert req.files to an array
//     const filesArray = Object.values(req.files);

//     // Extract relevant information from each file
//     const fileDetails = filesArray.map(file => ({
//       filename: file[0].filename,
//       originalname: file[0].originalname,
//       mimetype: file[0].mimetype,
//       size: file[0].size,
//     }));

//     return res.send({
//       message: "Files have been uploaded.",
//       files: fileDetails,
//     });
//   } catch (error) {
//     console.log(error);

//     return res.send({
//       message: "Error when trying upload image: ${error}",
//     });
//   }
// };

exports.getAllDossiers = async function (req, res) {
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
            const dossiers = await Dossier.find({});
            res.status(200).json(success('liste des dossiers', dossiers));
            }
        }
    }catch (err) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};

exports.getDossierById = async function (req, res) {
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
            const dossier = await Dossier.findById(req.params.id);
            if (!dossier) {
                return res.status(404).json({message: "Dossier introuvable !"})
            }
            res.status(200).json(success('Dossier', dossier));
            }
        }
    }catch (err) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};

exports.deleteDossierById = async (req, res) =>{
    try{

        const user = await User.findById(req.user.id).select("-password");
  
      if (!user)
        return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
      else{
        if(user.role != "docteur"){
            return res.status(403).json(error("Accès non autorisé", res.statusCode));
        }else{
           const deletedDossier = await Dossier.findByIdAndRemove(req.params.id);
            if (!deletedDossier) {
               return res.status(404).json({message: "Dossier introuvable !"})
            }else{
                return res.status(200).json({message: "Dossier supprimé avec succés !!!"})
            }
          }
        }
    }catch(err){
        return res.status(500).json({message: err.message})
    }
};

