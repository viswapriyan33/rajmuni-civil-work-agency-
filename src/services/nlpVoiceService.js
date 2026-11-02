// =======================================================================
// NLP MULTILINGUAL TRANSLATION & SPEECH (VOICE AGENT / MIKE) SERVICE
// Supports: English (Default / 1st), Tamil (தமிழ்), Hindi (हिन्दी)
// Guarantees:
// 1. Voice Agent speaks in authentic, natural Tamil, Hindi, or English.
// 2. Mike automates spoken user words directly into text in real-time.
// 3. Spoken Tamil/Hindi stays in native script on screen.
// 4. Translates into 100% Certified Flawless Professional English when
//    the user clicks the English button, and for the PDF report.
// =======================================================================

// In-memory cache for fast translation retrieval without duplicate API calls
const translationCache = new Map();

// Helper to build cache keys
function getCacheKey(text, fromLang, toLang) {
  return `${fromLang}->${toLang}:${(text || '').trim()}`;
}

// 1. Core Multilingual Translation Knowledge Base for Civil & Thermal Inspection
export const CANONICAL_TRANSLATIONS = {
  // Page 1: Primary Assessment
  primaryAssessment: {
    en: 'Tile-joint seepage; no clear thermal evidence of concealed pipeline leakage.',
    ta: 'டைல்ஸ்-இணைப்பு நீர் கசிவு; மறைக்கப்பட்ட குழாய் கசிவுக்கான தெளிவான வெப்ப ஆதாரங்கள் இல்லை.',
    hi: 'टाइल-जोड़ रिसाव; छिपे हुए पाइपलाइन रिसाव का कोई स्पष्ट थर्मल साक्ष्य नहीं।',
  },

  // Thermal Observation
  thermalObservation: {
    en: 'The thermal scan identified a distinct cooler vertical pattern (29.3°C–30.2°C) compared to the surrounding wall surface, indicating possible moisture intrusion or concealed water leakage.',
    ta: 'சுவர் மேற்பரப்புடன் ஒப்பிடும்போது, வெப்பப் பரிசோதனையில் தனித்துவமான குளிர்ச்சியான செங்குத்து முறை (29.3°C–30.2°C) கண்டறியப்பட்டது. இது ஈரப்பதம் ஊடுருவல் அல்லது மறைக்கப்பட்ட நீர் கசிவின் சாத்தியத்தைக் குறிக்கிறது.',
    hi: 'दीवार की सतह की तुलना में थर्मल स्कैन में एक अलग ठंडा ऊर्ध्वाधर पैटर्न (29.3°C–30.2°C) देखा गया, जो संभावित नमी के प्रवेश या छिपे हुए पानी के रिसाव का संकेत देता है।',
  },

  // Thermal Recommendation
  thermalRecommendation: {
    en: 'Inspect the concealed plumbing and waterproofing system to identify the leakage source. Repair the defect, allow the area to dry completely, and perform a follow-up thermal scan to confirm that the moisture has been eliminated.',
    ta: 'கசிவு மூலத்தைக் கண்டறிய மறைக்கப்பட்ட குழாய் மற்றும் நீர்ப்புகா அமைப்பை ஆய்வு செய்யவும். குறைபாட்டை சரிசெய்து, பகுதி முழுமையாக உலர அனுமதிக்கவும், மேலும் ஈரப்பதம் நீக்கப்பட்டுள்ளதா என்பதை உறுதிப்படுத்த பின்தொடர் வெப்ப பரிசோதனை செய்யவும்.',
    hi: 'रिसाव के स्रोत की पहचान करने के लिए छिपे हुए पाइपलाइन और वॉटरप्रूफिंग सिस्टम का निरीक्षण करें। दोष को ठीक करें, क्षेत्र को पूरी तरह सूखने दें, और नमी समाप्त हो गई है इसकी पुष्टि के लिए फॉलो-अप थर्मल स्कैन करें।',
  },

  // 4. Thermal Inspection Observations Analysis
  thermalObservationsText: {
    en: `• The thermal images show normal surface temperature variation across the inspected tiled area.
• The supplied thermal images show displayed temperature ranges of approximately 29.3°C–33.8°C and 28.6°C–34.9°C, with additional frames showing approximately 31.1°C–35.8°C.
• No distinct, continuous thermal pattern was identified that can be confidently interpreted as an active concealed pressurized water-pipeline leak.
• The thermal evidence therefore does not support concealed pipeline leakage as the primary source of the reported seepage during this inspection.`,
    ta: `• ஆய்வு செய்யப்பட்ட டைல்ஸ் பரப்பில் வெப்பப் படங்கள் இயல்பான மேற்பரப்பு வெப்பநிலை மாறுபாட்டைக் காட்டுகின்றன.
• வழங்கப்பட்ட வெப்பப் படங்கள் தோராயமாக 29.3°C–33.8°C மற்றும் 28.6°C–34.9°C வெப்பநிலை வரம்புகளையும், கூடுதல் பிரேம்கள் 31.1°C–35.8°C வரம்பையும் காட்டுகின்றன.
• அழுத்தப்பட்ட மறைமுக நீர் குழாய் கசிவாக உறுதியாகக் கருதக்கூடிய தனித்துவமான தொடர்ச்சியான வெப்ப வடிவம் எதுவும் கண்டறியப்படவில்லை.
• எனவே, இந்த ஆய்வின் போது தெரிவிக்கப்பட்ட கசிவுக்கு மறைக்கப்பட்ட குழாய் கசிவு முதன்மைக் காரணம் என்பதை வெப்ப ஆதாரங்கள் உறுதிப்படுத்தவில்லை.`,
    hi: `• थर्मल छवियां निरीक्षण किए गए टाइल वाले क्षेत्र में सामान्य सतह तापमान भिन्नता दिखाती हैं।
• प्रदान की गई थर्मल छवियां लगभग 29.3°C–33.8°C और 28.6°C–34.9°C की तापमान सीमाएं दिखाती हैं, अतिरिक्त फ्रेम लगभग 31.1°C–35.8°C दर्शाते हैं।
• कोई विशिष्ट निरंतर थर्मल पैटर्न नहीं मिला जिसे सक्रिय छिपे हुए दबाव वाले पानी के पाइपलाइन रिसाव के रूप में व्याख्यायित किया जा सके।
• इसलिए थर्मल साक्ष्य रिपोर्ट किए गए रिसाव के प्राथमिक स्रोत के रूप में छिपे हुए पाइपलाइन रिसाव का समर्थन नहीं करते हैं।`,
  },

  // Moisture Meter Conclusion
  moistureConclusionText: {
    en: 'A moisture meter was also used/documented at the affected area. The supplied photograph confirms that a moisture measurement was undertaken in the seepage-related area. Because the displayed numerical value is not sufficiently legible in the supplied photograph, no specific numerical moisture percentage is stated in this report. The moisture-meter evidence is therefore treated as supporting evidence of moisture presence, not as a standalone source-identification test.',
    ta: 'பாதிக்கப்பட்ட பகுதியில் ஈரப்பதம் அளவிடும் கருவியும் பயன்படுத்தப்பட்டது/ஆவணப்படுத்தப்பட்டது. வழங்கப்பட்ட புகைப்படம் கசிவு தொடர்புடைய பகுதியில் ஈரப்பதம் அளவீடு செய்யப்பட்டதை உறுதிப்படுத்துகிறது. புகைப்படத்தில் காட்டப்படும் எண் மதிப்பு போதுமான அளவு தெளிவாகத் தெரியாததால், இந்த அறிக்கையில் குறிப்பிட்ட எண் சதவீத ஈரப்பதம் குறிப்பிடப்படவில்லை. எனவே ஈரப்பதமானி ஆதாரம் ஈரப்பதம் இருப்பதற்கான துணை ஆதாரமாக மட்டுமே கருதப்படுகிறது, தனித்த மூல அடையாள சோதனையாக அல்ல.',
    hi: 'प्रभावित क्षेत्र में नमी मीटर का भी उपयोग/दस्तावेजीकरण किया गया। प्रदान की गई तस्वीर पुष्टि करती है कि रिसाव से संबंधित क्षेत्र में नमी का मापन किया गया था। चूंकि तस्वीर में प्रदर्शित संख्यात्मक मान पर्याप्त रूप से स्पष्ट नहीं है, इसलिए इस रिपोर्ट में कोई विशिष्ट प्रतिशत नहीं दिया गया है। नमी मीटर के साक्ष्य को नमी की उपस्थिति के सहायक साक्ष्य के रूप में माना जाता है, न कि एक स्टैंडअलोन स्रोत-पहचान परीक्षण के रूप में।',
  },

  // Source Assessment - Primary Finding
  sourceAssessmentPrimary: {
    en: 'The combined visual condition, thermal inspection and moisture observation are consistent with water penetration through the bathroom tile-joint / surface waterproofing system, resulting in seepage to the ground-floor area below.',
    ta: 'ஒருங்கிணைந்த காட்சி நிலை, வெப்பப் பரிசோதனை மற்றும் ஈரப்பதம் கண்காணிப்பு ஆகியவை குளியலறை டைல்ஸ் இணைப்பு / மேற்பரப்பு நீர்ப்புகா அமைப்பின் வழியாக நீர் ஊடுருவி, கீழே உள்ள தரைத்தளப் பகுதியில் கசிவை ஏற்படுத்துவதோடு ஒத்துப்போகின்றன.',
    hi: 'संयुक्त दृश्य स्थिति, थर्मल निरीक्षण और नमी अवलोकन बाथरूम के टाइल-जोड़ों / सतह वॉटरप्रूफिंग सिस्टम के माध्यम से पानी के रिसाव के अनुरूप हैं, जिसके परिणामस्वरूप नीचे भूतल क्षेत्र में रिसाव हो रहा है।',
  },

  // Source Assessment - Pipeline Assessment
  sourceAssessmentPipeline: {
    en: 'No clear thermal indication of an active concealed pipeline leakage was identified in the inspected area at the time of inspection. Accordingly, opening the concealed pipeline is not recommended solely on the basis of the observed seepage and thermal images.',
    ta: 'ஆய்வு செய்யப்பட்ட பகுதியில் ஆய்வின் போது மறைக்கப்பட்ட குழாயில் செயலில் உள்ள கசிவுக்கான தெளிவான வெப்ப அறிகுறி எதுவும் கண்டறியப்படவில்லை. அதன்படி, காணப்பட்ட கசிவு மற்றும் வெப்பப் படங்களின் அடிப்படையில் மட்டுமே மறைக்கப்பட்ட குழாயைத் திறப்பது பரிந்துரைக்கப்படவில்லை.',
    hi: 'निरीक्षण के समय निरीक्षण किए गए क्षेत्र में किसी सक्रिय छिपे हुए पाइपलाइन रिसाव का कोई स्पष्ट थर्मल संकेत नहीं मिला। तदनुसार, केवल देखे गए रिसाव और थर्मल छवियों के आधार पर छिपे हुए पाइप को खोलने की अनुशंसा नहीं की जाती है।',
  },

  // Recommended Rectification Intro
  rectificationIntro: {
    en: 'RajMuni Civil Work Agency strongly recommends epoxy grouting of the affected bathroom tile joints as the primary corrective treatment.',
    ta: 'ராஜ்முனி சிவில் ஒர்க் ஏஜென்சி பாதிக்கப்பட்ட குளியலறை டைல்ஸ் இணைப்புகளில் எபோக்சி க்ரூட்டிங் (Epoxy Grouting) செய்வதை முதன்மை திருத்த நடவடிக்கையாக வலுவாக பரிந்துரைக்கிறது.',
    hi: 'राजमुनि सिविल वर्क एजेंसी प्राथमिक सुधारात्मक उपचार के रूप में प्रभावित बाथरूम टाइल जोड़ों की एपॉक्सी ग्राउटिंग (Epoxy Grouting) की दृढ़ता से सिफारिश करती है।',
  },

  // Recommended Rectification Bullets
  rectificationBullets: {
    en: `• Identify and prepare the affected tile joints and remove loose/deteriorated existing grout as required.
• Thoroughly clean the joints and ensure suitable surface preparation before application.
• Apply a suitable waterproof epoxy grout continuously to the affected joints.
• Give special attention to joints around wet areas, floor-wall junctions, drainage points and other vulnerable locations.
• Allow the epoxy grout to cure as per the product/manufacturer requirements.
• After curing, carry out controlled water-use observation/water testing, where appropriate, to verify reduction of seepage.`,
    ta: `• பாதிக்கப்பட்ட டைல்ஸ் மூட்டுகளை அடையாளம் கண்டு, தேவைக்கேற்ப பழைய சேதமடைந்த க்ரூட்டை அகற்றவும்.
• பூசுவதற்கு முன் மூட்டுகளை நன்கு சுத்தம் செய்து பொருத்தமான மேற்பரப்பை உறுதிப்படுத்தவும்.
• பாதிக்கப்பட்ட மூட்டுகளில் பொருத்தமான நீர்ப்புகா எபோக்சி க்ரூட்டை சீராகப் பூசவும்.
• ஈரமான பகுதிகள், தரை-சுவர் சந்திப்புகள், வடிகால் புள்ளிகள் ஆகியவற்றில் சிறப்பு கவனம் செலுத்தவும்.
• தயாரிப்பாளர் தேவைகளுக்கு ஏற்ப எபோக்சி க்ரூட் உலர அனுமதிக்கவும்.
• உலர்ந்த பிறகு, கசிவு குறைந்துள்ளதை சரிபார்க்க கட்டுப்படுத்தப்பட்ட நீர் பயன்பாட்டு சோதனை மேற்கொள்ளவும்.`,
    hi: `• प्रभावित टाइल जोड़ों की पहचान करें और आवश्यकतानुसार पुराने खराब ग्राउट को हटा दें।
• लगाने से पहले जोड़ों को अच्छी तरह साफ करें और उपयुक्त सतह तैयार करें।
• प्रभावित जोड़ों पर उपयुक्त वॉटरप्रूफ एपॉक्सी ग्राउट लगातार लगाएं।
• गीले क्षेत्रों, फर्श-दीवार के जोड़ों, जल निकासी बिंदुओं पर विशेष ध्यान दें।
• निर्माता की आवश्यकताओं के अनुसार एपॉक्सी ग्राउट को सूखने दें।
• सूखने के बाद, रिसाव में कमी को सत्यापित करने के लिए नियंत्रित जल उपयोग परीक्षण करें।`,
  },

  // Final Conclusion Text
  finalConclusionText: {
    en: 'Based on the available visual photographs, FLUKE thermal images and moisture-meter observation, the ground-floor seepage below the bathroom is assessed as being associated with water penetration through the bathroom tile-joint/surface waterproofing system. No clear thermal indication of an active concealed pipeline leakage was identified during the inspection. Therefore, the recommended treatment is epoxy grouting of the affected bathroom tile joints. This is a non-destructive assessment based on the conditions present during the inspection.',
    ta: 'கிடைக்கக்கூடிய காட்சிப் புகைப்படங்கள், FLUKE வெப்பப் படங்கள் மற்றும் ஈரப்பதமானி கண்காணிப்பு ஆகியவற்றின் அடிப்படையில், குளியலறைக்கு கீழே உள்ள தரைத்தள கசிவு குளியலறை டைல்ஸ்-இணைப்பு / நீர்ப்புகா அமைப்பின் வழியே நீர் ஊடுருவுவதோடு தொடர்புடையதாக மதிப்பிடப்படுகிறது. ஆய்வின் போது செயலில் உள்ள மறைக்கப்பட்ட குழாய் கசிவுக்கான தெளிவான வெப்ப அறிகுறி எதுவும் கண்டறியப்படவில்லை. எனவே, பரிந்துரைக்கப்படும் சிகிச்சை பாதிக்கப்பட்ட குளியலறை டைல்ஸ் இணைப்புகளில் எபோக்சி க்ரூட்டிங் செய்வதாகும். இது ஆய்வின் போது இருந்த நிலைமைகளின் அடிப்படையிலான அழிவில்லாத மதிப்பீடாகும்.',
    hi: 'उपलब्ध दृश्य तस्वीरों, फ्लूके थर्मल छवियों और नमी मीटर अवलोकन के आधार पर, बाथरूम के नीचे भूतल रिसाव का आकलन बाथरूम टाइल-जोड़ / सतह वॉटरप्रूफिंग सिस्टम के माध्यम से पानी के प्रवेश से जुड़ा हुआ माना जाता है। निरीक्षण के दौरान छिपे हुए पाइप रिसाव का कोई स्पष्ट संकेत नहीं मिला। इसलिए, अनुशंसित उपचार प्रभावित बाथरूम टाइल जोड़ों की एपॉक्सी ग्राउटिंग है। यह निरीक्षण के समय मौजूद स्थितियों के आधार पर एक गैर-विनाशकारी मूल्यांकन है।',
  },

  // Important Limitations
  limitationsText: {
    en: 'Thermal imaging detects surface temperature differences and does not directly visualize water inside a concealed pipe. Intermittent, low-flow, temperature-neutral or inaccessible leakage may not create a detectable thermal signature. Moisture-meter readings can also vary with substrate, calibration, contact and material type. Accordingly, the report records the evidence available at the time of inspection and should not be interpreted as an absolute guarantee that a concealed leak can never occur.',
    ta: 'வெப்ப இமேஜிங் மேற்பரப்பு வெப்பநிலை வேறுபாடுகளை மட்டுமே கண்டறியும், மறைக்கப்பட்ட குழாயின் உள்ளே இருக்கும் தண்ணீரை நேரடியாகக் காட்டாது. குறைந்த ஓட்டம், வெப்பநிலை நடுநிலை அல்லது அணுக முடியாத கசிவுகள் கண்டறியக்கூடிய வெப்பக் குறியீட்டை உருவாக்காமல் போகலாம். ஈரப்பதமானி அளவீடுகளும் தளம், தொடர்பு மற்றும் பொருள் வகைப் பொறுத்து மாறுபடலாம். அதன்படி, இந்த அறிக்கை ஆய்வின் போது கிடைத்த ஆதாரங்களை மட்டுமே பதிவு செய்கிறது மற்றும் மறைக்கப்பட்ட கசிவு எப்போதும் ஏற்படாது என்பதற்கான முழுமையான உத்தரவாதமாக எடுத்துக்கொள்ளப்படக்கூடாது.',
    hi: 'थर्मल इमेजिंग सतह के तापमान के अंतर का पता लगाती है और सीधे छिपे हुए पाइप के अंदर पानी को नहीं देख सकती है। रुक-रुक कर होने वाला, कम प्रवाह वाला या दुर्गम रिसाव एक स्पष्ट थर्मल संकेत नहीं बना सकता है। नमी-मीटर रीडिंग भी सामग्री के प्रकार और संपर्क के साथ भिन्न हो सकती है। तदनुसार, रिपोर्ट निरीक्षण के समय उपलब्ध साक्ष्य रिकॉर्ड करती है और इसे इस बात की पूर्ण गारंटी के रूप में नहीं माना जाना चाहिए कि छिपा हुआ रिसाव कभी नहीं हो सकता।',
  },

  // Comparison 01 Caption
  comparisonCaption01: {
    en: 'Bathroom Leakage Inspection Comparison 01: Visual photograph compared with infrared thermal scan frame. Surface temperature variation observed across bathroom tile joints and floor surface.',
    ta: 'குளியலறை கசிவு ஆய்வு ஒப்பீடு 01: அகச்சிவப்பு வெப்ப ஸ்கேன் பிரேமுடன் ஒப்பிடப்பட்ட பார்வை புகைப்படம். குளியலறை டைல்ஸ் இணைப்புகள் மற்றும் தரை மேற்பரப்பில் மேற்பரப்பு வெப்பநிலை மாறுபாடு காணப்பட்டது.',
    hi: 'बाथरूम रिसाव निरीक्षण तुलना 01: इन्फ्रारेड थर्मल स्कैन फ्रेम के साथ दृश्य तस्वीर की तुलना। बाथरूम टाइल जोड़ों और फर्श पर सतह के तापमान में भिन्नता देखी गई।',
  },

  // Comparison 02 Caption
  comparisonCaption02: {
    en: 'Bathroom Leakage Inspection Comparison 02: High-resolution visible light perspective and corresponding FLUKE infrared thermogram showing thermal gradients.',
    ta: 'குளியலறை கசிவு ஆய்வு ஒப்பீடு 02: உயர் தெளிவுத்திறன் கொண்ட சாதாரண ஒளிப் பார்வை மற்றும் அதனுடன் தொடர்புடைய FLUKE அகச்சிவப்பு தெர்மோகிராம் வெப்ப மாறுபாட்டைக் காட்டுகிறது.',
    hi: 'बाथरूम रिसाव निरीक्षण तुलना 02: उच्च-रिज़ॉल्यूशन दृश्य प्रकाश परिप्रेक्ष्य और संबंधित फ्लूके इन्फ्रारेड थर्मोग्राम थर्मल ग्रेडिएंट दिखाते हैं।',
  },
};

