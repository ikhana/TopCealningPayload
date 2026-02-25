// src/blocks/ServicesExplorer/sampleData.ts

export interface TestService {
  id: string
  title: string
  description: string
  previewImage: string
  category: string
  features: string[]
  frequency?: string
  testType: 'blood' | 'urine' | 'saliva' | 'hair' | 'comprehensive'
  turnaroundTime: string
  homeCollection: boolean
  featured?: boolean
  detailedInfo: {
    overview: string
    whatItTests: string[]
    preparation: string
    resultsInterpretation: string
    clinicalRelevance: string
  }
}

export const SERVICES_EXPLORER_SAMPLE_DATA: TestService[] = [
  {
    id: 'NBL_001',
    title: 'Hypertension Panel',
    description: 'Comprehensive cardiovascular risk assessment including blood pressure markers, lipid profile, and kidney function tests.',
    previewImage: 'https://picsum.photos/500/300?random=1',
    category: 'Cardiovascular Health',
    features: ['Complete lipid panel', 'Kidney function markers', 'Cardiovascular risk assessment'],
    testType: 'blood',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    featured: true,
    detailedInfo: {
      overview: 'This comprehensive panel evaluates multiple factors that contribute to hypertension and cardiovascular disease risk. Our testing includes advanced lipid analysis, kidney function markers, and inflammatory indicators.',
      whatItTests: ['Total cholesterol, LDL, HDL, triglycerides', 'Creatinine and estimated GFR', 'Microalbumin', 'C-reactive protein', 'Glucose levels'],
      preparation: 'Fast for 9-12 hours before blood draw. Water is permitted. Avoid alcohol for 24 hours prior to testing.',
      resultsInterpretation: 'Results help identify cardiovascular risk factors and guide treatment decisions. Elevated markers may indicate need for lifestyle modifications or medication.',
      clinicalRelevance: 'Early detection of hypertension-related complications can prevent heart disease, stroke, and kidney damage. Regular monitoring supports effective management.'
    }
  },
  {
    id: 'NBL_002',
    title: 'Rett Syndrome Genetics',
    description: 'Advanced genetic testing for Rett Syndrome including MECP2 gene analysis and related genetic markers.',
    previewImage: 'https://picsum.photos/500/300?random=2',
    category: 'Genetic Testing',
    features: ['MECP2 gene analysis', 'Genetic counseling available', 'Family planning insights'],
    testType: 'blood',
    turnaroundTime: '7-14 days',
    homeCollection: true,
    featured: true,
    detailedInfo: {
      overview: 'Rett Syndrome is a neurodevelopmental disorder caused primarily by mutations in the MECP2 gene. This comprehensive genetic test analyzes the complete coding sequence and regulatory regions.',
      whatItTests: ['MECP2 gene full sequence analysis', 'Large deletion/duplication analysis', 'X-inactivation studies when indicated', 'Additional Rett-related genes (CDKL5, FOXG1)'],
      preparation: 'No special preparation required. Simple blood draw or saliva collection available.',
      resultsInterpretation: 'Positive results confirm genetic cause. Negative results may require additional testing or clinical correlation. Genetic counseling recommended.',
      clinicalRelevance: 'Genetic confirmation enables appropriate management planning, family counseling, and reproductive decision-making for at-risk families.'
    }
  },
  {
    id: 'NBL_003',
    title: 'Thyroid Health Complete',
    description: 'Full thyroid function assessment including TSH, Free T3, Free T4, and thyroid antibodies.',
    previewImage: 'https://picsum.photos/500/300?random=3',
    category: 'Hormone Testing',
    features: ['TSH, Free T3/T4', 'Thyroid antibodies', 'Metabolism insights'],
    testType: 'blood',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    detailedInfo: {
      overview: 'Complete thyroid function evaluation assessing hormone production, regulation, and autoimmune activity. Essential for diagnosing hypo/hyperthyroidism and autoimmune thyroid conditions.',
      whatItTests: ['TSH (Thyroid Stimulating Hormone)', 'Free T4 and Free T3', 'Anti-TPO antibodies', 'Thyroglobulin antibodies', 'Reverse T3 when indicated'],
      preparation: 'No fasting required. Avoid biotin supplements 72 hours before testing. Take thyroid medications after blood draw if possible.',
      resultsInterpretation: 'TSH levels indicate pituitary-thyroid communication. Free hormone levels show actual thyroid function. Antibodies detect autoimmune involvement.',
      clinicalRelevance: 'Thyroid disorders affect metabolism, energy, weight, and cardiovascular health. Early detection prevents complications and guides treatment.'
    }
  },
  {
    id: 'NBL_004',
    title: 'Heart Disease Risk Panel',
    description: 'Advanced cardiac risk assessment including inflammatory markers, lipoproteins, and genetic predisposition factors.',
    previewImage: 'https://picsum.photos/500/300?random=4',
    category: 'Cardiovascular Health',
    features: ['Advanced lipid profile (LDL-P)', 'Inflammatory markers', 'ApoB / Lp(a) analysis'],
    testType: 'blood',
    turnaroundTime: '48-72 hours',
    homeCollection: true,
    detailedInfo: {
      overview: 'Advanced cardiovascular risk assessment using cutting-edge biomarkers that provide deeper insight than traditional cholesterol testing alone.',
      whatItTests: ['LDL particle number and size', 'Apolipoprotein B and A1', 'Lipoprotein(a)', 'High-sensitivity CRP', 'Homocysteine', 'Fibrinogen'],
      preparation: 'Fast 9-12 hours before testing. Water permitted. Avoid alcohol 24 hours prior. Maintain regular medications unless instructed otherwise.',
      resultsInterpretation: 'Results stratify cardiovascular risk beyond traditional factors. Small, dense LDL particles and elevated inflammatory markers indicate higher risk.',
      clinicalRelevance: 'Advanced testing identifies individuals at risk who might be missed by standard cholesterol panels, enabling targeted prevention strategies.'
    }
  },
  {
    id: 'NBL_005',
    title: 'Congestive Heart Failure',
    description: 'Specialized testing for heart failure markers including BNP, troponins, and cardiac function indicators.',
    previewImage: 'https://picsum.photos/500/300?random=5',
    category: 'Cardiovascular Health',
    features: ['BNP/NT-proBNP', 'Cardiac troponins', 'Kidney function assessment'],
    testType: 'blood',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    detailedInfo: {
      overview: 'Comprehensive cardiac function assessment focusing on heart failure biomarkers and related organ system involvement.',
      whatItTests: ['NT-proBNP or BNP', 'High-sensitivity troponin', 'Creatinine and eGFR', 'Electrolytes (sodium, potassium)', 'Albumin and total protein'],
      preparation: 'No fasting required. Maintain regular medications. Inform lab of current diuretic use and recent hospitalizations.',
      resultsInterpretation: 'Elevated BNP/NT-proBNP indicates heart strain. Troponin levels suggest cardiac damage. Kidney function affects treatment options.',
      clinicalRelevance: 'Early detection and monitoring of heart failure enables timely intervention and improved outcomes. Biomarkers guide therapy decisions.'
    }
  },
  {
    id: 'NBL_006',
    title: 'Hemochromatosis Panel',
    description: 'Iron overload disorder testing including genetic markers and iron studies for early detection.',
    previewImage: 'https://picsum.photos/500/300?random=6',
    category: 'Genetic Testing',
    features: ['HFE gene mutations', 'Iron saturation studies', 'Ferritin levels'],
    testType: 'blood',
    turnaroundTime: '3-5 days',
    homeCollection: true,
    detailedInfo: {
      overview: 'Complete hemochromatosis evaluation combining genetic testing with iron metabolism assessment to diagnose hereditary iron overload.',
      whatItTests: ['HFE gene mutations (C282Y, H63D)', 'Serum iron and TIBC', 'Transferrin saturation', 'Serum ferritin', 'Complete blood count'],
      preparation: 'Fast 8-12 hours before testing. Avoid iron supplements for 24 hours. Take medications as usual unless otherwise directed.',
      resultsInterpretation: 'Genetic mutations combined with elevated iron stores confirm hereditary hemochromatosis. Early detection prevents organ damage.',
      clinicalRelevance: 'Untreated hemochromatosis can cause liver disease, diabetes, and heart problems. Genetic testing identifies at-risk family members.'
    }
  },
  {
    id: 'NBL_007',
    title: 'Low Iron / Anemia Panel',
    description: 'Comprehensive anemia workup including iron studies, B12, folate, and complete blood count analysis.',
    previewImage: 'https://picsum.photos/500/300?random=7',
    category: 'Blood Disorders',
    features: ['Complete iron studies', 'B12 and folate levels', 'CBC with differential'],
    testType: 'blood',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    detailedInfo: {
      overview: 'Comprehensive evaluation for anemia and iron deficiency, identifying underlying causes and guiding appropriate treatment strategies.',
      whatItTests: ['Complete blood count with differential', 'Serum iron, TIBC, ferritin', 'Vitamin B12 and folate', 'Reticulocyte count', 'Peripheral blood smear review'],
      preparation: 'No fasting required for most tests. Avoid iron supplements 24 hours before testing if possible. Maintain regular diet.',
      resultsInterpretation: 'Results identify anemia type and cause. Iron deficiency shows low ferritin and elevated TIBC. B12/folate deficiency causes macrocytic anemia.',
      clinicalRelevance: 'Proper anemia diagnosis ensures appropriate treatment. Iron deficiency may indicate bleeding sources requiring investigation.'
    }
  },
  {
    id: 'NBL_008',
    title: 'Cancer Screening Panel',
    description: 'Multi-cancer detection panel including tumor markers for liver, pancreas, prostate, breast, and ovarian cancers.',
    previewImage: 'https://picsum.photos/500/300?random=8',
    category: 'Cancer Detection',
    features: ['Multiple tumor markers', 'Early detection focus', 'Physician consultation included'],
    testType: 'blood',
    turnaroundTime: '48-72 hours',
    homeCollection: true,
    featured: true,
    detailedInfo: {
      overview: 'Comprehensive tumor marker panel for cancer screening and monitoring. Important note: tumor markers are supplementary to imaging and clinical evaluation.',
      whatItTests: ['PSA (prostate)', 'CA 125 (ovarian)', 'CA 19-9 (pancreatic/GI)', 'CA 15-3 (breast)', 'AFP and CEA (liver/colon)', 'Beta-hCG when indicated'],
      preparation: 'No special preparation required. Maintain regular medications. Inform lab of any recent infections or inflammatory conditions.',
      resultsInterpretation: 'Elevated markers may indicate cancer risk but require clinical correlation. False positives can occur with benign conditions.',
      clinicalRelevance: 'Early detection improves cancer outcomes. Regular monitoring in high-risk individuals enables timely intervention and treatment.'
    }
  },
  {
    id: 'NBL_009',
    title: 'DOT Employment Testing',
    description: 'Department of Transportation compliant drug testing including urine, saliva, and hair follicle options.',
    previewImage: 'https://picsum.photos/500/300?random=9',
    category: 'Employment Testing',
    features: ['DOT compliant', 'Multiple specimen types', 'Fast turnaround'],
    testType: 'comprehensive',
    turnaroundTime: '24-48 hours',
    homeCollection: false,
    detailedInfo: {
      overview: 'Federal DOT-compliant drug and alcohol testing for safety-sensitive transportation positions. Meets all regulatory requirements.',
      whatItTests: ['5-panel drug screen (marijuana, cocaine, amphetamines, opiates, PCP)', 'Alcohol testing when required', 'Adulterants and specimen validity', 'Chain of custody documentation'],
      preparation: 'Bring valid photo identification. Avoid excessive fluid intake. Remove outer clothing layers. Empty pockets of personal items.',
      resultsInterpretation: 'Positive results undergo confirmatory testing. Medical Review Officer reviews all positive results. Negative results reported directly.',
      clinicalRelevance: 'Ensures transportation safety through substance abuse detection. Required for commercial drivers and safety-sensitive positions.'
    }
  },
  {
    id: 'NBL_010',
    title: 'Quick Draw',
    description: 'Fast-track blood draw service for urgent testing needs with expedited processing and results.',
    previewImage: 'https://picsum.photos/500/300?random=10',
    category: 'Express Services',
    features: ['Same-day results', 'Priority processing', 'Mobile service available'],
    testType: 'blood',
    turnaroundTime: '4-6 hours',
    homeCollection: true,
    detailedInfo: {
      overview: 'Priority testing service for urgent medical needs requiring same-day results. Available for most routine blood tests.',
      whatItTests: ['Basic metabolic panel', 'Complete blood count', 'Liver function tests', 'Cardiac enzymes', 'Inflammatory markers', 'Hormone levels'],
      preparation: 'Preparation varies by test ordered. Fasting may be required for certain panels. Confirm requirements when scheduling.',
      resultsInterpretation: 'Results provided within 4-6 hours with immediate physician notification for critical values. Full reports available online.',
      clinicalRelevance: 'Rapid results enable timely medical decisions in urgent situations. Critical for emergency care and same-day appointments.'
    }
  },
  {
    id: 'NBL_011',
    title: 'Women\'s Wellness',
    description: 'Comprehensive wellness panel designed for women including hormone balance, nutritional status, and preventive health markers.',
    previewImage: 'https://picsum.photos/500/300?random=11',
    category: 'Wellness Testing',
    features: ['Comprehensive hormone panel', 'Nutritional assessment', 'Preventive health markers'],
    testType: 'blood',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    featured: true,
    detailedInfo: {
      overview: 'Comprehensive women\'s health assessment addressing hormonal balance, nutritional status, and key health markers across all life stages.',
      whatItTests: ['Estrogen, progesterone, testosterone', 'Thyroid function (TSH, Free T4)', 'Vitamin D, B12, folate', 'Iron studies and CBC', 'Lipid profile and glucose', 'DHEA-S and cortisol'],
      preparation: 'Fast 8-12 hours before testing. Schedule based on menstrual cycle if applicable (days 19-21 for cycling women). Maintain medications.',
      resultsInterpretation: 'Hormone levels vary by age and cycle phase. Nutritional deficiencies identified through vitamin and mineral levels. Risk factors assessed.',
      clinicalRelevance: 'Preventive health screening identifies modifiable risk factors. Hormonal insights guide treatment for symptoms and optimization.'
    }
  },
  {
    id: 'NBL_012',
    title: 'Men\'s Vitality',
    description: 'Male-focused health assessment including testosterone, prostate markers, cardiovascular risk, and energy metabolism.',
    previewImage: 'https://picsum.photos/500/300?random=12',
    category: 'Wellness Testing',
    features: ['Testosterone analysis', 'Prostate health markers', 'Energy metabolism'],
    testType: 'blood',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    featured: true,
    detailedInfo: {
      overview: 'Comprehensive men\'s health evaluation focusing on hormonal balance, prostate health, and cardiovascular risk assessment.',
      whatItTests: ['Total and free testosterone', 'PSA and prostate health index', 'Thyroid function', 'Vitamin D and B12', 'Lipid profile', 'HbA1c and glucose'],
      preparation: 'Fast 8-12 hours before testing. Schedule morning appointment for optimal hormone levels. Avoid intense exercise 24 hours prior.',
      resultsInterpretation: 'Testosterone levels decline with age. PSA screening for prostate health. Cardiovascular and diabetes risk assessment.',
      clinicalRelevance: 'Early detection of declining testosterone and health risks enables proactive intervention and optimization of male vitality.'
    }
  },
  {
    id: 'NBL_013',
    title: 'Bell\'s Palsy Panel',
    description: 'Diagnostic testing for Bell\'s Palsy including viral markers, inflammatory indicators, and neurological assessment markers.',
    previewImage: 'https://picsum.photos/500/300?random=13',
    category: 'Neurological Testing',
    features: ['Viral marker analysis', 'Inflammatory indicators', 'Neurological markers'],
    testType: 'blood',
    turnaroundTime: '48-72 hours',
    homeCollection: true,
    detailedInfo: {
      overview: 'Diagnostic evaluation for Bell\'s Palsy and related facial nerve disorders, identifying potential infectious and inflammatory causes.',
      whatItTests: ['Herpes simplex virus antibodies', 'Epstein-Barr virus markers', 'Lyme disease antibodies', 'Inflammatory markers (ESR, CRP)', 'Complete blood count'],
      preparation: 'No special preparation required. Provide recent symptom history and any exposure information to healthcare provider.',
      resultsInterpretation: 'Positive viral markers may indicate infectious cause. Elevated inflammatory markers suggest immune involvement. Results guide treatment decisions.',
      clinicalRelevance: 'Identifying underlying causes of facial paralysis enables targeted treatment and improves recovery outcomes.'
    }
  },
  {
    id: 'NBL_014',
    title: 'Cerebral Palsy Support',
    description: 'Comprehensive metabolic and nutritional testing to support cerebral palsy management and therapy optimization.',
    previewImage: 'https://picsum.photos/500/300?random=14',
    category: 'Neurological Testing',
    features: ['Metabolic assessment', 'Nutritional status', 'Therapy optimization markers'],
    testType: 'blood',
    turnaroundTime: '48-72 hours',
    homeCollection: true,
    detailedInfo: {
      overview: 'Specialized testing to optimize health and therapeutic outcomes for individuals with cerebral palsy through metabolic and nutritional assessment.',
      whatItTests: ['Comprehensive metabolic panel', 'Vitamin D, B12, folate', 'Trace elements (zinc, selenium)', 'Amino acid profile', 'Inflammatory markers', 'Bone metabolism markers'],
      preparation: 'Fast 8 hours if possible. Coordinate with caregivers for optimal collection conditions. Maintain regular medications.',
      resultsInterpretation: 'Nutritional deficiencies common in cerebral palsy. Metabolic abnormalities may affect seizure control and growth.',
      clinicalRelevance: 'Optimal nutrition and metabolic balance support neurological function, bone health, and overall quality of life.'
    }
  },
  {
    id: 'NBL_015',
    title: 'Testosterone Health',
    description: 'Complete testosterone evaluation including total, free, and bioavailable testosterone with supporting hormone analysis.',
    previewImage: 'https://picsum.photos/500/300?random=15',
    category: 'Hormone Testing',
    features: ['Total and free testosterone', 'SHBG analysis', 'Supporting hormones'],
    testType: 'blood',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    detailedInfo: {
      overview: 'Comprehensive testosterone assessment including bound and unbound fractions with supporting hormones that affect testosterone function.',
      whatItTests: ['Total testosterone', 'Free testosterone (calculated)', 'Sex hormone-binding globulin (SHBG)', 'LH and FSH', 'Estradiol', 'DHEA-S'],
      preparation: 'Schedule early morning appointment (7-10 AM) for peak levels. Fast 8 hours. Avoid alcohol and intense exercise 24 hours prior.',
      resultsInterpretation: 'Free testosterone represents bioactive hormone. SHBG affects testosterone availability. LH/FSH indicate pituitary function.',
      clinicalRelevance: 'Testosterone deficiency affects energy, mood, muscle mass, and sexual function. Comprehensive testing guides appropriate treatment.'
    }
  },
  {
    id: 'NBL_016',
    title: 'Prostate Health',
    description: 'Comprehensive prostate assessment including PSA variants, prostate health index, and inflammation markers.',
    previewImage: 'https://picsum.photos/500/300?random=16',
    category: 'Men\'s Health',
    features: ['PSA and variants', 'Prostate health index', 'Inflammation markers'],
    testType: 'blood',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    detailedInfo: {
      overview: 'Advanced prostate health assessment using multiple biomarkers to improve cancer detection accuracy and reduce unnecessary biopsies.',
      whatItTests: ['Total PSA and free PSA', 'Prostate health index (PHI)', 'PSA velocity calculation', 'Digital rectal exam correlation', 'Inflammatory markers'],
      preparation: 'Avoid ejaculation 48 hours before testing. No bike riding or intense exercise 48 hours prior. Delay testing if recent prostate manipulation.',
      resultsInterpretation: 'PSA levels increase with age and prostate size. Free PSA ratio and PHI improve cancer risk assessment.',
      clinicalRelevance: 'Early prostate cancer detection saves lives. Advanced testing reduces false positives and guides biopsy decisions.'
    }
  },
  {
    id: 'NBL_017',
    title: 'Women\'s Hormone Balance',
    description: 'Detailed female hormone analysis including estrogen, progesterone, FSH, LH, and thyroid function.',
    previewImage: 'https://picsum.photos/500/300?random=17',
    category: 'Hormone Testing',
    features: ['Complete estrogen panel', 'Progesterone analysis', 'FSH/LH evaluation'],
    testType: 'blood',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    detailedInfo: {
      overview: 'Comprehensive female hormone evaluation addressing reproductive health, menstrual irregularities, and menopausal transitions.',
      whatItTests: ['Estradiol and estrone', 'Progesterone', 'FSH and LH', 'Testosterone and DHEA-S', 'Thyroid function (TSH, Free T4)', 'Prolactin'],
      preparation: 'Time testing based on menstrual cycle. Days 19-21 for cycling women, any time for postmenopausal. Fast not required.',
      resultsInterpretation: 'Hormone levels vary throughout menstrual cycle. FSH/LH ratios indicate ovarian function. Results guide treatment decisions.',
      clinicalRelevance: 'Hormone imbalances affect fertility, mood, energy, and overall health. Proper testing enables targeted treatment approaches.'
    }
  },
  {
    id: 'NBL_018',
    title: 'Rett Syndrome Care Panel',
    description: 'Ongoing monitoring panel for Rett Syndrome patients including metabolic markers and developmental indicators.',
    previewImage: 'https://picsum.photos/500/300?random=18',
    category: 'Genetic Testing',
    features: ['Metabolic monitoring', 'Developmental markers', 'Therapy effectiveness tracking'],
    frequency: 'Every 6 months',
    testType: 'blood',
    turnaroundTime: '48-72 hours',
    homeCollection: true,
    detailedInfo: {
      overview: 'Specialized monitoring panel for ongoing Rett Syndrome care, tracking metabolic status and treatment effectiveness every 6 months.',
      whatItTests: ['Comprehensive metabolic panel', 'Liver function tests', 'Lipid profile', 'Vitamin D and B12', 'Inflammatory markers', 'Growth factors'],
      preparation: 'Fast 8 hours if tolerated. Coordinate with caregivers and medical team. Maintain seizure medications and supplements.',
      resultsInterpretation: 'Monitor for metabolic complications of Rett syndrome. Drug levels and nutritional status guide therapeutic adjustments.',
      clinicalRelevance: 'Regular monitoring prevents complications and optimizes treatment outcomes in Rett syndrome patients.'
    }
  }
]

export const SERVICE_CATEGORIES = [
  'All Services',
  'Cardiovascular Health', 
  'Genetic Testing',
  'Hormone Testing',
  'Cancer Detection',
  'Employment Testing',
  'Wellness Testing',
  'Blood Disorders',
  'Express Services',
  'Neurological Testing',
  'Men\'s Health'
]

export const FEATURED_SERVICES = SERVICES_EXPLORER_SAMPLE_DATA.filter(service => service.featured)

export const SERVICES_BY_CATEGORY: Record<string, TestService[]> = SERVICE_CATEGORIES.reduce((acc, category) => {
  if (category === 'All Services') return acc
  acc[category] = SERVICES_EXPLORER_SAMPLE_DATA.filter(service => service.category === category)
  return acc
}, {} as Record<string, TestService[]>)