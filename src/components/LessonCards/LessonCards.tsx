import { Subject, SubjectType } from "../../types/Subject";
import { getSubjectColor } from "../../services/SubjectAndAssignmentService";
import { useTabIndexStore } from "../../stores/useTabIndexStore";
import { ReviewQueueItem } from "../../types/ReviewSessionTypes";
import SubjectChars from "../SubjectChars";
import RadicalDetailTabs from "../RadicalDetailTabs";
import KanjiDetailTabs from "../KanjiDetailTabs";
import VocabDetailTabs from "../VocabDetailTabs";
import { TabData } from "../../types/MiscTypes";
import SwipeableTabs from "../SwipeableTabs";
import styled from "styled-components";
import StartSessionButton from "../StartSessionButton";
import { useEffect } from "react";

type HeaderProps = {
  subjType: SubjectType;
};

const LessonSessionHeader = styled.header<HeaderProps>`
  background-color: ${({ subjType }) => getSubjectColor(subjType)};
  padding: 75px 10px;
`;

const LessonContent = styled.div`
  margin: 10px 20px 25px;
`;

type CardProps = {
  lesson: ReviewQueueItem;
};

function LessonCard({ lesson }: CardProps) {
  return (
    <>
      <LessonSessionHeader subjType={lesson.object}>
        <SubjectChars
          subject={lesson as Subject}
          fontSize="4rem"
          withBgColor={true}
        />
      </LessonSessionHeader>
      <LessonContent>
        {lesson.object == "radical" && (
          <RadicalDetailTabs radical={lesson} scrollToDefault={false} />
        )}
        {lesson.object == "kanji" && (
          <KanjiDetailTabs kanji={lesson} scrollToDefault={false} />
        )}
        {(lesson.object == "vocabulary" ||
          lesson.object == "kana_vocabulary") && (
          <VocabDetailTabs vocab={lesson} scrollToDefault={false} />
        )}
      </LessonContent>
    </>
  );
}

type Props = {
  lessons: ReviewQueueItem[];
  onStartLessonBtnClick: () => void;
};

function LessonCards({ lessons, onStartLessonBtnClick }: Props) {
  const isLastIndex = useTabIndexStore.use.isLastIndex();
  const resetTabIndex = useTabIndexStore.use.resetAll();

  useEffect(() => {
    return () => {
      resetTabIndex();
    };
  }, []);

  let lessonTabs: TabData[] = lessons.map((lesson) => {
    return {
      id: lesson.id.toString(),
      label: lesson.id.toString(),
      tabContents: <LessonCard lesson={lesson} />,
    };
  });

  return (
    <>
      <SwipeableTabs
        defaultValue={lessons[0].id.toString()}
        tabs={lessonTabs}
        blobs={true}
        scrollToDefault={false}
        trackIndex={true}
      />
      {isLastIndex && (
        <StartSessionButton
          buttonType="quiz"
          onStartBtnClick={onStartLessonBtnClick}
        />
      )}
    </>
  );
}

export default LessonCards;
