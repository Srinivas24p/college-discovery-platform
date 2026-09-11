import { PrismaClient, CollegeOwnership, DegreeLevel } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in environment.");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface SeedLocation {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface SeedCourse {
  name: string;
  degree: DegreeLevel;
  specialization?: string;
  durationYears: number;
  annualTuitionFee: number;
  totalSeats: number;
  eligibilityCriteria: string;
  cutoffs: {
    examName: string;
    academicYear: number;
    round: number;
    category: string;
    quota: string;
    openingRank: number;
    closingRank: number;
  }[];
}

interface SeedPlacement {
  academicYear: string;
  highestPackageLPA: number;
  averagePackageLPA: number;
  medianPackageLPA: number;
  placementPercentage: number;
  totalOffers: number;
  topRecruiters: string[];
}

interface SeedReview {
  authorName: string;
  authorRole: string;
  rating: number;
  title: string;
  comment: string;
  pros: string;
  cons: string;
  campusLifeRating: number;
  infrastructureRating: number;
  facultyRating: number;
  placementRating: number;
}

interface SeedCollege {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  overview: string;
  establishedYear: number;
  ownership: CollegeOwnership;
  campusSizeAcres: number;
  website: string;
  email: string;
  phone: string;
  rating: number;
  reviewCount: number;
  nirfRanking: number;
  naacGrade: string;
  minAnnualFee: number;
  maxAnnualFee: number;
  location: SeedLocation;
  courses: SeedCourse[];
  placements: SeedPlacement[];
  reviews: SeedReview[];
}

