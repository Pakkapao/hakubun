import { useHistory } from "react-router";
import { IonCol, IonRow } from "@ionic/react";
import styled from "styled-components/macro";

import {
  Kanji,
  Radical,
  Subject,
  Vocabulary,
  SubjectType,
} from "../types/Subject";
import { SubjectChars } from "./SubjectChars";
import { Assignment } from "../types/Assignment";

import {
  getSubjectDisplayName,
  getPrimaryReading,
  getSubjectColor,
} from "../services/SubjectAndAssignmentService";

const Characters = styled(SubjectChars)`
  display: flex;
  flex-direction: column;
`;

const ReadingAndMeaningContainer = styled.div`
  text-align: right;
`;

const ReadingAndMeaningTxt = styled.p`
  margin: 5px 0;
`;

type RadInfoProps = {
  radical: Radical;
};

const RadicalInfo = ({ radical }: RadInfoProps) => {
  return (
    <ReadingAndMeaningContainer>
      <ReadingAndMeaningTxt>
        {getSubjectDisplayName(radical)}
      </ReadingAndMeaningTxt>
    </ReadingAndMeaningContainer>
  );
};

type ReadingMeaningProps = {
  subject: Kanji | Vocabulary;
};

// TODO: account for kana vocab where there's no reading (since reading would just be characters)
const ReadingAndMeaning = ({ subject }: ReadingMeaningProps) => {
  let hasReadings = subject.readings && subject.readings.length !== 0;
  return (
    <ReadingAndMeaningContainer>
      {hasReadings && (
        <ReadingAndMeaningTxt>
          {getPrimaryReading(subject.readings!)}
        </ReadingAndMeaningTxt>
      )}
      <ReadingAndMeaningTxt>
        {getSubjectDisplayName(subject)}
      </ReadingAndMeaningTxt>
    </ReadingAndMeaningContainer>
  );
};

type ItemContainerProps = {
  subjType: SubjectType;
};

const SubjectItemContainer = styled.button<ItemContainerProps>`
  background-color: ${({ subjType }) => getSubjectColor(subjType)};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  margin-bottom: 2px;
  border-radius: 10px;
`;

type Props = {
  subject: Subject;
};

const SubjectListItem = ({ subject }: Props) => {
  const history = useHistory();

  const onSubjBtnClick = (e: any) => {
    history.push(`/subjects/${subject.id}`);
  };

  return (
    <SubjectItemContainer subjType={subject.object} onClick={onSubjBtnClick}>
      <Characters subject={subject} fontSize="2rem" />
      {subject.object === "radical" && (
        <RadicalInfo radical={subject as Radical} />
      )}

      {(subject.object === "kanji" || subject.object === "vocabulary") && (
        <ReadingAndMeaning subject={subject as Kanji | Vocabulary} />
      )}
    </SubjectItemContainer>
  );
};

const SubjCol = styled(IonCol)`
  flex-basis: 100%;
  display: flex;
  padding: 0;
`;

const SubjRow = styled(IonRow)`
  margin-left: -3px;
`;

type ListProps = {
  subjList: Subject[];
  assignmentList: Assignment[];
};

export const SubjectWideBtnList = ({ subjList, assignmentList }: ListProps) => {
  return (
    <SubjRow>
      {(subjList as Subject[]).map((subject: any) => {
        return (
          <SubjCol key={`col_${subject.id}`}>
            {assignmentList && (
              <>
                <SubjectListItem subject={subject} />
              </>
            )}
          </SubjCol>
        );
      })}
    </SubjRow>
  );
};
