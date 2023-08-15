// TODO: change so not relying on IonIcon
import { IonContent, IonIcon } from "@ionic/react";
import AnimatedPage from "../components/AnimatedPage";
import { useLocation, useNavigate } from "react-router-dom";
import { createAssignmentQueueItems } from "../services/SubjectAndAssignmentService";
import { useSubjectsByIDs } from "../hooks/useSubjectsByIDs";
import { useStudyMaterialsBySubjIDs } from "../hooks/useStudyMaterialsBySubjIDs";
import { AssignmentBatch, StudyMaterial } from "../types/MiscTypes";
import { Assignment } from "../types/Assignment";
import { useEffect, useState } from "react";
import { ReviewQueueItem } from "../types/ReviewSessionTypes";
import LessonCards from "../components/LessonCards";
import Button from "../components/Button";
import styled from "styled-components";
import HomeIconColor from "../images/home-color.svg";

const Page = styled(AnimatedPage)`
  background-color: var(--dark-greyish-purple);
`;

// TODO: extract into HomeButton component
const HomeBtn = styled(Button)`
  position: fixed;
  top: 10px;
  left: 10px;
  border-radius: 10px;
  padding: 0 6px;
`;

const HomeIconStyled = styled(IonIcon)`
  width: 3em;
  height: 3em;
`;

function LessonSession() {
  const location = useLocation();
  const navigate = useNavigate();
  // const [lessonQueue, setLessonQueue] = useState<ReviewQueueItem[]>([]);
  const [uniqueLessonQueue, setUniqueLessonQueue] = useState<ReviewQueueItem[]>(
    []
  );

  let stateFromReviewSettings: AssignmentBatch = location.state;
  let assignmentBatchToLearn: Assignment[] =
    stateFromReviewSettings.assignmentBatch;
  let subjIDs: number[] = stateFromReviewSettings.subjIDs;

  let queriesEnabled = stateFromReviewSettings !== undefined;
  const { data: subjectsData, isLoading: subjectsLoading } = useSubjectsByIDs(
    subjIDs,
    queriesEnabled
  );
  const { data: studyMaterialsData, isLoading: studyMaterialsLoading } =
    useStudyMaterialsBySubjIDs(subjIDs, queriesEnabled, false);

  useEffect(() => {
    if (
      location.state &&
      !subjectsLoading &&
      !studyMaterialsLoading &&
      subjectsData.length !== 0 &&
      studyMaterialsData !== undefined
    ) {
      // TODO: change so not creating lessonQueue as ReviewQueueItem[] before it's necessary
      let lessonsToLearn = createAssignmentQueueItems(
        assignmentBatchToLearn,
        subjectsData,
        studyMaterialsData as StudyMaterial[]
      );

      // filter lessonsToLearn so only includes items with unique subject IDs
      let uniqueLessonsToLearn = lessonsToLearn.filter(
        (lesson, index, self) =>
          index === self.findIndex((l) => l.id === lesson.id)
      );
      console.log(
        "🚀 ~ file: LessonSession.tsx:220 ~ useEffect ~ uniqueLessonsToLearn:",
        uniqueLessonsToLearn
      );

      // const shuffledLessons = shuffleArray(lessonsToLearn);
      // // *testing
      // console.log(
      //   "🚀 ~ file: LessonSession.tsx:81 ~ useEffect ~ shuffledLessons:",
      //   shuffledLessons
      // );
      // // *testing

      // setLessonQueue(shuffledLessons);
      setUniqueLessonQueue(uniqueLessonsToLearn);
    }
  }, [subjectsLoading, studyMaterialsLoading, location.state]);

  return (
    <Page>
      {subjectsLoading || (studyMaterialsLoading && <h1>Loading...</h1>)}
      {uniqueLessonQueue.length !== 0 && (
        <IonContent>
          <HomeBtn onPress={() => navigate("/home")}>
            <HomeIconStyled icon={HomeIconColor}></HomeIconStyled>
          </HomeBtn>
          <LessonCards lessons={uniqueLessonQueue} />
        </IonContent>
      )}
    </Page>
  );
}

export default LessonSession;