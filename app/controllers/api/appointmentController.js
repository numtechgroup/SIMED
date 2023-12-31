const Disponibility = require('../../models/disponibility')
const User = require('../../models/user')  
const Appointment = require('../../models/appointment');
const { validation, error, success } = require('../../helpers/responseApi');
const { validationResult } = require('express-validator');


exports.createAppointment = async(req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
      return res.status(422).json(validation(errors.array()));

    let user;
    try{
        const {date, doctorId, timeAppointment} = req.body;

        if (!doctorId) {
            return res.status(400).json(error("L'ID du docteur est requis pour créer un rendez-vous"));
        }

        const doctor = await User.findById(doctorId);
        console.log('doc',doctor);
        if (doctor.role != 'docteur') {
            return res.status(400).json(error("Cet utilisateur n'est pas un docteur"));
        }

        if (!doctor) {
            return res.status(400).json(error("Ce docteur est introuvable"));
        }

        const dispo = await Disponibility.find({doctor:doctorId,
            start: { $gte: new Date(date) },
            end: { $lt: new Date(date).setDate(new Date(date).getDate() + 1) }
        });
        console.log('dispos', dispo);

        if (dispo.length === 0) {
            return res.status(400).json(error("Il n'y a pas de RV disponible pour ce docteur", res.statusCode));
        }

        // Check if the provided date matches the available date
        const dispoStartDate = new Date(dispo[0].start);
        console.log('dispo date',dispoStartDate);
        const requestDate = new Date(date);
        console.log('request date',requestDate);

        const formattedDispoStartDate = dispoStartDate.toISOString().split('T')[0];
        console.log('formattedDispoStartDate', formattedDispoStartDate);
        const formattedRequestDate = requestDate.toISOString().split('T')[0];
        console.log('formattedRequestDate', formattedRequestDate);

        if (formattedDispoStartDate !== formattedRequestDate) {
            return res.status(400).json(error("Le docteur n'est pas disponible à cette date", res.statusCode));
        }

        const appointment = await Appointment.findOne({date:formattedRequestDate, doctorId: doctorId});

        if(appointment){
            return res.status(400).json(error("Vous avez deja programmé un RV pour ce jour !", res.statusCode));
        }
        
        const startTime = new Date(dispo[0].start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const endTime = new Date(dispo[0].end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });


        if(timeAppointment < startTime || timeAppointment > endTime)
            return res.status(404).json(error("Le médecin n'est pas disponible à cet heure, choisssez entre "+ startTime+" et "+endTime));
        
        user = await User.findById(req.user.id).select("-password");
        if (!user)
        return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
      else{
        if(user.role != "patient"){
            return res.status(403).json(error("Accès non autorisé, vous n'etes pas patient", res.statusCode));
        }else{
            let newppointment = new Appointment({
                date: date,
                patient: user,
                doctorId: doctorId,
                timeAppointment: timeAppointment,
            });
            await newppointment.save();
            return res.status(200).json(
                success("Votre rendez-vous est fixe le "+date+ " à "+ timeAppointment +" avec le docteur "+doctor.prenom+ " " +doctor.nom +". Veuillez respecter l'heure de rendez-vous svp!!!", 
                { newppointment }, res.statusCode
            ));
        }
    }
    }catch(err){
        console.error(err.message);
        res.status(500).json(error("Erreur interne serveur", res.statusCode));
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "Aucun rendez-vous trouvé." });
        }

        return res.status(200).json(appointments);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

exports.deleteAppointmentById = async (req, res) =>{
    try{

        const user = await User.findById(req.user.id).select("-password");
  
      if (!user)
        return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
      else{
        if(user.role != "patient"){
            return res.status(403).json(error("Accès non autorisé", res.statusCode));
        }else{
           const deleteAppointment = await Appointment.findByIdAndRemove(req.params.id);
            if (!deleteAppointment) {
                res.status(404).json({message: "Rendez-vous introuvé"})
            }
            return res.status(200).json({message: "Rendez-vous supprimé avec succés !!!"})
          }
        }
    }catch(err){
        return res.status(500).json({message: err.message})
    }
};

exports.getAppointmentById = async (req, res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");
  
      if (!user)
        return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
      else{
        if(user.role != "patient"){
            return res.status(403).json(error("Accès non autorisé", res.statusCode));
        }else{
            const appointment = await Appointment.findById(req.params.id)
        if (!appointment) {
            return res.status(404).json({message: "Rendez-vous non trouvé "})
        }
        return res.status(200).json(appointment)
        }
      }
    } catch (error) {
        
    }
};