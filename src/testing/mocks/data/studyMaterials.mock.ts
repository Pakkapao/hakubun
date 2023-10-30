import { SubjectType } from "../../../types/Subject";

export const mockStudyMaterials = [
  {
    id: 11952890,
    object: "study_material",
    url: "https://api.wanikani.com/v2/study_materials/11952890",
    data_updated_at: new Date("2023-10-28T21:54:14.068876Z"),
    created_at: new Date("2023-10-28T21:54:14.068876Z"),
    subject_id: 1,
    subject_type: "radical" as SubjectType,
    meaning_note: "Here's some fake study material data",
    reading_note: null,
    meaning_synonyms: [],
    hidden: false,
  },
  {
    id: 11952897,
    object: "study_material",
    url: "https://api.wanikani.com/v2/study_materials/11952897",
    data_updated_at: new Date("2023-10-28T21:55:25.245059Z"),
    created_at: new Date("2023-10-28T21:55:25.245059Z"),
    subject_id: 25,
    subject_type: "radical" as SubjectType,
    meaning_note: "Beep boop, another fake study material",
    reading_note: null,
    meaning_synonyms: [],
    hidden: false,
  },
];
