// types.ts

// Media item used in media modals
export interface MediaItem {
  url: string;
  title: string;
}

// Basic Course type
export interface Course {
  title: string;
  base_price: number;
}

// Payment related types
export interface PaymentStatus {
  status: string;
  message: string;
}

export interface PurchasedBy {
  name?: string;
  email?: string;
  phone?: string;
}

export interface PaymentData {
  purchasedBy?: PurchasedBy;
  basePrice: number;
  discountedAmount: number;
  transactionAmount?: number;
  paymentStatus?: PaymentStatus;
  paymentData?: { [key: string]: string | number };

  name?: string;
  address?: string;
  zip?: string;
  country?: string;
  state?: string;
  gstAmount?: number;
  sgstAmount?: number;
  courses?: Course[];
  createdAt?: string;
  updatedAt?: string;
}

// Wrapped course type (if needed)
export interface WrappedCourse {
  course?: Course;
}
export interface Course {
  _id: string; // required
  title: string; // required
  base_price: number; // required
}


// Batch type (replace any with proper types as needed)
export interface Batch {
  _id: string;
  batchId: string;
  batchName?: string;
  coursets?: any[]; // TODO: replace any with proper course type
  startDate: string;
  endDate: string;
  users: any[]; // TODO: replace any with user type
  batchlimit: number;
  course?: any;
}

// Freelance post related types
export interface WorkExperience {
  isFresher: boolean;
  from: number | string;
  to: number | string;
}

export interface SalaryRange {
  from: number | string;
  to: number | string;
}

export interface FreelancePost {
  position: string;
  employment_type: string;
  key_skills: string[];
  company: string;
  role_category: string;
  work_mode: string;
  location: string;
  work_experience: WorkExperience;
  annual_salary_range: SalaryRange;
  company_industry: string;
  educational_qualification: string[];
  interview_mode: string;
  job_description: string;
  job_url: string;
  about_company: string;
  company_website_link: string;
  company_address: string;
  logoUrl: string;
  publishStatus: string;
  publishDate: string;
  lastDate: string;
  company_logo: string;
}

// Instructor type
export interface Instructor {
  _id: string;
  name?: string;
  profile?: string;
}

// Live class type for lessons
export interface LiveClass {
  streamKey: string;
  startDate: string;
  endDate: string;
  [key: string]: any;
}

// Lesson type
export interface Lesson {
  lesson_name: string;
  duration: string;
  video: string;
  notes: string;
  notesName: string;
  assignment: string;
  assignmentName: string;
  isLiveClass: boolean;
  liveClass: LiveClass;

  [key: string]: any; // <-- add this line to allow dynamic indexing
}

// Chapter type
export interface Chapter {
  chapter_name: string;
  lessons: Lesson[];
}

// Project type
export interface Project {
  title: string;
  startDate: string;
  endDate: string;
  projectInfoPdf: string;
  duration: string;
}

// Curriculum Unit type
export interface CurriculumUnit {
  unitName: string;
  chapters: Chapter[];
  project: Project[];
}

// Course details (expand as per your data)
export interface CourseDetails {
  credits: number | "";
  level: string;
  overview: string;
  featured_image?: string;
  bannerImg?: string;

  base_price: number | ""; // add this
  discount_percentage: number | ""; // add this

  learningOutcome: string[];
  faqs: { question: string; answer: string }[];

  [key: string]: any;
}


// Internship data - full type for your main course/internship entity
export interface InternshipData {
  instructor: string;
  internshipId: string;
  bannerImg: string;
  title: string;
  category: string;
  subcategory: string;
  level: string;
  base_price: string;
  discount_percentage: number;
  overview: string;
  registration_price: number;
  featured_image: string;
  featured_video: string;
  courseType: string;
  credits: number;
  duration: number;
  internshipStartDate: string;
  faqs: Faq[]; // typed properly now
  internshipPeriod: string;
  internshipCategory: string;
  curriculum: CurriculumUnit[];
  learningOutcome: LearningOutcome[]; // typed properly now
  testimonials: any[];
  reviews: any[];
  companies_hiring: any[];
  placementOpportunities: any[];
  courseDetails?: CourseDetails;
  createdAt?: string;
}

// Modal props for feature video modal
export interface FeatureVideoCourseModalProps {
  isModalVideoOpen: boolean;
  setIsModalVideoOpen: (open: boolean) => void;
  courseDetails: any; // Ideally type more strictly based on usage
  setCourseDetails: (details: any) => void;
  type: string;
  uploadedMedia: MediaItem[];
  setSelectedMediaFromModal: (url: string) => void;
}

// types.ts

export interface MediaItem {
  url: string;
  title: string;
}

// Your generic ImageCoursesModalProps interface:
export interface ImageCoursesModalProps<T = CourseDetails> {
  isModalImageOpen: boolean;
  setIsModalImageOpen: (open: boolean) => void;
  courseDetails: T;
  setCourseDetails: (details: T) => void;
  type: "featured_image" | "bannerImg" | string;
  uploadedMedia: MediaItem[];
  setSelectedMediaFromModal: (url: string) => void;
  darkMode?: boolean;
}

// types.ts

