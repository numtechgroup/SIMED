
const Doctor = require('../../models/doctor')
const Appointment = require('../../models/appointment')



exports.createAppointment = async(req, res) =>{

    try{
// Debut de verification du doctor
        const {date, time, patient, doctor} = req.body
        const doctors = await Doctor.findById(doctor)
        if (!doctors) {
            return res.status(400).json({
                message: "doctor introuvable "})
        }
//Fin de verification du doctor
//Debut de verification de la date 
        let statu = false
        for (let i = 0; i < doctors.availability.length; i++) {
            if (doctors.availability[i].date == date) {
                statu = true
            }
        }
        if (!statu) {
            return res.status(400).json({message: "Le doctor n'est pas disponible a cette date "})
        }
        // return (statu)?res.status(200).json({message: "Le doctor est dispo a cette date "}): res.status(400).json({message: "Le doctor n'est pas dispo dans cette date "})
//Fin de verification de la date dans le rendez-vous
// Debut de verification de l'heure
        statu = false
        for (let i = 0; i < doctors.availability.length; i++) {
            for (let j = 0; j <doctors.availability[i].timeslotes.length ; j++) {
                if (parseInt(doctors.availability[i].timeslotes[j].start.split(':')[0]) <= parseInt(time) && parseInt(doctors.availability[i].timeslotes[j].end.split(':')[0]) > parseInt(time)) {
                    statu = true
                }
            }  
        }
        if (!statu) {
            return res.status(404).json({message: "Le medcin n'est pas disponible a cette heure "})
        }
        // return (statu)? res.status(200).json({message: "Le medcin est disponible a cette heur"}):res.status(404).json({message: "Le medcin n'est pas dispo a cette heure "})
// Fin de verification de l'heure 

// RDV Ok 
// Enrigistrement du RDV
        
        const nbAppointments = await Appointment.countDocuments({time: time})
        let hourAppointment = ""
        if (parseInt(nbAppointments) == 0) {
            hourAppointment = time+"H-"+time+"H30"
            //return res.status(200).json({message: "Le premier qu'on doit enrigistrer"})
        }
        if (parseInt(nbAppointments) ==1) {
            hourAppointment = time+"H30-"+(parseInt(time)+1)+"H"
        }
        if (parseInt(nbAppointments) >= 2) {
            // return res.status(400).json({message: "merci"})
            return res.status(404).json({message: "L'heure choisi est deja prise par d'autre patient veuillez choisir d'autre heure de rendez-vous "})
        }
        const newppointment = new Appointment({
            date: date,
            time: time,
            patient: patient,
            doctor: doctor,
            timeAppointment: hourAppointment,
        })
        const savedAppointment = await newppointment.save()
        if (!savedAppointment) {
            return res.status(500).json({message: "Une erreure s'est produite lors de l'enrigistrement du rendez-vous "})
        }
        
        return res.status(201).json({message: "Votre rendez-vous est fixe le "+date+ " entre "+hourAppointment+" avec le doctor "+doctors.firstName+". Veuillez respecter l'heure de rendez-vous svp!!!"})

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.allAppointments = async (req, res) => {
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
}

// Supprimer un appointment via son _id 
exports.deleteAppointmentById = async (req, res) =>{
    try{
        deleteAppointment = await Appointment.findByIdAndRemove(req.params.id)
        if (!deleteAppointment) {
            res.status(404).json({message: "Rendez-vous introuvé"})
        }
        return res.status(200).json({message: "Rendez-vous supprimé avec succés !!!"})
    }catch(err){
        return res.status(500).json({message: err.message})
    }
}

exports.getAppointmentById = async (req, res)=>{
    try {
        const appointment = await Appointment.findById(req.params.id)
        if (!appointment) {
            return res.status(404).json({message: "Rendez-vous introuvé "})
        }
        return res.status(200).json(appointment)
    } catch (error) {
        
    }
}