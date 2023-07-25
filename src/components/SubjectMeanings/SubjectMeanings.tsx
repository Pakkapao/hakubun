import {
  getSubjectDisplayName,
  getAlternativeMeanings,
} from "../../services/SubjectAndAssignmentService";
import { Subject, SubjectMeaning } from "../../types/Subject";
import AddAltUserMeaningButton from "./AddAltUserMeaningButton";
import UserMeaningChips from "./UserMeaningChips";
import {
  SubjDetailSubHeading,
  SubjDetailTxt,
  SubjSummaryCol,
} from "../../styles/SubjectDetailsStyled";
import styled from "styled-components/macro";

const AlternativeMeaningsContainer = styled(SubjSummaryCol)`
  padding-left: 0;
  padding-right: 0;
  margin-bottom: 8px;
`;

const SubjDetailHeadingNoBtmMargin = styled(SubjDetailSubHeading)`
  margin-bottom: 0;
`;

const AltMeaningsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 5px;
`;

const AltMeaningText = styled(SubjDetailTxt)`
  margin-right: 5px;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
`;

type PrimaryAndAltProps = {
  subject: Subject;
  altMeanings: SubjectMeaning[];
  hasAltMeanings: boolean;
};

// TODO: switch to CSS text-transform: capitalize instead of capitalizeWord for primaryMeaning
const PrimaryAndAltMeanings = ({
  subject,
  altMeanings,
}: PrimaryAndAltProps) => {
  let primaryMeaning = getSubjectDisplayName(subject);
  let hasAltMeanings = altMeanings && altMeanings.length !== 0;
  return (
    <AltMeaningText>
      {primaryMeaning}
      {hasAltMeanings ? ", " : ""}
      {hasAltMeanings
        ? altMeanings
            .map((altMeaning: SubjectMeaning) => {
              return altMeaning.meaning;
            })
            .join(", ")
        : ""}
    </AltMeaningText>
  );
};

type AltProps = {
  altMeanings: SubjectMeaning[];
};

const AltMeanings = ({ altMeanings }: AltProps) => {
  return (
    <AltMeaningText>
      {altMeanings
        .map((altMeaning: SubjectMeaning) => {
          return altMeaning.meaning;
        })
        .join(", ")}
    </AltMeaningText>
  );
};

type Props = {
  subject: Subject;
  showPrimaryMeaning?: boolean;
};

function SubjectMeanings({ subject, showPrimaryMeaning = false }: Props) {
  let altMeanings = getAlternativeMeanings(subject);
  let hasAltMeanings = altMeanings && altMeanings.length !== 0;

  return (
    <AlternativeMeaningsContainer>
      {showPrimaryMeaning ? (
        <SubjDetailSubHeading>Meanings</SubjDetailSubHeading>
      ) : (
        <SubjDetailHeadingNoBtmMargin>
          Alternative Meanings
        </SubjDetailHeadingNoBtmMargin>
      )}
      {showPrimaryMeaning && (
        <PrimaryAndAltMeanings
          subject={subject}
          altMeanings={altMeanings}
          hasAltMeanings={hasAltMeanings}
        />
      )}
      {!showPrimaryMeaning && (
        <AltMeaningsContainer>
          <>
            {hasAltMeanings && <AltMeanings altMeanings={altMeanings} />}
            <UserMeaningChips subject={subject} />
            <AddAltUserMeaningButton subject={subject} />
          </>
        </AltMeaningsContainer>
      )}
    </AlternativeMeaningsContainer>
  );
}

export default SubjectMeanings;