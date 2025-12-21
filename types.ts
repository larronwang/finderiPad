export type Gender = 'Male' | 'Female' | 'Other' | '';
export type MaritalStatus = 'Married' | 'Widowed' | 'Divorced' | 'Single' | '';
export type EducationLevel = 'Junior High School' | 'High School' | 'Undergraduate' | 'Graduate' | 'None' | '';
export type Language = 'en' | 'zh-CN' | 'zh-HK';

export interface CitizenData {
  // Step 1: Identity
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender;
  age: number | '';
  ethnicity: string;
  ancestry: string;

  // Step 2: Contact
  address: string;
  phoneNumber: string;

  // Step 3: Demographics
  education: EducationLevel;
  maritalStatus: MaritalStatus;

  // Step 4: Interests
  housingType: 'Owned' | 'Rented' | 'With Children' | 'Nursing Home' | '';
  employmentStatus: 'Retired' | 'Working' | 'Unemployed' | '';
  occupation: string;
  hobby: string;
}

export interface AppState {
  view: 'home' | 'wizard' | 'map';
  currentStep: number;
  fontSizeMode: 'large' | 'extra-large';
  language: Language;
  data: CitizenData;
}

export const INITIAL_DATA: CitizenData = {
  fullName: '',
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
  occupation: '',
  hobby: ''
};

export const STEPS = [
  { id: 1, key: 'identity' },
  { id: 2, key: 'contact' },
  { id: 3, key: 'personal' },
  { id: 4, key: 'interests' },
  { id: 5, key: 'review' },
];

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}