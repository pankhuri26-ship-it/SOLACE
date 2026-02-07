const EmergencyType = Object.freeze(["Medical", "Fire", "Rescue"]);
const Protocol = Object.freeze(["ble", "wifi", "lora"]);
const Status = Object.freeze(["initiated", "verifying", "dispatched", "cancelled"]);
const isvoice=Object.freeze([true,false]);
const emergencyEvent = {
  id: "uuid",
  note: "Specific location or symptoms",
  trustScore: 80,
  createdAt: new Date()
};

validateEmergencyEvent(emergencyEvent); 
