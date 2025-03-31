document.addEventListener("DOMContentLoaded", function () {
    const diseaseInput = document.getElementById("disease-input");
    const checkMedicineBtn = document.getElementById("check-medicine-btn");
    const medicineResult = document.getElementById("medicine-result");

    // Hardcoded disease-to-medicine mapping
    const diseaseToMedicine = {
        "flu": { medicine: "Paracetamol", dosage: "500mg every 6 hours" },
        "cold": { medicine: "Antihistamines", dosage: "10mg daily" },
        "fever": { medicine: "Ibuprofen", dosage: "400mg every 8 hours" },
        "cough": { medicine: "Dextromethorphan", dosage: "10ml every 6 hours" },
        "headache": { medicine: "Aspirin", dosage: "300mg every 6 hours" },
        "hypertension": { medicine: "Amlodipine", dosage: "5mg once daily" },
        "diabetes": { medicine: "Metformin", dosage: "500mg twice daily" },
        "asthma": { medicine: "Salbutamol", dosage: "2 puffs every 4 hours" },
        "pneumonia": { medicine: "Amoxicillin", dosage: "500mg three times daily" },
        "stomach ulcer": { medicine: "Omeprazole", dosage: "20mg once daily" },
        "food poisoning": { medicine: "ORS + Loperamide", dosage: "10ml every 6 hours" },
        "arthritis": { medicine: "Naproxen", dosage: "250mg twice daily" },
        "migraine": { medicine: "Sumatriptan", dosage: "50mg as needed" },
        "bronchitis": { medicine: "Azithromycin", dosage: "500mg once daily for 3 days" },
        "sinusitis": { medicine: "Pseudoephedrine", dosage: "60mg twice daily" },
        "allergies": { medicine: "Loratadine", dosage: "10mg once daily" },
        "anemia": { medicine: "Iron Supplements", dosage: "325mg daily" },
        "dengue": { medicine: "Paracetamol", dosage: "500mg every 6 hours" },
        "typhoid": { medicine: "Ciprofloxacin", dosage: "500mg twice daily for 7 days" },
        "cholera": { medicine: "ORS", dosage: "As needed for dehydration" },
        "urinary tract infection": { medicine: "Nitrofurantoin", dosage: "100mg twice daily for 5 days" },
        "tonsillitis": { medicine: "Penicillin V", dosage: "500mg every 6 hours" },
        "jaundice": { medicine: "Liver Supplements", dosage: "As directed by doctor" },
        "hypothyroidism": { medicine: "Levothyroxine", dosage: "50mcg once daily" },
        "hyperthyroidism": { medicine: "Methimazole", dosage: "5mg three times daily" },
        "eczema": { medicine: "Hydrocortisone Cream", dosage: "Apply twice daily" },
        "psoriasis": { medicine: "Calcipotriol", dosage: "Apply once daily" },
        "depression": { medicine: "Sertraline", dosage: "50mg once daily" },
        "anxiety": { medicine: "Alprazolam", dosage: "0.5mg as needed" },
        "insomnia": { medicine: "Melatonin", dosage: "5mg before bedtime" }
    };

    // Function to check medicine
    checkMedicineBtn.addEventListener("click", function () {
        const disease = diseaseInput.value.trim().toLowerCase();

        if (disease === "") {
            medicineResult.textContent = "Please enter a disease.";
            medicineResult.style.color = "red";
            return;
        }

        if (diseaseToMedicine[disease]) {
            medicineResult.textContent = `Recommended Medicine: ${diseaseToMedicine[disease].medicine}  | Dosage: ${diseaseToMedicine[disease].dosage}`;
            medicineResult.style.color = "green";
        } else {
            medicineResult.textContent = "Disease not found. Please consult a doctor.";
            medicineResult.style.color = "red";
        }
    });
});
