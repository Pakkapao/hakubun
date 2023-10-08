import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// TODO: instead add a module declaration file for react-router-prompt
// @ts-ignore: Could not find a declaration file for module
import ReactRouterPrompt from "react-router-prompt";
import {
  blockUserLeavingPage,
  getCompletedAssignmentQueueData,
} from "../services/AssignmentQueueService";
import { useAssignmentQueueStore } from "../stores/useAssignmentQueueStore";
import { useQueueStore } from "../stores/useQueueStore";
import { useStartAssignment } from "../hooks/useStartAssignment";
import { AssignmentQueueItem } from "../types/AssignmentQueueTypes";
import AssignmentQueueCards from "../components/AssignmentQueueCards";
import AnimatedPage from "../components/AnimatedPage";
import QueueHeader from "../components/QueueHeader";
import AlertDialog from "../components/AlertDialog";
import { MainContent } from "../styles/BaseStyledComponents";
import styled from "styled-components";
import KeyboardShortcuts from "../components/KeyboardShortcuts";

const Page = styled(AnimatedPage)`
  background-color: var(--dark-greyish-purple);
`;

const MainContentWithMargin = styled(MainContent)`
  margin: 10px;
`;

function LessonQuiz() {
  const navigate = useNavigate();
  const resetQueueStore = useQueueStore.use.resetAll();
  const resetAssignmentQueue = useAssignmentQueueStore.use.resetAll();
  const assignmentQueue = useAssignmentQueueStore.use.assignmentQueue();
  const { mutateAsync: startAssignmentAsync } = useStartAssignment();

  useEffect(() => {
    if (assignmentQueue.length === 0) {
      // TODO: redirect to home page, shouldn't be here with no lessons!
    }
  }, []);

  const endLessonQuiz = () => {
    resetQueueStore();
    resetAssignmentQueue();
  };

  const submitLessonQuiz = (queueData: AssignmentQueueItem[]) => {
    let completedLessonData = getCompletedAssignmentQueueData(queueData);

    // TODO: change to actually catch errors
    let promises = completedLessonData.map(function (lessonItem) {
      return startAssignmentAsync({
        assignmentID: lessonItem.assignment_id,
      })
        .then(function (results) {
          // *testing
          console.log("🚀 ~ file: LessonQuiz.tsx:77 ~ results:", results);
          // *testing
          return results;
        })
        .catch((err) => {
          // *testing
          console.log("🚀 ~ file: ReviewSession.tsx:96 ~ promises ~ err:", err);
          // *testing
        });
    });
    Promise.all(promises).then(function (results) {
      // *testing
      console.log(results);
      // *testing

      let lessonInfo = {
        lessonResponses: results,
      };
      navigate("/lessons/summary", { state: lessonInfo, replace: true });
    });
  };

  return (
    <Page>
      <ReactRouterPrompt
        when={blockUserLeavingPage}
        beforeConfirm={() => {
          endLessonQuiz();
        }}
      >
        {({
          isActive,
          onConfirm,
          onCancel,
        }: {
          isActive: boolean;
          onConfirm: () => void;
          onCancel: () => void;
        }) =>
          isActive && (
            <AlertDialog
              uncontrolledSettings={{ defaultOpen: isActive }}
              title="End Lesson Quiz?"
              confirmText="End Quiz"
              cancelText="Cancel"
              onConfirmClick={onConfirm}
              onCancelClick={onCancel}
            />
          )
        }
      </ReactRouterPrompt>
      {assignmentQueue.length !== 0 && <QueueHeader />}
      <MainContentWithMargin>
        {assignmentQueue.length !== 0 && (
          <AssignmentQueueCards submitItems={submitLessonQuiz} />
        )}
      </MainContentWithMargin>
      <KeyboardShortcuts />
    </Page>
  );
}

export default LessonQuiz;
