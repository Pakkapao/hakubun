import { useState, useEffect } from "react";
import { IonRow } from "@ionic/react";

import { SubjAndAssignment } from "../types/MiscTypes";

import { getAlternativeMeanings } from "../services/SubjectAndAssignmentService";

import styles from "./AlternativeMeanings.module.scss";
import { SubjectMeaning } from "../types/Subject";

type Props = {
  subject: SubjAndAssignment;
};

//   TODO: add a button to add alternative meanings/synonyms
export const AlternativeMeanings = ({ subject }: Props) => {
  const [altMeanings, setAltMeanings] = useState<SubjectMeaning[]>([]);

  useEffect(() => {
    let alt = getAlternativeMeanings(subject);

    setAltMeanings(alt);
  }, [subject]);

  return (
    <IonRow className={`${styles.altMeaningsTxt}`}>
      <h2>Alternative Meanings</h2>
      <p>
        {altMeanings.length
          ? altMeanings
              .map((altMeaning: any) => {
                return altMeaning.meaning;
              })
              .join(", ")
          : "-"}
      </p>
      <IonRow />
    </IonRow>
  );
};