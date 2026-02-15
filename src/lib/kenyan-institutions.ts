export type InstitutionTier = "top" | "mid" | "tvet" | "professional" | "other";

export interface KenyanInstitution {
  name: string;
  aliases: string[];
  tier: InstitutionTier;
  type: "university" | "tvet" | "professional_body" | "college";
}

export const KENYAN_INSTITUTIONS: KenyanInstitution[] = [
  // === TOP TIER UNIVERSITIES ===
  {
    name: "University of Nairobi",
    aliases: ["UoN", "Nairobi University", "U of Nairobi"],
    tier: "top",
    type: "university",
  },
  {
    name: "Kenyatta University",
    aliases: ["KU", "Kenyatta Uni"],
    tier: "top",
    type: "university",
  },
  {
    name: "Jomo Kenyatta University of Agriculture and Technology",
    aliases: ["JKUAT", "Jomo Kenyatta", "JKUAT Main"],
    tier: "top",
    type: "university",
  },
  {
    name: "Strathmore University",
    aliases: ["Strathmore", "Strath"],
    tier: "top",
    type: "university",
  },
  {
    name: "United States International University - Africa",
    aliases: ["USIU", "USIU-Africa", "USIU Africa"],
    tier: "top",
    type: "university",
  },
  {
    name: "Moi University",
    aliases: ["Moi Uni", "MU Eldoret"],
    tier: "top",
    type: "university",
  },
  {
    name: "Egerton University",
    aliases: ["Egerton", "Egerton Uni"],
    tier: "top",
    type: "university",
  },
  {
    name: "University of Eldoret",
    aliases: ["UoE", "Eldoret University"],
    tier: "top",
    type: "university",
  },

  // === MID TIER UNIVERSITIES ===
  {
    name: "Maseno University",
    aliases: ["Maseno", "Maseno Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Dedan Kimathi University of Technology",
    aliases: ["DeKUT", "Dedan Kimathi", "Kimathi University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Technical University of Kenya",
    aliases: ["TUK", "TU Kenya", "Technical Uni Kenya"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Technical University of Mombasa",
    aliases: ["TUM", "TU Mombasa"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Multimedia University of Kenya",
    aliases: ["MMU", "Multimedia University", "Multimedia Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "KCA University",
    aliases: ["KCA", "KCAU", "KCA Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Mount Kenya University",
    aliases: ["MKU", "Mt Kenya", "Mount Kenya Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Daystar University",
    aliases: ["Daystar", "Daystar Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Africa Nazarene University",
    aliases: ["ANU", "Nazarene University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Catholic University of Eastern Africa",
    aliases: ["CUEA", "Catholic University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Pan Africa Christian University",
    aliases: ["PAC University", "PACU", "Pan Africa Christian"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Kabarak University",
    aliases: ["Kabarak", "Kabarak Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Chuka University",
    aliases: ["Chuka", "Chuka Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Laikipia University",
    aliases: ["Laikipia", "Laikipia Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Masinde Muliro University of Science and Technology",
    aliases: ["MMUST", "Masinde Muliro"],
    tier: "mid",
    type: "university",
  },
  {
    name: "South Eastern Kenya University",
    aliases: ["SEKU", "South Eastern Kenya"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Pwani University",
    aliases: ["Pwani", "Pwani Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Karatina University",
    aliases: ["Karatina", "Karatina Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Jaramogi Oginga Odinga University of Science and Technology",
    aliases: ["JOOUST", "Jaramogi Oginga Odinga"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Kirinyaga University",
    aliases: ["Kirinyaga", "KyU"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Murang'a University of Technology",
    aliases: ["MUT", "Murang'a University", "Muranga University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Machakos University",
    aliases: ["Machakos", "Machakos Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Cooperative University of Kenya",
    aliases: ["CUK", "Cooperative University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Taita Taveta University",
    aliases: ["TTU", "Taita Taveta"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Garissa University",
    aliases: ["Garissa", "Garissa Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Rongo University",
    aliases: ["Rongo", "Rongo Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "University of Embu",
    aliases: ["UoEm", "Embu University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "University of Kabianga",
    aliases: ["UoK", "Kabianga University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Kibabii University",
    aliases: ["KIBU", "Kibabii"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Tharaka University",
    aliases: ["Tharaka", "Tharaka Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Bomet University College",
    aliases: ["Bomet UC", "Bomet University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Zetech University",
    aliases: ["Zetech", "Zetech Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Riara University",
    aliases: ["Riara", "Riara Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Scott Christian University",
    aliases: ["Scott Christian", "SCU"],
    tier: "mid",
    type: "university",
  },
  {
    name: "St. Paul's University",
    aliases: ["St Paul's", "SPU", "St Pauls University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Kenya Methodist University",
    aliases: ["KeMU", "Kenya Methodist"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Adventist University of Africa",
    aliases: ["AUA", "Adventist University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Management University of Africa",
    aliases: ["MUA", "Management University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Umma University",
    aliases: ["Umma", "Umma Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Lukenya University",
    aliases: ["Lukenya", "Lukenya Uni"],
    tier: "mid",
    type: "university",
  },
  {
    name: "Pioneer International University",
    aliases: ["Pioneer", "Pioneer University"],
    tier: "mid",
    type: "university",
  },
  {
    name: "The East African University",
    aliases: ["EAU", "East African University"],
    tier: "mid",
    type: "university",
  },

  // === TVET INSTITUTIONS ===
  {
    name: "Kenya Polytechnic University College",
    aliases: ["Kenya Polytechnic", "Kenya Poly"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Mombasa Polytechnic University College",
    aliases: ["Mombasa Polytechnic", "Mombasa Poly"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Eldoret National Polytechnic",
    aliases: ["Eldoret Polytechnic", "Eldoret Poly"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Kisumu National Polytechnic",
    aliases: ["Kisumu Polytechnic", "Kisumu Poly"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Nyeri National Polytechnic",
    aliases: ["Nyeri Polytechnic", "Nyeri Poly"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Kabete National Polytechnic",
    aliases: ["Kabete Polytechnic", "Kabete Poly"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Kenya Institute of Management",
    aliases: ["KIM"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Kenya Institute of Business Training",
    aliases: ["KIBT"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "National Industrial Training Authority",
    aliases: ["NITA"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Kenya Medical Training College",
    aliases: ["KMTC"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Kenya Wildlife Service Training Institute",
    aliases: ["KWSTI", "KWS Training"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Kenya Institute of Highways and Building Technology",
    aliases: ["KIHBT"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Rift Valley Technical Training Institute",
    aliases: ["RVTTI", "Rift Valley TTI"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Thika Technical Training Institute",
    aliases: ["Thika TTI", "Thika Technical"],
    tier: "tvet",
    type: "tvet",
  },
  {
    name: "Kiambu Institute of Science and Technology",
    aliases: ["KIST Kiambu"],
    tier: "tvet",
    type: "tvet",
  },

  // === PROFESSIONAL BODIES ===
  {
    name: "Kenya Accountants and Secretaries National Examinations Board",
    aliases: ["KASNEB"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Institute of Certified Public Accountants of Kenya",
    aliases: ["ICPAK", "CPA Kenya"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Law Society of Kenya",
    aliases: ["LSK"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Kenya School of Law",
    aliases: ["KSL"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Kenya Medical Practitioners and Dentists Council",
    aliases: ["KMPDC", "Kenya Medical Board"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Nursing Council of Kenya",
    aliases: ["NCK"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Engineers Board of Kenya",
    aliases: ["EBK"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Institute of Human Resource Management",
    aliases: ["IHRM", "IHRM Kenya"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Kenya Institute of Supplies Management",
    aliases: ["KISM"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Chartered Institute of Arbitrators Kenya",
    aliases: ["CIArb Kenya"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Marketing Society of Kenya",
    aliases: ["MSK"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Institute of Certified Investment and Financial Analysts",
    aliases: ["ICIFA"],
    tier: "professional",
    type: "professional_body",
  },
  {
    name: "Computer Society of Kenya",
    aliases: ["CSK"],
    tier: "professional",
    type: "professional_body",
  },
];

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export interface InstitutionMatch {
  institution: KenyanInstitution;
  confidence: number;
  matchedOn: string;
}

export function matchKenyanInstitution(
  input: string
): InstitutionMatch | null {
  const normalized = normalize(input);
  if (!normalized) return null;

  let bestMatch: InstitutionMatch | null = null;

  for (const inst of KENYAN_INSTITUTIONS) {
    const candidates = [inst.name, ...inst.aliases];
    for (const candidate of candidates) {
      const normalizedCandidate = normalize(candidate);

      // Exact match
      if (normalized === normalizedCandidate) {
        return { institution: inst, confidence: 1.0, matchedOn: candidate };
      }

      // Contains match
      if (
        normalized.includes(normalizedCandidate) ||
        normalizedCandidate.includes(normalized)
      ) {
        const confidence = 0.9;
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { institution: inst, confidence, matchedOn: candidate };
        }
        continue;
      }

      // Fuzzy match using Levenshtein distance
      const maxLen = Math.max(normalized.length, normalizedCandidate.length);
      if (maxLen === 0) continue;
      const distance = levenshtein(normalized, normalizedCandidate);
      const similarity = 1 - distance / maxLen;

      if (similarity >= 0.75) {
        if (!bestMatch || similarity > bestMatch.confidence) {
          bestMatch = {
            institution: inst,
            confidence: similarity,
            matchedOn: candidate,
          };
        }
      }
    }
  }

  return bestMatch;
}

export function findAllKenyanInstitutions(
  text: string
): InstitutionMatch[] {
  const matches: InstitutionMatch[] = [];
  const seen = new Set<string>();

  for (const inst of KENYAN_INSTITUTIONS) {
    const candidates = [inst.name, ...inst.aliases];
    for (const candidate of candidates) {
      const normalizedCandidate = normalize(candidate);
      if (normalizedCandidate.length < 3) continue;

      const regex = new RegExp(
        normalizedCandidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      if (regex.test(normalize(text)) && !seen.has(inst.name)) {
        seen.add(inst.name);
        matches.push({
          institution: inst,
          confidence: 0.95,
          matchedOn: candidate,
        });
      }
    }
  }

  return matches;
}

export function getTierLabel(tier: InstitutionTier): string {
  switch (tier) {
    case "top":
      return "Top Tier University";
    case "mid":
      return "University";
    case "tvet":
      return "TVET Institution";
    case "professional":
      return "Professional Body";
    default:
      return "Other Institution";
  }
}

export function getTierColor(tier: InstitutionTier): string {
  switch (tier) {
    case "top":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    case "mid":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "tvet":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    case "professional":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}
