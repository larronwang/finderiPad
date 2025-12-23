import { CitizenData, INITIAL_DATA } from '../types.ts';

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
  if (!id || id.length !== 18) return {};

  const updates: Partial<CitizenData> = {};
  const year = id.substring(6, 10);
  const month = id.substring(10, 12);
  const day = id.substring(12, 14);
  const birthDateStr = `${year}-${month}-${day}`;

  const dateObj = new Date(birthDateStr);
  if (!isNaN(dateObj.getTime())) {
    updates.birthDate = birthDateStr;
    const today = new Date();
    let age = today.getFullYear() - dateObj.getFullYear();
    const m = today.getMonth() - dateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
      age--;
    }
    updates.age = age;
  }

  const genderCode = parseInt(id.charAt(16), 10);
  if (!isNaN(genderCode)) {
    updates.gender = genderCode % 2 !== 0 ? 'Male' : 'Female';
  }
  
  return updates;
};