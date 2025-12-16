export type Gender = 'Male' | 'Female' | '';
export type MaritalStatus = 'Married' | 'Widowed' | 'Divorced' | 'Single' | '';
export type EducationLevel = 'Primary' | 'Secondary' | 'High School' | 'University' | 'None' | '';

export interface CitizenData {
  // Step 1: Identity
  fullName: string;
  idNumber: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender;
  age: number | '';
  ethnicity: string; // Optional
  ancestry: string;  // Optional (Ancestral Home/Origin)

  // Step 2: Contact
  address: string;
  phoneNumber: string;

  // Step 3: Demographics
  education: EducationLevel;
  maritalStatus: MaritalStatus;

  // Step 4: Living & Work
  housingType: 'Owned' | 'Rented' | 'With Children' | 'Nursing Home' | '';
  employmentStatus: 'Retired' | 'Working' | 'Unemployed' | '';
  occupation: string; // Optional
}

export interface AppState {
  view: 'wizard' | 'map';
  currentStep: number;
  fontSizeMode: 'large' | 'extra-large';
  highContrast: boolean;
  data: CitizenData;
}

export const INITIAL_DATA: CitizenData = {
  fullName: '',
  idNumber: '',
  birthDate: '',
  gender: '',
  age: '',
  ethnicity: '',
  ancestry: '',
  address: '',
  phoneNumber: '',
  education: '',
  maritalStatus: '',
  housingType: '',
  employmentStatus: '',
  occupation: ''
};

export const STEPS = [
  { id: 1, title: 'Identity', description: 'Name, ID & Origins' },
  { id: 2, title: 'Contact', description: 'Address & Phone' },
  { id: 3, title: 'Personal', description: 'Education & Family' },
  { id: 4, title: 'Living', description: 'Housing & Work' },
  { id: 5, title: 'Review', description: 'Confirm Data' },
];

// Helper to extend Window for Speech Recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}