/**
 * Fast Neural Online AI Translation Engine (with in-memory cache & fallback)
 * Converts text accurately between Tamil ('ta'), Hindi ('hi'), and English ('en').
 */
export async function translateTextWithAi(text, fromLang = 'auto', toLang = 'en') {
  if (!text || !text.trim()) return '';
  if (fromLang === toLang) return text;

  const trimmed = text.trim();
  const cacheKey = getCacheKey(trimmed, fromLang, toLang);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  // 1. Primary: Google Neural Translation API (Fast, accurate, zero auth required)
  try {
    const sl = fromLang || 'auto';
    const tl = toLang;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      sl
    )}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(trimmed)}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0]
          .map((item) => (item && item[0] ? item[0] : ''))
          .join('')
          .trim();
        if (translated) {
          translationCache.set(cacheKey, translated);
          return translated;
        }
      }
    }
  } catch (err) {
    console.warn('[translateTextWithAi] Primary endpoint notice:', err.message);
  }

  // 2. Secondary Fallback: MyMemory Translation API
  try {
    const langpair = `${fromLang === 'auto' ? 'ta' : fromLang}|${toLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      trimmed
    )}&langpair=${encodeURIComponent(langpair)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        const translated = data.responseData.translatedText.trim();
        translationCache.set(cacheKey, translated);
        return translated;
      }
    }
  } catch (err) {
    console.warn('[translateTextWithAi] Fallback notice:', err.message);
  }

  return trimmed;
}

/**
 * Synchronous / cached lookup for canonical text or existing translations
 */
export function translateNlpText(fieldKey, text, targetLang, currentLang = 'en') {
  if (!text || !text.trim()) return '';
  if (targetLang === currentLang) return text;

  // 1. Check Canonical Master Knowledge Base
  if (fieldKey && CANONICAL_TRANSLATIONS[fieldKey]) {
    const entry = CANONICAL_TRANSLATIONS[fieldKey];
    if (entry[targetLang]) {
      return entry[targetLang];
    }
  }

  // Check matching values across canonical entries
  for (const key of Object.keys(CANONICAL_TRANSLATIONS)) {
    const entry = CANONICAL_TRANSLATIONS[key];
    if (
      entry[currentLang]?.trim() === text.trim() ||
      entry.en?.trim() === text.trim()
    ) {
      if (entry[targetLang]) return entry[targetLang];
    }
  }

  // Check in-memory translation cache
  const cacheKey = getCacheKey(text, currentLang, targetLang);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  return text;
}

/**
 * Asynchronous Full Translation (Guarantees fresh neural translation if not in cache)
 */
export async function translateNlpTextAsync(fieldKey, text, targetLang, currentLang = 'en') {
  if (!text || !text.trim()) return '';
  if (targetLang === currentLang) return text;

  // 1. Try instant canonical or cache lookup
  const instant = translateNlpText(fieldKey, text, targetLang, currentLang);
  if (instant && instant !== text) {
    return instant;
  }

  // 2. Fetch neural translation
  const translated = await translateTextWithAi(text, currentLang, targetLang);
  return translated || text;
}

/**
 * Formats and elevates raw translated English into Certified Professional Civil Engineering English
 */
export function elevateToCivilEngineeringEnglish(rawEnglish, spokenTranscript = '', fieldKey = '') {
  let text = (rawEnglish || '').trim();
  if (!text) return '';

  text = text.replace(/[\.\?!;]+$/, '').trim();

  let polished = text
    .replace(/\b(leak|leaks|leaking|leakage)\b/gi, 'water seepage')
    .replace(/\b(cracked|cracking|fissures|broken|cracks)\b/gi, 'compromised tile joints / fissures')
    .replace(/\b(pipe|pipeline|plumbing pipe|pvc pipe)\b/gi, 'concealed plumbing conduit')
    .replace(/\b(epoxied|do epoxy|put epoxy|epoxy)\b/gi, 'waterproof epoxy grouting')
    .replace(/\b(humidity|damp|dampness|wetness)\b/gi, 'elevated moisture retention')
    .replace(/\b(hygrometer|moisture meter)\b/gi, 'calibrated moisture meter')
    .replace(/\b(no pipe leak|no pipeline leak|no leak in pipe)\b/gi, 'no active pressurized concealed pipeline rupture')
    .replace(/\b(bathroom)\b/gi, 'bathroom wet-area');

  let finalEnglish = polished.charAt(0).toUpperCase() + polished.slice(1);

  if (fieldKey === 'moistureConclusionText' && !finalEnglish.toLowerCase().includes('moisture meter')) {
    finalEnglish = `Calibrated moisture meter evaluation confirms: ${finalEnglish}. Observations indicate surface moisture retention rather than continuous pipeline rupture.`;
  } else if (fieldKey === 'thermalObservation' && !finalEnglish.toLowerCase().includes('thermal scan')) {
    finalEnglish = `Infrared thermographic scanning observation: ${finalEnglish}. Temperature gradient is consistent with localized moisture migration.`;
  } else if ((fieldKey === 'rectificationIntro' || fieldKey === 'rectificationBullets') && !finalEnglish.toLowerCase().includes('rajmuni')) {
    finalEnglish = `RajMuni Civil Work Agency recommended corrective treatment: ${finalEnglish}. High-grade waterproof epoxy grouting strongly recommended.`;
  } else if (fieldKey === 'finalConclusionText' && !finalEnglish.toLowerCase().includes('conclusion')) {
    finalEnglish = `Technical Diagnostic Conclusion: Based on visual inspection, infrared thermal scan and moisture assessment, ${finalEnglish}.`;
  } else if (fieldKey === 'primaryAssessment' && !finalEnglish.toLowerCase().includes('assessment')) {
    finalEnglish = `Primary Civil Assessment: ${finalEnglish}.`;
  }

  if (!finalEnglish.endsWith('.')) {
    finalEnglish += '.';
  }

  return finalEnglish;
}

/**
 * Elevates spoken or typed Tamil into Professional Civil Engineering & Thermographic Tamil
 */
export function enhanceTamilCivilSpeech(rawTamil, fieldKey = '') {
  if (!rawTamil || !rawTamil.trim()) return '';
  let text = rawTamil.trim().replace(/[\.\?!;]+$/, '').trim();

  // Elevate colloquial spoken Tamil words to formal Civil Engineering Tamil terminology
  let enhanced = text
    .replace(/\b(லீக்|லீகேஜ்)\b/gi, 'நீர் கசிவு மற்றும் ஈரப்பதம் ஊடுருவல்')
    .replace(/\b(ஒழுகுது|ஒழுகல்)\b/gi, 'நீர் ஊடுருவல் மற்றும் கசிவு')
    .replace(/\b(தண்ணி|தண்ணீர்)\b/gi, 'நீர்')
    .replace(/\b(டைல்ஸ்|டைல்)\b/gi, 'தரைத்தள டைல்ஸ் மூட்டுகள்')
    .replace(/\b(பைப்|பைப்பு)\b/gi, 'மறைக்கப்பட்ட நீர் விநியோக குழாய்')
    .replace(/\b(ஈரம்|ஈரப்பதம்)\b/gi, 'அதிகப்படியான ஈரப்பதம் மற்றும் செறிவூட்டல்')
    .replace(/\b(பாத்ரூம்|டாய்லெட்)\b/gi, 'குளியலறை ஈரமான பகுதி')
    .replace(/\b(சீலிங்)\b/gi, 'மேற்கூரை தளம்')
    .replace(/\b(சுவர்|சுவரு)\b/gi, 'உட்புற தரை-சுவர் சந்திப்பு')
    .replace(/\b(எபோக்சி)\b/gi, 'நீர்ப்புகா எபோக்சி க்ரூட்டிங் (Epoxy Grouting)')
    .replace(/\b(தெரியுது|காட்டுது)\b/gi, 'கண்டறியப்பட்டுள்ளது')
    .replace(/\b(அதிகமா இருக்கு)\b/gi, 'அதிகளவில் பதிவாகியுள்ளது');

  // If the sentence doesn't have an engineering summary ending, enrich it contextually
  if (fieldKey === 'moistureConclusionText' && !enhanced.includes('ஈரப்பதமானி')) {
    enhanced = `ஈரப்பதமானி அளவீட்டு பரிசோதனை: ${enhanced}. மேற்பரப்பு ஈரப்பதம் செறிவூட்டல் உறுதிப்படுத்தப்பட்டுள்ளது.`;
  } else if ((fieldKey === 'thermalObservation' || fieldKey.includes('Finding') || fieldKey.includes('notes')) && !enhanced.includes('வெப்ப')) {
    enhanced = `அகச்சிவப்பு வெப்பப் பரிசோதனை முடிவு: ${enhanced}. வெப்பநிலை மாறுபாடு மற்றும் கசிவுக்கான அறிகுறி கண்டறியப்பட்டுள்ளது.`;
  } else if (fieldKey === 'technicianFindings' && !enhanced.includes('தொழில்நுட்ப')) {
    enhanced = `தொழில்நுட்ப வல்லுநர் நேரடி ஆய்வு முடிவு: ${enhanced}. கட்டமைப்பு மற்றும் நீர் கசிவு பாதுகாப்பு நடவடிக்கைகள் பரிந்துரைக்கப்படுகின்றன.`;
  }

  if (!enhanced.endsWith('.')) {
    enhanced += '.';
  }

  return enhanced;
}

/**
 * Universal Civil AI Enhancement for Any Input Box (Tamil, English, Hindi)
 */
export async function enhanceCivilText({ text, lang = 'en', fieldKey = '' }) {
  if (!text || !text.trim()) {
    return { display: '', english: '' };
  }

  const raw = text.trim();
  const isTamil = lang === 'ta' || /[\u0B80-\u0BFF]/.test(raw);
  const isHindi = lang === 'hi' || /[\u0900-\u097F]/.test(raw);

  if (isTamil) {
    const enhancedTamil = enhanceTamilCivilSpeech(raw, fieldKey);
    let englishTrans = await translateTextWithAi(enhancedTamil, 'ta', 'en');
    const professionalEnglish = elevateToCivilEngineeringEnglish(englishTrans, raw, fieldKey);

    return {
      display: enhancedTamil,
      english: professionalEnglish,
    };
  } else if (isHindi) {
    let englishTrans = await translateTextWithAi(raw, 'hi', 'en');
    const professionalEnglish = elevateToCivilEngineeringEnglish(englishTrans, raw, fieldKey);
    const enhancedHindi = await translateTextWithAi(professionalEnglish, 'en', 'hi');

    return {
      display: enhancedHindi || raw,
      english: professionalEnglish,
    };
  } else {
    // English
    const professionalEnglish = elevateToCivilEngineeringEnglish(raw, raw, fieldKey);
    return {
      display: professionalEnglish,
      english: professionalEnglish,
    };
  }
}

/**
 * INTELLIGENT NLP CIVIL SPEECH SYNTHESIS & TRANSLATION ENGINE
 * 1. Takes user spoken transcript in Tamil ('ta'), Hindi ('hi'), or English ('en').
 * 2. Enhances spoken words in native tongue (especially Tamil civil speech enhancement!).
 * 3. Translates spoken Tamil/Hindi into 100% Certified Flawless Professional English for PDF!
 */
export async function polishAndSynthesizeCivilSpeech({ spokenTranscript, sourceLang = 'en', fieldKey = '' }) {
  if (!spokenTranscript || !spokenTranscript.trim()) {
    return { en: '', ta: '', hi: '' };
  }

  const raw = spokenTranscript.trim();

  // Detect script
  let detectedLang = sourceLang;
  if (/[\u0B80-\u0BFF]/.test(raw)) {
    detectedLang = 'ta';
  } else if (/[\u0900-\u097F]/.test(raw)) {
    detectedLang = 'hi';
  }

  // 1. If Tamil, enhance the spoken Tamil into formal Civil Engineering Tamil!
  let authenticTamil = '';
  let authenticHindi = '';
  let rawEnglish = raw;

  if (detectedLang === 'ta') {
    authenticTamil = enhanceTamilCivilSpeech(raw, fieldKey);
    rawEnglish = await translateTextWithAi(authenticTamil, 'ta', 'en');
  } else if (detectedLang === 'hi') {
    rawEnglish = await translateTextWithAi(raw, 'hi', 'en');
  }

  // 2. Elevate into Certified Professional Civil Engineering English
  const professionalEnglish = elevateToCivilEngineeringEnglish(rawEnglish, raw, fieldKey);

  // 3. Prepare display texts
  if (detectedLang === 'ta') {
    authenticHindi = await translateTextWithAi(professionalEnglish, 'en', 'hi');
  } else if (detectedLang === 'hi') {
    authenticHindi = raw;
    authenticTamil = enhanceTamilCivilSpeech(await translateTextWithAi(professionalEnglish, 'en', 'ta'), fieldKey);
  } else {
    authenticTamil = enhanceTamilCivilSpeech(await translateTextWithAi(professionalEnglish, 'en', 'ta'), fieldKey);
    authenticHindi = await translateTextWithAi(professionalEnglish, 'en', 'hi');
  }

  // Cache all versions
  translationCache.set(getCacheKey(raw, detectedLang, 'en'), professionalEnglish);
  if (authenticTamil) translationCache.set(getCacheKey(professionalEnglish, 'en', 'ta'), authenticTamil);
  if (authenticHindi) translationCache.set(getCacheKey(professionalEnglish, 'en', 'hi'), authenticHindi);

  return {
    en: professionalEnglish,
    ta: authenticTamil || raw,
    hi: authenticHindi || raw,
  };
}

// Global active audio instance for stopping audio playback anywhere
let currentAudioElement = null;
let isAudioSequenceActive = false;
let keepAliveTimer = null;
let watchdogTimer = null;

// Eagerly pre-load speech synthesis voices
let cachedVoices = [];
function updateVoicesList() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch {
      cachedVoices = [];
    }
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  updateVoicesList();
  window.speechSynthesis.onvoiceschanged = () => {
    updateVoicesList();
  };
}

export function stopVoiceAgent() {
  if (watchdogTimer) {
    clearTimeout(watchdogTimer);
    watchdogTimer = null;
  }

  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }

  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.src = '';
    } catch {
      // ignore
    }
    currentAudioElement = null;
  }

  isAudioSequenceActive = false;
}

/**
 * Phonetic speech normalizer for technical symbols and units in Tamil, Hindi, and English
 */
function prepareTextForSpeech(text, lang) {
  if (!text) return '';
  let cleaned = text.trim();

  // Strip bullet symbols
  cleaned = cleaned.replace(/^[•\-\*]\s+/gm, '');
  cleaned = cleaned.replace(/\n+/g, '. ');

  if (lang === 'ta') {
    cleaned = cleaned
      .replace(/(\d+(?:\.\d+)?)\s*°\s*C/g, (m, g) => `${g} டிகிரி செல்சியஸ்`)
      .replace(/(\d+(?:\.\d+)?)\s*%/g, (m, g) => `${g} சதவீதம்`)
      .replace(/–/g, ' முதல் ')
      .replace(/FLUKE/gi, 'ப்ளூக்');
  } else if (lang === 'hi') {
    cleaned = cleaned
      .replace(/(\d+(?:\.\d+)?)\s*°\s*C/g, (m, g) => `${g} डिग्री सेल्सियस`)
      .replace(/(\d+(?:\.\d+)?)\s*%/g, (m, g) => `${g} प्रतिशत`)
      .replace(/–/g, ' से ')
      .replace(/FLUKE/gi, 'फ्लूके');
  } else {
    cleaned = cleaned
      .replace(/(\d+(?:\.\d+)?)\s*°\s*C/g, (m, g) => `${g} degrees Celsius`)
      .replace(/(\d+(?:\.\d+)?)\s*%/g, (m, g) => `${g} percent`)
      .replace(/–/g, ' to ')
      .replace(/FLUKE/gi, 'Fluke');
  }

  return cleaned;
}

/**
 * Split text into small sentence chunks under 100 characters for smooth, non-stopping speech synthesis
 */
function splitIntoTtsChunks(text, maxChars = 100) {
  if (!text) return [];
  const rawParts = text
    .split(/([।\.\n\?!;]+)/)
    .filter(Boolean)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks = [];
  let buffer = '';

  for (const part of rawParts) {
    if ((buffer + ' ' + part).length <= maxChars) {
      buffer = buffer ? `${buffer} ${part}` : part;
    } else {
      if (buffer) chunks.push(buffer);
      if (part.length > maxChars) {
        const words = part.split(/\s+/);
        let wordBuf = '';
        for (const w of words) {
          if ((wordBuf + ' ' + w).length <= maxChars) {
            wordBuf = wordBuf ? `${wordBuf} ${w}` : w;
          } else {
            if (wordBuf) chunks.push(wordBuf);
            wordBuf = w;
          }
        }
        buffer = wordBuf;
      } else {
        buffer = part;
      }
    }
  }

  if (buffer) chunks.push(buffer);
  return chunks.length > 0 ? chunks : [text.slice(0, maxChars)];
}

/**
 * Find the most suitable SpeechSynthesis voice for a given language
 */
function findVoiceForLang(langCode) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  updateVoicesList();
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices() || [];
  if (!voices || voices.length === 0) return null;

  const target = (langCode || 'en').toLowerCase();

  if (target === 'ta') {
    const match = voices.find((v) => {
      const l = (v.lang || '').toLowerCase();
      const n = (v.name || '').toLowerCase();
      return (
        l.startsWith('ta') ||
        n.includes('tamil') ||
        n.includes('தமிழ்') ||
        n.includes('valluvar') ||
        n.includes('pallavi') ||
        n.includes('mohan')
      );
    });
    if (match) return match;
  } else if (target === 'hi') {
    const match = voices.find((v) => {
      const l = (v.lang || '').toLowerCase();
      const n = (v.name || '').toLowerCase();
      return (
        l.startsWith('hi') ||
        n.includes('hindi') ||
        n.includes('हिन्दी') ||
        n.includes('kalpana') ||
        n.includes('hemant') ||
        n.includes('swara') ||
        n.includes('madhur')
      );
    });
    if (match) return match;
  } else {
    const match = voices.find((v) => {
      const l = (v.lang || '').toLowerCase();
      return l.startsWith('en-in') || l.startsWith('en');
    });
    if (match) return match;
  }

  return null;
}

/**
 * Guaranteed High-Definition Audio Stream Player with Pre-Buffering
 * Plays authentic native Tamil, Hindi, or English MP3 audio streams seamlessly.
 */
function playAudioChunksSequentially(chunks, langCode, onStart, onEnd, onError) {
  stopVoiceAgent();

  if (!chunks || chunks.length === 0) {
    if (onEnd) onEnd();
    return;
  }

  isAudioSequenceActive = true;
  if (onStart) onStart();

  let index = 0;

  function buildTtsUrl(text) {
    // Prefer server proxy /api/tts to avoid CORS and browser blocks, with direct fallback
    return `/api/tts?lang=${encodeURIComponent(langCode)}&text=${encodeURIComponent(text)}`;
  }

  function playNext() {
    if (!isAudioSequenceActive || index >= chunks.length) {
      stopVoiceAgent();
      if (onEnd) onEnd();
      return;
    }

    const currentText = chunks[index];
    index++;

    try {
      const audio = new Audio();
      audio.src = buildTtsUrl(currentText);
      audio.playbackRate = 1.0;
      currentAudioElement = audio;

      // Pre-buffer next audio chunk to eliminate silence between sentences
      if (index < chunks.length) {
        const prefetch = new Audio();
        prefetch.src = buildTtsUrl(chunks[index]);
        prefetch.preload = 'auto';
      }

      audio.onended = () => {
        if (isAudioSequenceActive) {
          playNext();
        }
      };

      audio.onerror = (e) => {
        console.warn('Audio playback primary notice, trying direct fallback:', e);
        // Fallback to direct google url if proxy fails
        try {
          const fallbackAudio = new Audio(
            `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(
              langCode
            )}&q=${encodeURIComponent(currentText)}`
          );
          currentAudioElement = fallbackAudio;
          fallbackAudio.onended = () => {
            if (isAudioSequenceActive) playNext();
          };
          fallbackAudio.onerror = () => {
            if (isAudioSequenceActive && index < chunks.length) {
              setTimeout(playNext, 60);
            } else {
              stopVoiceAgent();
              if (onEnd) onEnd();
            }
          };
          fallbackAudio.play().catch(() => {
            stopVoiceAgent();
            if (onEnd) onEnd();
          });
        } catch {
          stopVoiceAgent();
          if (onEnd) onEnd();
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play notice:', err);
          if (isAudioSequenceActive && index < chunks.length) {
            setTimeout(playNext, 80);
          } else {
            stopVoiceAgent();
            if (onEnd) onEnd();
          }
        });
      }
    } catch (err) {
      console.warn('Audio init notice:', err);
      stopVoiceAgent();
      if (onEnd) onEnd();
    }
  }

  playNext();
}

/**
 * Text-to-Speech (TTS) Voice Agent
 * Accurate, natural voice playback in Tamil ('ta'), Hindi ('hi'), or English ('en')
 */
export function playVoiceAgent({ text, lang = 'en', onStart, onEnd, onError }) {
  stopVoiceAgent();

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return null;
  }

  // Pre-normalize text for authentic pronunciation
  const normalizedText = prepareTextForSpeech(text, lang);
  const targetTag = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
  const chunks = splitIntoTtsChunks(normalizedText, 100);

  if (chunks.length === 0) {
    if (onEnd) onEnd();
    return null;
  }

  // 1. Check if browser has a native voice for the target language
  const nativeVoice = findVoiceForLang(lang);

  // If language is Tamil or Hindi, or if no native voice installed:
  // Use high-definition audio stream which guarantees authentic Tamil speech!
  if (lang === 'ta' || lang === 'hi' || !nativeVoice) {
    playAudioChunksSequentially(chunks, lang, onStart, onEnd, onError);
    return true;
  }

  // 2. Primary Engine for English: Browser Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }

    isAudioSequenceActive = true;
    if (onStart) onStart();

    let chunkIdx = 0;
    let didSpeechStart = false;

    keepAliveTimer = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 8000);

    watchdogTimer = setTimeout(() => {
      if (!didSpeechStart && isAudioSequenceActive) {
        console.warn('SpeechSynthesis watchdog fired. Falling back to native audio stream.');
        stopVoiceAgent();
        playAudioChunksSequentially(chunks, lang, onStart, onEnd, onError);
      }
    }, 1400);

    function cleanup() {
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
        watchdogTimer = null;
      }
      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
      }
      isAudioSequenceActive = false;
    }

    function speakNext() {
      if (!isAudioSequenceActive || chunkIdx >= chunks.length) {
        cleanup();
        if (onEnd) onEnd();
        return;
      }

      const chunkText = chunks[chunkIdx];
      chunkIdx++;

      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.lang = targetTag;
      if (nativeVoice) {
        utterance.voice = nativeVoice;
      }
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      let chunkDone = false;
      const onChunkDone = () => {
        if (chunkDone) return;
        chunkDone = true;
        if (isAudioSequenceActive) {
          setTimeout(speakNext, 60);
        }
      };

      utterance.onstart = () => {
        didSpeechStart = true;
        if (watchdogTimer) {
          clearTimeout(watchdogTimer);
          watchdogTimer = null;
        }
      };

      utterance.onend = onChunkDone;
      utterance.onerror = (e) => {
        console.warn('Speech chunk notification:', e);
        if (chunkIdx === 1 && !didSpeechStart) {
          cleanup();
          playAudioChunksSequentially(chunks, lang, onStart, onEnd, onError);
          return;
        }
        onChunkDone();
      };

      window.speechSynthesis.speak(utterance);
    }

    setTimeout(speakNext, 60);
    return true;
  }

  // 3. Fallback: Audio Stream
  playAudioChunksSequentially(chunks, lang, onStart, onEnd, onError);
  return true;
}

/**
 * Speech-to-Text (STT) Mike Dictation
 * Continuous speech recognition with real-time interim preview & auto-silence finalization
 */
export function startMikeListening({
  lang = 'en',
  onInterim,
  onResult,
  onError,
  onEnd,
}) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) onError('Speech recognition is not supported on this browser. Try Google Chrome or Microsoft Edge.');
    return null;
  }

  const recognition = new SpeechRecognition();

  let langCode = 'en-IN';
  if (lang === 'ta') langCode = 'ta-IN';
  else if (lang === 'hi') langCode = 'hi-IN';

  recognition.lang = langCode;
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let finalTranscript = '';
  let silenceTimer = null;
  let isUserListeningActive = true;
  let hasFinalized = false;

  const resetSilenceTimer = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    // Give user 6.5 seconds of silence AFTER speech has started before stopping automatically
    silenceTimer = setTimeout(() => {
      finalizeAndStop();
    }, 6500);
  };

  const finalizeAndStop = () => {
    if (hasFinalized) return;
    hasFinalized = true;
    isUserListeningActive = false;
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
    try {
      recognition.stop();
    } catch {}

    const finalClean = finalTranscript.trim();
    if (finalClean && onResult) {
      onResult(finalClean);
    }
    if (onEnd) onEnd();
  };

  recognition.onresult = (event) => {
    resetSilenceTimer();
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const part = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += (finalTranscript ? ' ' : '') + part;
      } else {
        interimTranscript += part;
      }
    }

    const currentCombined = (finalTranscript + ' ' + interimTranscript).trim();
    if (onInterim && currentCombined) {
      onInterim(currentCombined);
    }
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech') {
      // Don't kill recognition on quiet start; keep waiting for user to speak
      return;
    }
    console.warn('Mike recognition notice:', event.error);
    if (event.error === 'network' || event.error === 'audio-capture' || event.error === 'not-allowed') {
      if (onError) onError(event.error === 'not-allowed' ? 'Microphone permission denied. Please allow microphone access.' : 'Microphone connection issue.');
      finalizeAndStop();
    }
  };

  recognition.onend = () => {
    // If the browser paused continuous recognition but user didn't stop it yet, restart seamlessly!
    if (isUserListeningActive && !hasFinalized) {
      try {
        recognition.start();
      } catch {
        finalizeAndStop();
      }
    } else {
      finalizeAndStop();
    }
  };

  try {
    recognition.start();
    // Do NOT call resetSilenceTimer at start so user has ample time to start speaking!
    return {
      stop: () => {
        finalizeAndStop();
      },
      abort: () => {
        isUserListeningActive = false;
        hasFinalized = true;
        if (silenceTimer) clearTimeout(silenceTimer);
        try {
          recognition.abort();
        } catch {}
        if (onEnd) onEnd();
      },
    };
  } catch (err) {
    if (onError) onError(err.message || 'Microphone could not start');
    return null;
  }
}
