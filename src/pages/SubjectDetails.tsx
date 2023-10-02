import { useNavigate, useParams } from "react-router-dom";
import { IonGrid, IonSkeletonText, IonIcon } from "@ionic/react";
import { AnimatePresence } from "framer-motion";
import { useAssignmentQueueStore } from "../stores/useAssignmentQueueStore";
import { useSubjectByID } from "../hooks/useSubjectByID";
// import { useHideOnKeyboardOpen } from "../hooks/useHideOnKeyboardOpen";
import { GeneralVocabulary, Kanji, Radical } from "../types/Subject";
import SubjectSummary from "../components/SubjectSummary/SubjectSummary";
import RadicalSubjDetails from "../components/RadicalSubjDetails/RadicalSubjDetails";
import KanjiSubjDetails from "../components/KanjiSubjDetails/KanjiSubjDetails";
import VocabSubjDetails from "../components/VocabSubjDetails/VocabSubjDetails";
import SubjectHeader from "../components/SubjectHeader/SubjectHeader";
import AnimatedPage from "../components/AnimatedPage";
import FloatingTabBar from "../components/FloatingTabBar";
import { ContentWithTabBar } from "../styles/BaseStyledComponents";
import styled from "styled-components";

const FullWidthGrid = styled(IonGrid)`
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 0;
`;

const Page = styled(AnimatedPage)`
  --ion-background-color: var(--dark-greyish-purple);
  background-color: var(--dark-greyish-purple);
`;

// TODO: show "back to review" button if routed to this page from a assignment session
export const SubjectDetails = () => {
  const { id } = useParams<{ id?: string }>();
  const parsedID = parseInt(id!);
  const isSessionInProgress = useAssignmentQueueStore.use.sessionInProgress();
  // *testing
  console.log(
    "🚀 ~ file: SubjectDetails.tsx:35 ~ SubjectDetails ~ isSessionInProgress:",
    isSessionInProgress
  );
  // *testing
  // const { shouldHide } = useHideOnKeyboardOpen();

  const {
    isLoading: subjectLoading,
    data: subject,
    error: subjectErr,
  } = useSubjectByID(parsedID);

  // TODO: display loading skeleton for each component until all content on page is loaded
  return (
    <Page>
      {subjectLoading ? (
        <ContentWithTabBar>
          <IonSkeletonText
            animated={true}
            style={{ height: "75vh" }}
          ></IonSkeletonText>
        </ContentWithTabBar>
      ) : (
        <>
          {subject && (
            <>
              <SubjectHeader subject={subject} />
              <ContentWithTabBar>
                <FullWidthGrid>
                  <SubjectSummary subject={subject}></SubjectSummary>
                  {subject.object == "radical" && (
                    <RadicalSubjDetails radical={subject as Radical} />
                  )}
                  {subject.object == "kanji" && (
                    <KanjiSubjDetails kanji={subject as Kanji} />
                  )}
                  {(subject.object == "vocabulary" ||
                    subject.object == "kana_vocabulary") && (
                    <VocabSubjDetails vocab={subject as GeneralVocabulary} />
                  )}
                </FullWidthGrid>
              </ContentWithTabBar>
            </>
          )}
        </>
      )}
      <AnimatePresence>
        {/* {!shouldHide && !isSessionInProgress && <FloatingTabBar />} */}
        {!isSessionInProgress && <FloatingTabBar />}
      </AnimatePresence>
    </Page>
  );
};
