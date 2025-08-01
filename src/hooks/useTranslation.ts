
const translations = {
  en: {
    // Header and Navigation
    aiHealthCompanion: "Your AI Health Companion",
    dashboard: "Dashboard",
    symptomChecker: "Symptom Checker",
    emergency: "Emergency",
    mentalHealth: "Mental Health",
    dietTracker: "Diet Tracker",
    weeklyReport: "Weekly Report",
    alerting: "Alerting...",
    
    // Health Stats
    healthScore: "Health Score",
    lastCheckup: "Last Checkup",
    riskLevel: "Risk Level",
    alerts: "Alerts",
    low: "Low",
    daysAgo: (days: string) => `${days} days ago`,
    hoursAgo: (hours: string) => `${hours} hours ago`,
    activeAlerts: (count: string) => `${count} Active`,
    
    // Quick Actions
    quickHealthActions: "Quick Health Actions",
    checkSymptoms: "Check Symptoms",
    emergencyProfile: "Emergency Profile",
    
    // Recent Activity
    recentHealthActivity: "Recent Health Activity",
    symptomCheckCompleted: "Symptom Check Completed",
    mildHeadacheLowRisk: "Mild headache - Low risk",
    healthReportGenerated: "Health Report Generated",
    weeklySummaryAvailable: "Weekly summary available",
    dietGoalAchieved: "Diet Goal Achieved",
    dailyCalorieTargetMet: "Daily calorie target met",
    yesterday: "Yesterday",
    
    // Emergency
    emergencyActivated: "Emergency Alert Activated! Contacting emergency services...",
    emergencyContacted: "Emergency contacts notified. Help is on the way!",
    
    // Diet Tracker
    dietManagement: "Diet Management",
    dietDescription: "Get personalized diet recommendations and track your meals",
    dietRecommendations: "Diet Recommendations",
    foodTracker: "Food Tracker",
    waterIntake: "Water Intake",
    selectCondition: "Select Your Condition",
    recommendedFoods: "Recommended Foods",
    foodsToAvoid: "Foods to Avoid",
    dietTips: "Diet Tips for",
    totalCalories: "Total Calories",
    mealsLogged: "Meals Logged",
    lastEntry: "Last Entry",
    addFoodEntry: "Add Food Entry",
    foodName: "Food Name",
    calories: "Calories",
    mealType: "Meal Type",
    protein: "Protein (g)",
    carbs: "Carbs (g)",
    fat: "Fat (g)",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
    addWater: "Add Water",
    waterGoal: "Water Goal",
    glassesOfWater: "glasses of water",
    dailyWaterGoal: "Daily water goal reached!",
    
    // Weekly Report
    weeklyHealthReport: "Weekly Health Report",
    reportDescription: "Your comprehensive health summary for this week",
    overallHealth: "Overall Health",
    improvement: "Improvement",
    healthTrends: "Health Trends",
    recommendations: "Recommendations",
    goodProgress: "Good progress this week!",
    keepUpGoodWork: "Keep up the good work with your health goals.",
    increaseWaterIntake: "Try to increase your daily water intake",
    maintainRegularMeals: "Maintain regular meal times",
    getRegularExercise: "Get at least 30 minutes of exercise daily",
    
    // Dashboard Feature Summaries
    featureSummaries: "Feature Summaries",
    symptomCheckerSummary: "AI-powered analysis of symptoms with 94% accuracy for early health detection",
    mentalHealthSummary: "Daily mood tracking with personalized support and professional resources",
    dietTrackerSummary: "Smart nutrition tracking with meal timing suggestions and calorie management", 
    vaccineSchedulerSummary: "Personalized vaccination reminders and schedule management",
    lastUsed: "Last Used",
    accuracy: "Accuracy",
    moodToday: "Mood Today",
    good: "Good",
    streak: "Streak",
    days: "days",
    todaysCalories: "Today's Calories",
    onTrack: "On Track",
    nextDue: "Next Due",
    upToDate: "Up to Date",
    vaccineReminderSet: "Vaccine Reminder Set",
    covidBoosterDue: "COVID-19 booster due in 5 days",
    today: "Today",
    airQualityAlert: "Air Quality Alert",
    highPollutionDetected: "High pollution detected in your area",
    vaccineScheduler: "Vaccine Scheduler",
  },
  
  hi: {
    // Header and Navigation
    aiHealthCompanion: "आपका AI स्वास्थ्य साथी",
    dashboard: "डैशबोर्ड",
    symptomChecker: "लक्षण जांचकर्ता",
    emergency: "आपातकाल",
    mentalHealth: "मानसिक स्वास्थ्य",
    dietTracker: "आहार ट्रैकर",
    weeklyReport: "साप्ताहिक रिपोर्ट",
    alerting: "अलर्ट कर रहे हैं...",
    
    // Health Stats
    healthScore: "स्वास्थ्य स्कोर",
    lastCheckup: "अंतिम जांच",
    riskLevel: "जोखिम स्तर",
    alerts: "अलर्ट",
    low: "कम",
    daysAgo: (days: string) => `${days} दिन पहले`,
    hoursAgo: (hours: string) => `${hours} घंटे पहले`,
    activeAlerts: (count: string) => `${count} सक्रिय`,
    
    // Quick Actions
    quickHealthActions: "त्वरित स्वास्थ्य कार्य",
    checkSymptoms: "लक्षण जांचें",
    emergencyProfile: "आपातकालीन प्रोफ़ाइल",
    
    // Recent Activity
    recentHealthActivity: "हाल की स्वास्थ्य गतिविधि",
    symptomCheckCompleted: "लक्षण जांच पूर्ण",
    mildHeadacheLowRisk: "हल्का सिरदर्द - कम जोखिम",
    healthReportGenerated: "स्वास्थ्य रिपोर्ट तैयार",
    weeklySummaryAvailable: "साप्ताहिक सारांश उपलब्ध",
    dietGoalAchieved: "आहार लक्ष्य प्राप्त",
    dailyCalorieTargetMet: "दैनिक कैलोरी लक्ष्य पूरा",
    yesterday: "कल",
    
    // Emergency
    emergencyActivated: "आपातकालीन अलर्ट सक्रिय! आपातकालीन सेवाओं से संपर्क कर रहे हैं...",
    emergencyContacted: "आपातकालीन संपर्कों को सूचित किया गया। मदद आ रही है!",
    
    // Diet Tracker
    dietManagement: "आहार प्रबंधन",
    dietDescription: "व्यक्तिगत आहार सुझाव प्राप्त करें और अपने भोजन को ट्रैक करें",
    dietRecommendations: "आहार सुझाव",
    foodTracker: "भोजन ट्रैकर",
    waterIntake: "पानी का सेवन",
    selectCondition: "अपनी स्थिति चुनें",
    recommendedFoods: "सुझाए गए खाद्य पदार्थ",
    foodsToAvoid: "बचने योग्य खाद्य पदार्थ",
    dietTips: "आहार सुझाव",
    totalCalories: "कुल कैलोरी",
    mealsLogged: "भोजन लॉग किए गए",
    lastEntry: "अंतिम प्रविष्टि",
    addFoodEntry: "भोजन प्रविष्टि जोड़ें",
    foodName: "भोजन का नाम",
    calories: "कैलोरी",
    mealType: "भोजन का प्रकार",
    protein: "प्रोटीन (ग्राम)",
    carbs: "कार्ब्स (ग्राम)",
    fat: "वसा (ग्राम)",
    breakfast: "नाश्ता",
    lunch: "दोपहर का भोजन",
    dinner: "रात का खाना",
    snack: "नाश्ता",
    addWater: "पानी जोड़ें",
    waterGoal: "पानी का लक्ष्य",
    glassesOfWater: "गिलास पानी",
    dailyWaterGoal: "दैनिक पानी का लक्ष्य पूरा हुआ!",
    
    // Weekly Report
    weeklyHealthReport: "साप्ताहिक स्वास्थ्य रिपोर्ट",
    reportDescription: "इस सप्ताह के लिए आपका व्यापक स्वास्थ्य सारांश",
    overallHealth: "समग्र स्वास्थ्य",
    improvement: "सुधार",
    healthTrends: "स्वास्थ्य रुझान",
    recommendations: "सुझाव",
    goodProgress: "इस सप्ताह अच्छी प्रगति!",
    keepUpGoodWork: "अपने स्वास्थ्य लक्ष्यों के साथ अच्छा काम जारी रखें।",
    increaseWaterIntake: "अपने दैनिक पानी के सेवन को बढ़ाने की कोशिश करें",
    maintainRegularMeals: "नियमित भोजन का समय बनाए रखें",
    getRegularExercise: "दैनिक कम से कम 30 मिनट व्यायाम करें",
    
    // Dashboard Feature Summaries
    featureSummaries: "फीचर सारांश",
    symptomCheckerSummary: "प्रारंभिक स्वास्थ्य पहचान के लिए 94% सटीकता के साथ AI-संचालित लक्षण विश्लेषण",
    mentalHealthSummary: "व्यक्तिगत सहायता और पेशेवर संसाधनों के साथ दैनिक मूड ट्रैकिंग",
    dietTrackerSummary: "भोजन समय सुझाव और कैलोरी प्रबंधन के साथ स्मार्ट पोषण ट्रैकिंग",
    vaccineSchedulerSummary: "व्यक्तिगत टीकाकरण अनुस्मारक और कार्यक्रम प्रबंधन",
    lastUsed: "अंतिम उपयोग",
    accuracy: "सटीकता",
    moodToday: "आज का मूड",
    good: "अच्छा",
    streak: "निरंतरता",
    days: "दिन",
    todaysCalories: "आज की कैलोरी",
    onTrack: "ट्रैक पर",
    nextDue: "अगली नियत तारीख",
    upToDate: "अप टू डेट",
    vaccineReminderSet: "वैक्सीन रिमाइंडर सेट",
    covidBoosterDue: "COVID-19 बूस्टर 5 दिनों में देय",
    today: "आज",
    airQualityAlert: "वायु गुणवत्ता अलर्ट",
    highPollutionDetected: "आपके क्षेत्र में उच्च प्रदूषण का पता चला",
    vaccineScheduler: "वैक्सीन शेड्यूलर",
  }
};

type TranslationValue = string | ((param: string) => string);
type TranslationKey = keyof typeof translations.en;
type SupportedLanguage = keyof typeof translations;

export const useTranslation = (language: string) => {
  const currentLang = (translations[language as SupportedLanguage] || translations.en);
  
  const t = (key: TranslationKey, param?: string): string => {
    const translation: TranslationValue = currentLang[key];
    if (typeof translation === 'function') {
      return translation(param || '');
    }
    return translation || translations.en[key] as string || key;
  };

  return { t };
};
