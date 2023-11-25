const bcrypt = require("bcryptjs");
const { success, error, validation } = require("../../helpers/responseApi");
const User = require("../../models/user");
const { sendPasswordResetEmail } = require("../../helpers/sendPasswordResetEmail");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require("config");
const crypto = require('crypto');


var tokenpassword;
var verificationCode;

exports.forgot = async (req, res) => {
  const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(422).json(validation(errors.array()));

      const { email } = req.body;

      try {
        const user = await User.findOne({ email: email });

        if (!email) return res.status( 404 ).json(validation({msg: "Veuillez fournir un email svp !"}));

        if (!user) {
            return res.status(404).json(validation({ msg: "Utilisateur non trouvé." }));
        }
        verificationCode = crypto.randomBytes(7).toString('hex').toUpperCase();

        user.verificationCode = verificationCode;
        await user.save();
        console.log('user code',user.verificationCode);

        tokenpassword = jwt.sign({ email, verificationCode  }, config.get("jwtSecret"), { expiresIn: "1h" });


        console.log(verificationCode);

        const resetLink = `${config.get("frontendUrl")}/#/reset-password?token=${tokenpassword}`;
        await sendPasswordResetEmail(user.email, resetLink, verificationCode);

        return res.status(200).json(success("Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail.", tokenpassword, verificationCode));
    } catch (err) {
        console.error(err.message); 
        res.status(500).json(error("Erreur interne serveur", res.statusCode));
      }
};

exports.reset = async (req, res) => {

  const { verificationCode, new_password } = req.body;

  if (!verificationCode || !new_password) {
    return res
      .status(422)
      .json(validation([{ msg: "Le code de vérification et le nouveau mot de passe sont requis !" }]));
  }

  try {

    const decoded = jwt.verify(tokenpassword, config.get("jwtSecret"));
    console.log('decoded',JSON.stringify(decoded.email));

    if (!decoded) { 
      return res.status(404).json(error("Utilisateur inexistant", res.statusCode));
    }

    const user = await User.findOne({ email: decoded.email });
    console.log(user);

    if (!user) {
      return res.status(400).json(validation({ msg: "Code de vérification invalide." }));
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json(validation({ msg: "Les codes ne correspondent pas, verifier votre mail" }));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    user.password = hashedPassword;
    user.verificationCode = null;
    await user.save();

    return res
      .status(200)
      .json(success("Mot de passe réinitialisé avec succès !", null, res.statusCode, user.token));
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json(error("Token invalide ou expiré", res.statusCode));
    }
    console.error(err.message);
    return res.status(500).json(error("Erreur Serveur interne", res.statusCode));
  }
};