const collegesData: SeedCollege[] = [
  {
    name: "Indian Institute of Technology Bombay",
    slug: "iit-bombay",
    tagline: "Knowledge is the Supreme Goal",
    description:
      "IIT Bombay is an autonomous public engineering and research institution located in Powai, Mumbai. Renowned globally for academic excellence, cutting-edge innovation, and elite alumni network.",
    overview:
      "Established in 1958 with assistance from UNESCO and the Soviet Union, IIT Bombay consistently ranks among the top engineering institutions in India and the world. The lush 545-acre Powai campus blends academic rigor with vibrant campus culture like Mood Indigo and Techfest.",
    establishedYear: 1958,
    ownership: CollegeOwnership.PUBLIC,
    campusSizeAcres: 545,
    website: "https://www.iitb.ac.in",
    email: "admissions@iitb.ac.in",
    phone: "+91-22-2572-2545",
    rating: 4.8,
    reviewCount: 42,
    nirfRanking: 3,
    naacGrade: "A++",
    minAnnualFee: 220000,
    maxAnnualFee: 260000,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      latitude: 19.1334,
      longitude: 72.9133,
    },
    courses: [
      {
        name: "B.Tech Computer Science and Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "Artificial Intelligence & Systems",
        durationYears: 4,
        annualTuitionFee: 225000,
        totalSeats: 180,
        eligibilityCriteria: "Top ranks in JEE Advanced with 75% in Class 12th Board",
        cutoffs: [
          {
            examName: "JEE Advanced",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 1,
            closingRank: 68,
          },
          {
            examName: "JEE Advanced",
            academicYear: 2024,
            round: 1,
            category: "OBC-NCL",
            quota: "All India",
            openingRank: 10,
            closingRank: 52,
          },
          {
            examName: "JEE Advanced",
            academicYear: 2024,
            round: 1,
            category: "EWS",
            quota: "All India",
            openingRank: 4,
            closingRank: 22,
          },
        ],
      },
      {
        name: "B.Tech Electrical Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "Microelectronics and Signal Processing",
        durationYears: 4,
        annualTuitionFee: 225000,
        totalSeats: 120,
        eligibilityCriteria: "JEE Advanced rank within cutoff",
        cutoffs: [
          {
            examName: "JEE Advanced",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 80,
            closingRank: 460,
          },
          {
            examName: "JEE Advanced",
            academicYear: 2024,
            round: 1,
            category: "OBC-NCL",
            quota: "All India",
            openingRank: 120,
            closingRank: 310,
          },
        ],
      },
      {
        name: "B.Tech Mechanical Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "Robotics and Thermal Engineering",
        durationYears: 4,
        annualTuitionFee: 225000,
        totalSeats: 150,
        eligibilityCriteria: "JEE Advanced qualified",
        cutoffs: [
          {
            examName: "JEE Advanced",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 500,
            closingRank: 1750,
          },
        ],
      },
    ],
    placements: [
      {
        academicYear: "2023-2024",
        highestPackageLPA: 168.0,
        averagePackageLPA: 23.5,
        medianPackageLPA: 19.2,
        placementPercentage: 92.4,
        totalOffers: 1475,
        topRecruiters: [
          "Google",
          "Microsoft",
          "Apple",
          "Qualcomm",
          "Texas Instruments",
          "Goldman Sachs",
          "Jane Street",
        ],
      },
    ],
    reviews: [
      {
        authorName: "Rohan Kulkarni",
        authorRole: "Student, B.Tech CSE (Class of 2025)",
        rating: 5.0,
        title: "Unmatched Peer Group and Limitless Opportunities",
        comment:
          "IIT Bombay provides an unbeatable ecosystem. From world-class laboratory facilities to unmatched hostel life right by Powai lake, the atmosphere urges you to push your boundaries constantly.",
        pros: "Top professors, global alumni network, vibrant fests (Mood Indigo), superb placements.",
        cons: "Academic grading is fiercely competitive; high expectations can be stressful.",
        campusLifeRating: 4.9,
        infrastructureRating: 4.8,
        facultyRating: 4.7,
        placementRating: 5.0,
      },
      {
        authorName: "Ananya Sharma",
        authorRole: "Alumna, Electrical Engineering (Class of 2023)",
        rating: 4.6,
        title: "Rigorous curriculum with fantastic industry ties",
        comment:
          "The electrical curriculum is challenging but lays an incredible foundation for higher studies and R&D roles alike.",
        pros: "Access to top semiconductor labs and research fellowships.",
        cons: "Hostel rooms in older wings need periodic maintenance.",
        campusLifeRating: 4.5,
        infrastructureRating: 4.4,
        facultyRating: 4.8,
        placementRating: 4.9,
      },
    ],
  },
  {
    name: "Indian Institute of Technology Delhi",
    slug: "iit-delhi",
    tagline: "Dedicated to the Service of the Nation",
    description:
      "IIT Delhi is one of India's pre-eminent public institutes of national importance, located in Hauz Khas, New Delhi. Famous for entrepreneurship and scientific research.",
    overview:
      "Spread across 320 acres in South Delhi, IIT Delhi is situated right at the heart of India's startup and technological nerve center. It boasts an incubator ecosystem that has fostered dozens of unicorns and major research breakthroughs.",
    establishedYear: 1961,
    ownership: CollegeOwnership.PUBLIC,
    campusSizeAcres: 320,
    website: "https://home.iitd.ac.in",
    email: "deanac@admin.iitd.ac.in",
    phone: "+91-11-2659-7135",
    rating: 4.7,
    reviewCount: 38,
    nirfRanking: 2,
    naacGrade: "A++",
    minAnnualFee: 215000,
    maxAnnualFee: 255000,
    location: {
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      latitude: 28.545,
      longitude: 77.1926,
    },
    courses: [
      {
        name: "B.Tech Computer Science and Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "Theory of Computing & AI",
        durationYears: 4,
        annualTuitionFee: 220000,
        totalSeats: 140,
        eligibilityCriteria: "JEE Advanced top percentile",
        cutoffs: [
          {
            examName: "JEE Advanced",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 15,
            closingRank: 115,
          },
          {
            examName: "JEE Advanced",
            academicYear: 2024,
            round: 1,
            category: "OBC-NCL",
            quota: "All India",
            openingRank: 35,
            closingRank: 88,
          },
        ],
      },
      {
        name: "B.Tech Mathematics and Computing",
        degree: DegreeLevel.B_TECH,
        specialization: "Fintech & Algorithmic Trading",
        durationYears: 4,
        annualTuitionFee: 220000,
        totalSeats: 80,
        eligibilityCriteria: "JEE Advanced qualified",
        cutoffs: [
          {
            examName: "JEE Advanced",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 120,
            closingRank: 380,
          },
        ],
      },
    ],
    placements: [
      {
        academicYear: "2023-2024",
        highestPackageLPA: 190.0,
        averagePackageLPA: 24.1,
        medianPackageLPA: 20.0,
        placementPercentage: 91.8,
        totalOffers: 1350,
        topRecruiters: [
          "Microsoft",
          "Google",
          "Optiver",
          "Tower Research",
          "Uber",
          "McKinsey & Company",
        ],
      },
    ],
    reviews: [
      {
        authorName: "Divyansh Mehta",
        authorRole: "Student, B.Tech MnC (Class of 2026)",
        rating: 4.8,
        title: "Capital location and vibrant startup spirit",
        comment:
          "Being in Delhi gives an immense advantage for networking, conferences, and startup funding. The quantitative finance culture here is among the best in Asia.",
        pros: "Location advantage, high quantitative placement packages, active clubs.",
        cons: "Air quality during winter months in Delhi.",
        campusLifeRating: 4.6,
        infrastructureRating: 4.7,
        facultyRating: 4.8,
        placementRating: 4.9,
      },
    ],
  },
  {
    name: "Birla Institute of Technology and Science Pilani",
    slug: "bits-pilani",
    tagline: "Knowledge is Supreme Divinity",
    description:
      "BITS Pilani is an all-India institute for higher education and a deemed university under Section 3 of the UGC Act. Known for zero-attendance policy and stellar meritocracy.",
    overview:
      "Founded by the visionary industrialist G.D. Birla, BITS Pilani is famous for its Practice School (PS) industry internship program and a culture of radical student autonomy, including flexible academic choices and dual-degree programs.",
    establishedYear: 1964,
    ownership: CollegeOwnership.DEEMED,
    campusSizeAcres: 328,
    website: "https://www.bits-pilani.ac.in",
    email: "admissions@pilani.bits-pilani.ac.in",
    phone: "+91-1596-242210",
    rating: 4.6,
    reviewCount: 35,
    nirfRanking: 20,
    naacGrade: "A",
    minAnnualFee: 540000,
    maxAnnualFee: 590000,
    location: {
      city: "Pilani",
      state: "Rajasthan",
      country: "India",
      latitude: 28.3639,
      longitude: 75.587,
    },
    courses: [
      {
        name: "B.E. Computer Science",
        degree: DegreeLevel.B_TECH,
        specialization: "Software Architecture & Cloud Systems",
        durationYears: 4,
        annualTuitionFee: 565000,
        totalSeats: 220,
        eligibilityCriteria: "BITSAT exam score + 75% aggregate in PCM in Class 12",
        cutoffs: [
          {
            examName: "BITSAT",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 1,
            closingRank: 335,
          },
        ],
      },
      {
        name: "B.E. Electronics and Instrumentation",
        degree: DegreeLevel.B_TECH,
        specialization: "Embedded Systems & IoT",
        durationYears: 4,
        annualTuitionFee: 565000,
        totalSeats: 110,
        eligibilityCriteria: "BITSAT score",
        cutoffs: [
          {
            examName: "BITSAT",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 340,
            closingRank: 275,
          },
        ],
      },
    ],
    placements: [
      {
        academicYear: "2023-2024",
        highestPackageLPA: 60.75,
        averagePackageLPA: 19.8,
        medianPackageLPA: 17.0,
        placementPercentage: 89.6,
        totalOffers: 1100,
        topRecruiters: [
          "Amazon",
          "Microsoft",
          "Cisco",
          "Oracle",
          "JPMorgan Chase",
          "Qualcomm",
        ],
      },
    ],
    reviews: [
      {
        authorName: "Siddharth Verma",
        authorRole: "Student, B.E. CS (Class of 2025)",
        rating: 4.7,
        title: "Zero attendance policy promotes genuine self-growth",
        comment:
          "The freedom you receive at BITS is unmatched. You can build projects, participate in hackathons, or pursue sports without mandatory classroom attendance, provided you perform in exams.",
        pros: "Practice School internship for everyone, zero attendance policy, strong alumni.",
        cons: "Tuition fees are noticeably high compared to government institutions.",
        campusLifeRating: 4.8,
        infrastructureRating: 4.6,
        facultyRating: 4.4,
        placementRating: 4.7,
      },
    ],
  },
  {
    name: "National Institute of Technology Tiruchirappalli",
    slug: "nit-trichy",
    tagline: "Truth Alone Triumphs",
    description:
      "NIT Trichy is an institute of national importance and arguably the highest-ranked NIT in India. Renowned for rigorous engineering education and stellar placement records.",
    overview:
      "Located in Tamil Nadu, NIT Trichy spreads over a massive 800-acre self-contained campus. It admits through JEE Main and draws students from all 28 states and union territories, creating a truly pan-Indian student collective.",
    establishedYear: 1964,
    ownership: CollegeOwnership.PUBLIC,
    campusSizeAcres: 800,
    website: "https://www.nitt.edu",
    email: "deanac@nitt.edu",
    phone: "+91-431-250-3000",
    rating: 4.5,
    reviewCount: 30,
    nirfRanking: 9,
    naacGrade: "A++",
    minAnnualFee: 145000,
    maxAnnualFee: 175000,
    location: {
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      country: "India",
      latitude: 10.761,
      longitude: 78.8139,
    },
    courses: [
      {
        name: "B.Tech Computer Science and Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "Distributed Computing & Cyber Security",
        durationYears: 4,
        annualTuitionFee: 155000,
        totalSeats: 120,
        eligibilityCriteria: "JEE Main All India Rank through JoSAA counseling",
        cutoffs: [
          {
            examName: "JEE Main",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "Other State",
            openingRank: 750,
            closingRank: 1650,
          },
          {
            examName: "JEE Main",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "Home State",
            openingRank: 1200,
            closingRank: 4200,
          },
          {
            examName: "JEE Main",
            academicYear: 2024,
            round: 1,
            category: "OBC-NCL",
            quota: "Other State",
            openingRank: 400,
            closingRank: 950,
          },
        ],
      },
      {
        name: "B.Tech Electronics and Communication Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "VLSI and Communication Systems",
        durationYears: 4,
        annualTuitionFee: 155000,
        totalSeats: 110,
        eligibilityCriteria: "JEE Main rank through JoSAA",
        cutoffs: [
          {
            examName: "JEE Main",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "Other State",
            openingRank: 1800,
            closingRank: 4500,
          },
        ],
      },
    ],
    placements: [
      {
        academicYear: "2023-2024",
        highestPackageLPA: 52.89,
        averagePackageLPA: 16.5,
        medianPackageLPA: 14.2,
        placementPercentage: 90.8,
        totalOffers: 1220,
        topRecruiters: [
          "Amazon",
          "Morgan Stanley",
          "Texas Instruments",
          "Cisco",
          "Tata Motors",
          "L&T",
        ],
      },
    ],
    reviews: [
      {
        authorName: "Karthik Raja",
        authorRole: "Student, B.Tech ECE (Class of 2025)",
        rating: 4.5,
        title: "Premier technical institute with great return on investment",
        comment:
          "NIT Trichy has very affordable government subsidized tuition fees paired with phenomenal campus placement opportunities. The diverse culture is a lifetime experience.",
        pros: "Very affordable fees, top rank among NITs, excellent labs.",
        cons: "Weather can get intensely hot during summer months.",
        campusLifeRating: 4.3,
        infrastructureRating: 4.4,
        facultyRating: 4.6,
        placementRating: 4.8,
      },
    ],
  },
  {
    name: "International Institute of Information Technology Hyderabad",
    slug: "iiit-hyderabad",
    tagline: "Where Research Translates into Innovation",
    description:
      "IIIT Hyderabad is an autonomous university set up in public-private partnership. World-renowned for artificial intelligence, computer vision, natural language processing, and competitive programming.",
    overview:
      "Located in Gachibowli, Hyderabad's IT corridor, IIIT-H is celebrated for its deep research culture that begins right from the undergraduate years. It regularly sends teams to the ACM-ICPC World Finals and produces top AI researchers.",
    establishedYear: 1998,
    ownership: CollegeOwnership.AUTONOMOUS,
    campusSizeAcres: 66,
    website: "https://www.iiit.ac.in",
    email: "admissions@iiit.ac.in",
    phone: "+91-40-6653-1000",
    rating: 4.9,
    reviewCount: 29,
    nirfRanking: 55,
    naacGrade: "A++",
    minAnnualFee: 380000,
    maxAnnualFee: 420000,
    location: {
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      latitude: 17.4455,
      longitude: 78.3489,
    },
    courses: [
      {
        name: "B.Tech Computer Science and Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "Artificial Intelligence, Data Science & Systems",
        durationYears: 4,
        annualTuitionFee: 400000,
        totalSeats: 150,
        eligibilityCriteria: "JEE Main percentile / UGEE entrance exam",
        cutoffs: [
          {
            examName: "JEE Main",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 250,
            closingRank: 1200,
          },
        ],
      },
      {
        name: "B.Tech Electronics and Communication Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "Robotics and Embedded Computing",
        durationYears: 4,
        annualTuitionFee: 400000,
        totalSeats: 90,
        eligibilityCriteria: "JEE Main percentile / UGEE",
        cutoffs: [
          {
            examName: "JEE Main",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 1250,
            closingRank: 3850,
          },
        ],
      },
    ],
    placements: [
      {
        academicYear: "2023-2024",
        highestPackageLPA: 102.0,
        averagePackageLPA: 30.2,
        medianPackageLPA: 28.0,
        placementPercentage: 98.2,
        totalOffers: 420,
        topRecruiters: [
          "Google",
          "Apple",
          "Facebook/Meta",
          "Uber",
          "NVIDIA",
          "Bloomberg",
          "De Shaw",
        ],
      },
    ],
    reviews: [
      {
        authorName: "Srikar Reddy",
        authorRole: "Student, B.Tech CSE (Class of 2025)",
        rating: 4.9,
        title: "Coding paradise with highest average engineering package",
        comment:
          "If you want to excel in computer science, there is no better place in India. Undergraduates publish papers at CVPR and ACL, and almost everyone gets exceptional placement packages.",
        pros: "Phenomenal computer science curriculum, average package over 30 LPA, high research focus.",
        cons: "Intense workload; limited non-tech extracurricular activities compared to older IITs.",
        campusLifeRating: 4.1,
        infrastructureRating: 4.8,
        facultyRating: 5.0,
        placementRating: 5.0,
      },
    ],
  },
  {
    name: "Delhi Technological University",
    slug: "dtu-delhi",
    tagline: "Explore, Discover, Implement",
    description:
      "Formerly known as Delhi College of Engineering (DCE), DTU is a premier state engineering university in Rohini, Delhi. Famous for automotive design teams and tech hubs.",
    overview:
      "Founded in 1941, DTU has an illustrious legacy of producing captains of industry. Its 164-acre campus in North-West Delhi houses modern laboratories, student racing teams like Defianz Racing, and an active entrepreneurial community.",
    establishedYear: 1941,
    ownership: CollegeOwnership.PUBLIC,
    campusSizeAcres: 164,
    website: "https://www.dtu.ac.in",
    email: "registrar@dtu.ac.in",
    phone: "+91-11-2787-1018",
    rating: 4.4,
    reviewCount: 33,
    nirfRanking: 29,
    naacGrade: "A",
    minAnnualFee: 190000,
    maxAnnualFee: 225000,
    location: {
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      latitude: 28.7501,
      longitude: 77.1177,
    },
    courses: [
      {
        name: "B.Tech Computer Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "Software Systems & Cloud Computing",
        durationYears: 4,
        annualTuitionFee: 210000,
        totalSeats: 240,
        eligibilityCriteria: "JEE Main rank through JAC Delhi counseling",
        cutoffs: [
          {
            examName: "JEE Main",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "Delhi",
            openingRank: 1500,
            closingRank: 6500,
          },
          {
            examName: "JEE Main",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "Outside Delhi",
            openingRank: 800,
            closingRank: 2400,
          },
        ],
      },
      {
        name: "B.Tech Information Technology",
        degree: DegreeLevel.B_TECH,
        specialization: "Information Security & Web Tech",
        durationYears: 4,
        annualTuitionFee: 210000,
        totalSeats: 180,
        eligibilityCriteria: "JEE Main through JAC Delhi",
        cutoffs: [
          {
            examName: "JEE Main",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "Delhi",
            openingRank: 4500,
            closingRank: 11000,
          },
        ],
      },
    ],
    placements: [
      {
        academicYear: "2023-2024",
        highestPackageLPA: 82.5,
        averagePackageLPA: 15.6,
        medianPackageLPA: 13.0,
        placementPercentage: 88.5,
        totalOffers: 1650,
        topRecruiters: [
          "Adobe",
          "Amazon",
          "Google",
          "Samsung",
          "Deloitte",
          "PwC",
        ],
      },
    ],
    reviews: [
      {
        authorName: "Tanmay Bansal",
        authorRole: "Student, B.Tech IT (Class of 2025)",
        rating: 4.4,
        title: "Rich heritage and active technical societies",
        comment:
          "DTU provides good industry exposure in the Delhi NCR region. Societies like IEEE DTU and SAE collegiate chapters give hands-on practical experience.",
        pros: "Huge batch placements, relaxed attendance policies, rich alumni backing.",
        cons: "Large batch sizes mean more competition during campus placement drives.",
        campusLifeRating: 4.3,
        infrastructureRating: 4.2,
        facultyRating: 4.1,
        placementRating: 4.7,
      },
    ],
  },
  {
    name: "Vellore Institute of Technology",
    slug: "vit-vellore",
    tagline: "A Place to Learn, A Chance to Grow",
    description:
      "VIT Vellore is one of India's top-ranked private institutions. Renowned for its Fully Flexible Credit System (FFCS), modern smart classrooms, and colossal placement statistics.",
    overview:
      "Spanning over 372 acres in Vellore, Tamil Nadu, VIT features students from all Indian states and over 50 countries. The FFCS enables students to choose their courses, professors, and timetable slot allocations.",
    establishedYear: 1984,
    ownership: CollegeOwnership.PRIVATE,
    campusSizeAcres: 372,
    website: "https://vit.ac.in",
    email: "admission@vit.ac.in",
    phone: "+91-416-224-3091",
    rating: 4.3,
    reviewCount: 45,
    nirfRanking: 11,
    naacGrade: "A++",
    minAnnualFee: 198000,
    maxAnnualFee: 490000,
    location: {
      city: "Vellore",
      state: "Tamil Nadu",
      country: "India",
      latitude: 12.9692,
      longitude: 79.1559,
    },
    courses: [
      {
        name: "B.Tech Computer Science and Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "Software Engineering & Full Stack",
        durationYears: 4,
        annualTuitionFee: 198000,
        totalSeats: 600,
        eligibilityCriteria: "VITEEE entrance exam rank category 1 to 5",
        cutoffs: [
          {
            examName: "VITEEE",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 1,
            closingRank: 7500,
          },
        ],
      },
      {
        name: "B.Tech Electronics and Communication",
        degree: DegreeLevel.B_TECH,
        specialization: "IoT and Sensors",
        durationYears: 4,
        annualTuitionFee: 198000,
        totalSeats: 350,
        eligibilityCriteria: "VITEEE rank",
        cutoffs: [
          {
            examName: "VITEEE",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 7500,
            closingRank: 16000,
          },
        ],
      },
    ],
    placements: [
      {
        academicYear: "2023-2024",
        highestPackageLPA: 54.0,
        averagePackageLPA: 9.8,
        medianPackageLPA: 8.2,
        placementPercentage: 86.4,
        totalOffers: 7200,
        topRecruiters: [
          "Microsoft",
          "Amazon",
          "TCS Digital",
          "Cognizant",
          "Infosys",
          "Wipro",
          "Intel",
        ],
      },
    ],
    reviews: [
      {
        authorName: "Preeti Nair",
        authorRole: "Student, B.Tech CSE (Class of 2026)",
        rating: 4.2,
        title: "Great infrastructure and flexible curriculum system",
        comment:
          "FFCS is the best thing about VIT. You can tailor your schedule to work on projects or prepare for competitive exams. The campus infrastructure is very modern.",
        pros: "Modern labs, international exchanges, vast number of recruiting companies.",
        cons: "Hostel curfews are somewhat rigid; large intake numbers.",
        campusLifeRating: 4.0,
        infrastructureRating: 4.7,
        facultyRating: 4.1,
        placementRating: 4.4,
      },
    ],
  },
  {
    name: "RV College of Engineering",
    slug: "rvce-bengaluru",
    tagline: "Go, Change the World",
    description:
      "RVCE is an autonomous engineering college located in Bengaluru, Karnataka. Renowned for placement records in Bengaluru's Silicon Valley technology hub.",
    overview:
      "Established in 1963 on Mysore Road, Bengaluru, RV College of Engineering is synonymous with top KCET/COMEDK cutoffs in Karnataka. Its proximity to Electronic City and Whitefield ensures direct corporate collaboration and student internships.",
    establishedYear: 1963,
    ownership: CollegeOwnership.AUTONOMOUS,
    campusSizeAcres: 52,
    website: "https://www.rvce.edu.in",
    email: "principal@rvce.edu.in",
    phone: "+91-80-6717-8000",
    rating: 4.4,
    reviewCount: 26,
    nirfRanking: 96,
    naacGrade: "A",
    minAnnualFee: 240000,
    maxAnnualFee: 410000,
    location: {
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9237,
      longitude: 77.4987,
    },
    courses: [
      {
        name: "B.Tech Computer Science and Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "Data Science & Cloud Computing",
        durationYears: 4,
        annualTuitionFee: 260000,
        totalSeats: 180,
        eligibilityCriteria: "Top KCET or COMEDK ranks",
        cutoffs: [
          {
            examName: "COMEDK",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 50,
            closingRank: 420,
          },
          {
            examName: "KCET",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "Home State",
            openingRank: 120,
            closingRank: 550,
          },
        ],
      },
      {
        name: "B.Tech Information Science and Engineering",
        degree: DegreeLevel.B_TECH,
        specialization: "Network Security and Distributed Systems",
        durationYears: 4,
        annualTuitionFee: 260000,
        totalSeats: 120,
        eligibilityCriteria: "KCET or COMEDK rank",
        cutoffs: [
          {
            examName: "COMEDK",
            academicYear: 2024,
            round: 1,
            category: "General",
            quota: "All India",
            openingRank: 350,
            closingRank: 950,
          },
        ],
      },
    ],
    placements: [
      {
        academicYear: "2023-2024",
        highestPackageLPA: 62.0,
        averagePackageLPA: 14.8,
        medianPackageLPA: 12.5,
        placementPercentage: 91.0,
        totalOffers: 1050,
        topRecruiters: [
          "Amazon",
          "Cisco",
          "Intel",
          "Adobe",
          "Goldman Sachs",
          "Samsung R&D",
        ],
      },
    ],
    reviews: [
      {
        authorName: "Abhinav Hegde",
        authorRole: "Student, B.Tech CSE (Class of 2025)",
        rating: 4.4,
        title: "Silicon Valley location advantages are truly felt here",
        comment:
          "Bengaluru companies regularly recruit for 6-month and summer internships. You are literally minutes away from premier R&D labs.",
        pros: "Premier tech placements, prime Bangalore location, strong alumni.",
        cons: "Campus size is relatively compact compared to university campuses.",
        campusLifeRating: 4.0,
        infrastructureRating: 4.3,
        facultyRating: 4.4,
        placementRating: 4.8,
      },
    ],
  },
];

