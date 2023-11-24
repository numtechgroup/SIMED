const bcrypt = require("bcryptjs");
const { success, error, validation } = require("../../helpers/responseApi");
const User = require("../../models/user");
const { sendPasswordResetEmail } = require("../../helpers/sendPasswordResetEmail");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require("config");



exports.forgot = async (req, res) => {
  const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(422).json(validation(errors.array()));

      const {email } = req.body;

      if (!email) return res.status( 404 ).json(validation({msg: "Veuillez fournir un email svp !"}));

      try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(validation({ msg: "Utilisateur non trouvé." }));
        }

        const token = jwt.sign({ email }, config.get("jwtSecret"), { expiresIn: "1h" });

        // Send the reset link to the user's email
        const resetLink = `${config.get("frontendUrl")}/reset-password?token=${token}`;
        await sendPasswordResetEmail(user.email, resetLink);

        return res.status(200).json(success("Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail."));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(error("Erreur interne serveur", res.statusCode));
      }
};

exports.reset = async(req,res) => {
    const {email, password , new_password } = req.body;

  if (!password)
    return res.status(422).json(validation([{ msg: "Le mot de passe est requis !" }]));

  if (!new_password) return res.status(422).json(validation([{ msg: "Le mot de passe est requis !" }]));

  if(password != new_password) return res.status(422).json(error([{ msg: "Les mots de passe ne correspondent pas " }]));
  try {

    let user = await User.findOne({email});

    if (!user)
      return res.status(404).json(error("Utilisateur inexistant", res.statusCode));

    let hash = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, hash);

    user = await User.findByIdAndUpdate(user._id, {
      password: hashedPassword
    });
    res
      .status(200)
      .json(success("Mot de passe réinitialisé avec succès !", null, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Erreur Serveur interne", res.statusCode));
  }
};