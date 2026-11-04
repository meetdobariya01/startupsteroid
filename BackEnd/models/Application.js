const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: String,
    storedName: String,
    path: String,
    size: Number,
    mimetype: String,
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Encrypted fields
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    linkedin: { type: String, required: true },
    companyTitle: { type: String, required: true },

    companyName: { type: String, required: true },
    website: { type: String, required: true },
    industry: { type: String, required: true },
    developmentStage: { type: String, required: true },
    businessModel: { type: String, required: true },
    country: { type: String, required: true },

    fundingType: { type: String, required: true },
    preMoneyValuation: { type: String, required: true },
    targetRaise: { type: String, required: true },
    annualRevenue: { type: String, required: true },
    offeringType: { type: String, required: true },

    description: { type: String, required: true },
    companyDescription: { type: String, required: true },
    productDescription: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "reviewing", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    pitchDeck: [fileSchema],
  },
  { timestamps: true }
);

// (No async hooks needed here — encryption happens in the controller)

module.exports = mongoose.model("Application", applicationSchema);