export async function main() {
  console.log("🌱 Starting realistic demo database seed...");

  const existingCount = await prisma.college.count().catch(() => 0);
  if (existingCount > 0 && process.env.FORCE_SEED !== "true") {
    console.log(`ℹ️ Database already has ${existingCount} colleges. Skipping seed (set FORCE_SEED=true to overwrite).`);
    return;
  }

  // Clear existing records in reverse dependency order
  await prisma.cutoff.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.location.deleteMany({});

  console.log("🧹 Cleared old records.");

  for (const collegeData of collegesData) {
    const { location, courses, placements, reviews, ...collegeDetails } =
      collegeData;

    // 1. Upsert Location
    const locationRecord = await prisma.location.upsert({
      where: {
        city_state: {
          city: location.city,
          state: location.state,
        },
      },
      update: {},
      create: {
        city: location.city,
        state: location.state,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });

    // 2. Create College
    const college = await prisma.college.create({
      data: {
        ...collegeDetails,
        locationId: locationRecord.id,
      },
    });

    console.log(`🏛️ Seeded college: ${college.name} (${location.city})`);

    // 3. Create Courses and nested Cutoffs
    for (const courseData of courses) {
      const { cutoffs, ...courseDetails } = courseData;
      const course = await prisma.course.create({
        data: {
          ...courseDetails,
          collegeId: college.id,
        },
      });

      // 4. Create Cutoffs linked to college and course
      for (const cutoffData of cutoffs) {
        await prisma.cutoff.create({
          data: {
            ...cutoffData,
            collegeId: college.id,
            courseId: course.id,
          },
        });
      }
    }

    // 5. Create Placements
    for (const placementData of placements) {
      await prisma.placement.create({
        data: {
          ...placementData,
          collegeId: college.id,
        },
      });
    }

    // 6. Create Reviews
    for (const reviewData of reviews) {
      await prisma.review.create({
        data: {
          ...reviewData,
          collegeId: college.id,
        },
      });
    }
  }

  const [collegesCount, coursesCount, placementsCount, reviewsCount, cutoffsCount] =
    await Promise.all([
      prisma.college.count(),
      prisma.course.count(),
      prisma.placement.count(),
      prisma.review.count(),
      prisma.cutoff.count(),
    ]);

  console.log("\n✅ Database seed completed successfully!");
  console.log(`📊 Total Colleges:   ${collegesCount}`);
  console.log(`📚 Total Courses:    ${coursesCount}`);
  console.log(`💼 Total Placements: ${placementsCount}`);
  console.log(`⭐ Total Reviews:    ${reviewsCount}`);
  console.log(`🎯 Total Cutoffs:    ${cutoffsCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