export interface CourseDetailsProps {
  featured_image: string;
  bannerImg: string;
  featured_video: string;
  [key: string]: string;
}
// types.ts
export interface ThumbnailAndTeaserProps {
  courseDetails: InternshipData;
  setCourseDetails: React.Dispatch<React.SetStateAction<InternshipData>>;
  loading: boolean;
  uploadedMedia: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface CourseDetails {
  learningOutcome: string[];
  faqs: Faq[];
}
export type LearningOutcome = string;

// types.ts
export interface Company {
  companyName: string;
  avgpkg: {
    from: number;
    to: number;
  };
}

export interface PlacementAverageSalaryProps {
  courseDetails: {
    companies_hiring: Company[];
    placementOpportunities: string[];
  };
  setCourseDetails: React.Dispatch<
    React.SetStateAction<{
      companies_hiring: Company[];
      placementOpportunities: string[];
    }>
  >;
}

// course caricullam and live classes types

// types.ts
export interface LiveClass {
  streamKey: string;
  startDate: string;
  endDate: string;
}

export interface Lesson {
  lesson_name: string;
  duration: string;
  video: string;
  notes: string;
  notesName: string;
  assignment: string;
  assignmentName: string;
  isLiveClass: boolean;
  liveClass: LiveClass;
}

export interface Chapter {
  chapter_name: string;
  lessons: Lesson[];
}

export interface Project {
  title: string;
  startDate: string;
  endDate: string;
  projectInfoPdf: string;
  duration: string;
}

export interface Module {
  unitName: string;
  chapters: Chapter[];
  project: Project[];
}

export interface CourseDetails {
  curriculum: Module[];
}

export interface CurriculumLiveClassesProps {
  courseDetails: InternshipData;
  uploadedMedia: MediaItem[];
  setSelectedMediaFromModal: (url: string) => void;
  setCourseDetails: React.Dispatch<React.SetStateAction<InternshipData>>;
}
// export interface PdfCoursesModalProps {
//   isModalPdfOpen: boolean;
//   setIsModalPdfOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   courseDetails: InternshipData;
//   setCourseDetails: React.Dispatch<React.SetStateAction<InternshipData>>;
//   type: string;
//   uploadedMedia: MediaItem[];
//   setSelectedMediaFromModal: (url: string) => void;
// }


export interface PdfCoursesModalProps<T> {
  isModalPdfOpen: boolean;
  setIsModalPdfOpen: React.Dispatch<React.SetStateAction<boolean>>;
  courseDetails: T;
  setCourseDetails: React.Dispatch<React.SetStateAction<T>>;
  type: string;
  uploadedMedia: MediaItem[];
  setSelectedMediaFromModal: (url: string) => void;
}


export interface VideoCourseModalProps {
  isModalVideoOpen: boolean;
  setIsModalVideoOpen: (open: boolean) => void;
  courseDetails: any;
  setCourseDetails: (details: any) => void;
  type: string;
  uploadedMedia: MediaItem[];
  setSelectedMediaFromModal: (url: string) => void;
}

// Add Course
export interface AllInstructorModelProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  InstructorDetails: any[];
  setselectedinstructorFromModal: React.Dispatch<any>;
  type: string; // <-- Add this
}

export interface LessonType {
  lesson_name: string;
  duration: string;
  video: string;
  notes: string;
  notesName: string;
  assignment: string;
  assignmentName: string;
  transcript: string;
  isLiveClass: boolean;
  liveClass: {
    startDate: string;
    endDate: string;
    meetingLink: string;
  };
}

export interface ProjectType {
  title: string;
  projectInfoPdf: string;
  duration: number;
  startDate: string; // <- add this
  endDate: string; // <- and this
}


export interface ChapterType {
  chapter_name: string;
  lessons: LessonType[];
  project: any[];
}

export interface CourseType {
  instructor: string;
  courseID: string;
  bannerImg: string;
  title: string;
  category: string;
  subcategory: string;
  level: string;
  base_price: string;
  discount_percentage: string;
  overview: string;
  featured_image: string;
  featured_video: string;
  courseType: string;
  credits: number;
  duration: number;
  courseStartDate: string;
  faqs: any[];
  curriculum: ChapterType[];
  whatWillILearn: any[];
  liveClasses: any[];
  testimonials: any[];
  reviews: any[];
  companies: any[];
  placementOpportunities: any[];
  discounted_price: number;
  thumbnailImg: string;
  teaserLink: string;
  certificate: string;
  learning_outcome: string;
  skill: string[];
  tools: string[];
  language: string;
  mode: string;
  live_session: boolean;
  status: string;
  assessments: Assessment[];
  // assessments: [];
}

// types.ts

export interface CourseDetailsType {
  courseID: string;
  title: string;
  category: string;
  subcategory: string;
  courseStartDate: string;
  duration: number | string;
  instructor: string;
  bannerImg: string;
  level: string;
  base_price: number;
  discounted_price: number;
  thumbnailImg: string;
  teaserLink: string;
  overview: string;
  certificate: string;
  learning_outcome: string;
  skill: string[];
  tools: string[];
  language: string;
  mode: string;
  live_session: boolean;
  status: string;
  assessments: Assessment[];
}

interface CourseInfoProps {
  courseDetails: CourseType;
  setCourseDetails: React.Dispatch<React.SetStateAction<CourseType>>;
}


// types.ts

// Assessment details structure
export interface Assessment {
  _id: string;
  assessmentName: string;
  lastDate: string;
  timelimit: number;
  isProtected: boolean;
  questions: number;
}



// Props for UpdateAssessmentModal component
export interface UpdateAssessmentModalProps {
  assessment: Assessment;
  assessmentID: string;
  handleToggleOpen: () => void;
  fetchCourseDetails: () => void;
}

// Form state structure used in UpdateAssessmentModal
export interface AssessmentFormState {
  assessment_id: string;
  assessmentName: string;
  lastDate: string;
  timelimit: number;
  isProtected: boolean;
}

