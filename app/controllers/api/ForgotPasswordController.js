const bcrypt = require("bcryptjs");
const { success, error, validation } = require("../../helpers/responseApi");
const { randomString } = require("../../helpers/common");
const User = require("../../models/user");
const Verification = require("../../models/verificationModel");

exports.forgot = async (req, res) => {

  const { email } = req.body;

  if (!email)
    return res.status(422).json(validation([{ msg: "Votre email est requis !" }]));

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user)
      return res.status(404).json(error("Pas d'utilisateur trouvé !", res.statusCode));

    let verification = await Verification.findOne({
      userId: user._id,
      type: "Mot de passe oublié"
    });

    
    if (verification) {
      verification = await Verification.findByIdAndRemove(verification._id);
    }

    let newVerification = new Verification({
      token: randomString(50),
      userId: user._id,
      type: "Mot de passe oublié"
    });

    await newVerification.save();

    res
      .status(201)
      .json(
        success(
          "Verification mot de passe oublié envoyée !",
          { verification: newVerification },
          res.statusCode
        )
      );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Erreur Serveur Interne", res.statusCode));
  }
};

exports.reset = async(req,res) => {
    const {token , password } = req.body;

    if (!token)
    return res.status(422).json(validation([{ msg: "Le token est requis !" }]));

  if (!password)
    return res.status(422).json(validation([{ msg: "Le mot de passe est requis !" }]));

  try {
    let verification = await Verification.findOne({
      token,
      type: "Mot de passe oublié"
    });

    if (!verification)
      return res
        .status(400)
        .json(
          error("Les informations que vous avez entrés sont incorrectes !", res.statusCode)
        );

    let user = await User.findById(verification.userId);

    if (!user)
      return res.status(404).json(error("Utilisateur inexistant", res.statusCode));

    let hash = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, hash);

    // Finnaly, update the user password
    user = await User.findByIdAndUpdate(user._id, {
      password: hashedPassword
    });

    verification = await Verification.findByIdAndRemove(verification._id);

    res
      .status(200)
      .json(success("Mot de passe réinitialisé avec succès !", null, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Erreur Serveur interne", res.statusCode));
  }
};