import { useHistory } from "react-router";
import { IonRow, useIonPopover } from "@ionic/react";

import { StepProgressBar } from "../progress/StepProgressBar";
import { SubjectCardLoading } from "../loading-skeletons/SubjectCardLoading";
import { StepProgressBarLoading } from "../loading-skeletons/StepProgressBarLoading";
import { SubjCardPopover } from "../SubjCardPopover";

import styles from "./SubjectCard.module.scss";

import { Subject } from "../../types/Subject";
import { Assignment } from "../../types/Assignment";

type RadProps = {
  subject: Subject | undefined;
  assignment: Assignment | undefined;
  isRadical: boolean;
  displayProgress?: boolean;
  clickDisabled?: boolean;
};

// TODO: combine with RadicalImageCard since so many similarities
export const SubjectCard = ({
  subject,
  assignment,
  isRadical,
  displayProgress = true,
  clickDisabled,
}: RadProps) => {
  const history = useHistory();
  const handleDismiss = () => dismiss();

  // TODO: use useHistory or useLocation to set state/type of subject
  const navigate = (route: string) => {
    handleDismiss();
    history.push(route);
  };

  const [present, dismiss] = useIonPopover(SubjCardPopover, {
    size: "cover",
    subject,
    assignment,
    isRadical,
    navigate,
  });

  return (
    <>
      <IonRow>
        {subject && assignment ? (
          <button
            title={isRadical ? "Radical Subject" : "Kanji Subject"}
            className={
              isRadical
                ? `${styles.radStyle} ${styles.subjDiv}`
                : `${styles.kanjiStyle} ${styles.subjDiv}`
            }
            onClick={(e: any) => {
              present({
                event: e.nativeEvent,
                size: "auto",
                alignment: "center",
                cssClass: "radPopover",
              });
            }}
            disabled={clickDisabled}
          >
            {subject && (
              <p className={`${styles.subjText}`}>{subject.characters}</p>
            )}
          </button>
        ) : (
          <SubjectCardLoading />
        )}
      </IonRow>
      {displayProgress && (
        <IonRow className={`${styles.progressContainer}`}>
          {assignment ? (
            <StepProgressBar
              stage={assignment.srs_stage}
              passedAt={assignment.passed_at}
            ></StepProgressBar>
          ) : (
            <StepProgressBarLoading />
          )}
        </IonRow>
      )}
    </>
  );
};
