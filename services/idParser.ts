import { CitizenData, INITIAL_DATA } from '../types';

export const saveProgress = (data: CitizenData) => {
  try {
    localStorage.setItem('census_draft_data', JSON.stringify(data));
    localStorage.setItem('census_last_active', new Date().toISOString());
  } catch (e) {
    console.warn('Failed to auto-save', e);
  }
};

export const loadProgress = (): CitizenData | null => {
  try {
    const data = localStorage.getItem('census_draft_data');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load progress', e);
  }
  return null;
};

export const clearProgress = () => {
  localStorage.removeItem('census_draft_data');
};

export const parseIdCard = (id: string): Partial<CitizenData> => {
  // Parsing logic based on standard 18-digit ID format (common in demographic data structures)
  // Format: 6 digit address code + 8 digit DoB (YYYYMMDD) + 3 digit sequence + 1 checksum
  
  if (!id || id.length !== 18) return {};

  const updates: Partial<CitizenData> = {};

  // Extract Birth Date
  const year = id.substring(6, 10);
  const month = id.substring(10, 12);
  const day = id.substring(12, 14);
  const birthDateStr = `${year}-${month}-${day}`;

  // Simple validation of date
  const dateObj = new Date(birthDateStr);
  if (!isNaN(dateObj.getTime())) {
    updates.birthDate = birthDateStr;
    
    // Calculate Age
    const today = new Date();
    let age = today.getFullYear() - dateObj.getFullYear();
    const m = today.getMonth() - dateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
      age--;
    }
    updates.age = age;
  }

  // Extract Gender (17th digit: Odd = Male, Even = Female)
  const genderCode = parseInt(id.charAt(16), 10);
  if (!isNaN(genderCode)) {
    updates.gender = genderCode % 2 !== 0 ? 'Male' : 'Female';
  }

  // Pre-fill ethnicity as 'Han' if empty (Common default for this specific parsing logic context, 
  // but strictly we can't determine ethnicity from ID number alone, usually determined by region code or manual input.
  // We will leave it blank or mock it based on region code for the sake of the prototype if requested, 
  // but strictly parsing ID only gives DoB and Gender).
  
  return updates;
};