const mongoose = require('mongoose');

const dossierSchema = mongoose.Schema({
    identification:{
        patient :{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Patient',
        },
        profession :{
            type:String,
        },
        numeroDossier :{
            type:String,
        }
    },
    aspectsCliniques: {
        motifConsultation: {
            type:String,
        default: null

        },
        antecedents: {
          ophtalmologiques: {
            chirurgieGlaucome:{ 
                type:String,
        default: null

            } ,
            dateGlaucome: {
                type: Date,
        default: null

            },
            chirurgieCataracte: {
                type : String,
        default: null

            } ,
            dateCataracte: {
                type: Date,
        default: null

            },
            autres:{ 
                type:String,
        default: null
            },
          },
          generaux: {
            hta:{
            type: String,
        default: null
            },
            diabete: {
                type: String,
        default: null
            },
            dysthyroidies: {
                type: String,
        default: null

            },
          },
          familiaux: {
            maladiesGenetiques:{
                type : String,
        default: null

            } ,
            typeMaladieGenetique: {
                type : String,
                default: null
            },
            glaucomes: {
                type : String,
        default: null

            },
            membresFamilleAtteints: {
                type : String,
                default: null
            },
            ametropies: {
                type : String,
        default: null

            },
          },
        },
    },
    examensCliniques:{
        avlsc: { 
            oeilDroit: {
                type: String,
        default: null

            },
             oeilGauche: {
                type: String,
        default: null

            } 
        },
      avlac: {
        oeilDroit: {
            type: String,
        default: null

        },
        oeilGauche: {
            type: String,
        default: null

        }
    },
      avp: {
        oeilDroit: {
            type: String,
        default: null

        }, 
        oeilGauche:{
            type: String,
        default: null

        }
    },
      refraction: {
         oeilDroit: {
            type: String,
        default: null

        },
       oeilGauche: {
        type: String,
        default: null

        }
     },
      skiascopie: {
         oeilDroit: {
            type: String,
        default: null

        },
       oeilGauche: {
        type: String,
        default: null

        }
     },
      annexes: {
        type: String,
        default: null

      },
    segmentAnterieur: {
        type: String,
        default: null

    },
    tonusOculaire: {
        type: String,
        default: null

    },
    fondOeil: {
        type: String,
        default: null

    },
    hypotheseDiagnostic: {
        type: String,
        default: null

},
    conduiteATenir: {
        type: String,
        default: null
    }
   },
   pachymetrie: {
    type: String, // file
    },
    echographieB: {
        type: String, //file 
        },
    biometrie: {
        type: String, // file
        },
    champVisuel: {
        type: String,  // file
    },
    retinographie: {
        type: String, // file
        },
    oct: {
        type: String, // file
        },
    radioGraphie: {
        type: String, // file
        },
    scannerOrbitaire: {
        type: String,  // file
        },
    irm: {
        type: String, // file
        },
    echographie: {
        type: String, // file
        },
  Biologie: {
    GAJ: {
        type: String, 
        default: null

    },
    Hba1c: {
        type: String,
        default: null

    },
    NFS: {
        type: String, 
        default: null

    },
    TP: {
        type: String, 
        default: null
    },
    TCK: {
        type: String, 
        default: null

    },
    creatinine: {
        type: String, 
        default: null
    },
  },
  resultats : {
    diagnosticPositif:{
        type: String,
        default: null
    },
    traitement: {
        type: String,
        default: null
    },
    evolution : {
        type: String,
        default: null
    }
  },
});

module.exports = mongoose.model('Dossier', dossierSchema);