document.addEventListener("DOMContentLoaded", function () {
    const symptomInput = document.getElementById("symptom-input");
    const checkDiseaseBtn = document.getElementById("check-disease-btn");
    const diseaseResult = document.getElementById("disease-result");

    // Hardcoded symptom-to-disease mapping
    const symptomToDisease = {
        "fever": "Flu, COVID-19, Malaria",
        "cough": "Common Cold, Bronchitis, COVID-19",
        "headache": "Migraine, Stress, Hypertension",
        "fatigue": "Anemia, Thyroid Disorder, Diabetes",
        "nausea": "Food Poisoning, Motion Sickness, Stomach Flu",
        "diarrhea": "Food Poisoning, IBS, Cholera",
        "shortness of breath": "Asthma, Pneumonia, Heart Disease",
        "chest pain": "Heart Attack, Acid Reflux, Pneumonia",
        "sore throat": "Strep Throat, Cold, Tonsillitis",
        "dizziness": "Low Blood Pressure, Dehydration, Anemia",
        "skin rash": "Allergic Reaction, Eczema, Measles",
        "abdominal pain": "Appendicitis, Ulcer, IBS",
        "joint pain": "Arthritis, Gout, Lyme Disease",
        "runny nose": "Cold, Allergy, Sinusitis",
        "constipation": "IBS, Dehydration, Thyroid Issues",
        "vomiting": "Food Poisoning, Gastroenteritis, Pregnancy",
        "blurry vision": "Diabetes, Eye Infection, Migraine",
        "ear pain": "Ear Infection, Sinus Infection, TMJ Disorder",
        "night sweats": "Tuberculosis, Menopause, Anxiety",
        "weight loss": "Cancer, Hyperthyroidism, Diabetes",
        "weight gain": "Hypothyroidism, PCOS, Cushing's Syndrome",
        "back pain": "Muscle Strain, Herniated Disc, Kidney Stones",
        "frequent urination": "Diabetes, UTI, Kidney Disease",
        "cold hands and feet": "Raynaud's Disease, Poor Circulation, Anemia",
        "high fever": "Typhoid, Dengue, Malaria",
        "persistent cough": "Tuberculosis, Lung Cancer, COPD",
        "hair loss": "Alopecia, Thyroid Disorder, Nutrient Deficiency",
        "difficulty swallowing": "GERD, Throat Cancer, Esophagitis",
        "yellowing of skin": "Jaundice, Hepatitis, Liver Disease",
        "muscle weakness": "Multiple Sclerosis, Myasthenia Gravis, Muscular Dystrophy"
    };

    // Function to check disease
    checkDiseaseBtn.addEventListener("click", function () {
        const symptom = symptomInput.value.trim().toLowerCase();

        if (symptom === "") {
            diseaseResult.textContent = "Please enter a symptom.";
            diseaseResult.style.color = "red";
            return;
        }

        if (symptomToDisease[symptom]) {
            diseaseResult.textContent = `Possible diseases: ${symptomToDisease[symptom]}`;
            diseaseResult.style.color = "green";
        } else {
            diseaseResult.textContent = "Symptom not found. Please consult a doctor.";
            diseaseResult.style.color = "red";
        }
    });
});
