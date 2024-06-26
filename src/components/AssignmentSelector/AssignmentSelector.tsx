import { useEffect, useState } from "react";
// TODO: change so not relying on IonIcon
import { IonSkeletonText, IonIcon } from "@ionic/react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { AnimatePresence, motion } from "framer-motion";
import useUserInfoStoreFacade from "../../stores/useUserInfoStore/useUserInfoStore.facade";
import { useAssignmentSettingsCtxStore } from "../../stores/useAssignmentSettingsCtxStore/useAssignmentSettingsCtxStore";
import {
  filterSubjectsByLevel,
  filterSubjectsByType,
  getSubjectColor,
  sortBySubjectTypeAndLevel,
  filterAssignmentsByLastUpdate,
} from "../../services/SubjectAndAssignmentService/SubjectAndAssignmentService";
import { useSubjectsByIDs } from "../../hooks/subjects/useSubjectsByIDs";
import { Assignment } from "../../types/Assignment";
import {
  KanaVocabulary,
  Kanji,
  Radical,
  Subject,
  SubjectType,
  Vocabulary,
} from "../../types/Subject";
import { LastUpdateChoice } from "../LastUpdateOption/LastUpdateOption.types";
import SubjectChars from "../SubjectChars";
import { RadicalMeaning, ReadingAndMeaning } from "../SubjectWideBtnList";
import Button from "../Button";
import Counter from "../Counter";
import CheckCircleIcon from "../../images/check-in-circle.svg";
import RemoveIcon from "../../images/close.svg";
import CheckIcon from "../../images/checkmark.svg";
import LogoExclamation from "../../images/logo-exclamation.svg";
import { AbsoluteCenterContainer } from "../../styles/BaseStyledComponents";
import styled from "styled-components";

const SubjectList = styled(ToggleGroup.Root)`
  display: flex;
  border-radius: 4px;
  padding: 15px 10px 6rem;
  flex-wrap: wrap;
  max-height: 65vh;
  overflow-y: scroll;
  align-items: center;
  justify-content: center;
`;

type ItemContainerProps = {
  subjtype: SubjectType;
};

const SubjectItem = styled(motion.button)<ItemContainerProps>`
  background-color: ${({ subjtype }) => getSubjectColor(subjtype)};
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  margin-bottom: 8px;
  border-radius: 10px;
  gap: 10px;
  flex-basis: 100%;
  border: 2px solid black;

  &:focus-visible {
    outline: 2px solid var(--focus-color);
    outline-offset: 2px;
  }
`;

const CheckIconContainer = styled(motion.div)`
  position: absolute;
  top: -10px;
  right: -10px;
`;

const Check = styled(IonIcon)`
  width: 2.5em;
  height: 2.5em;
`;

const Characters = styled(SubjectChars)`
  display: flex;
  flex-direction: column;
`;

const LvlBubble = styled.p`
  background-color: var(--ion-color-secondary);
  color: white;
  margin: 0;
  padding: 6px;
  border-radius: 0.8rem;
  border: 1px solid white;
`;

const SelectedInfoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 12px 10px 12px;
  justify-content: space-between;
  gap: 10px 5px;
`;

const NumSelectedContainer = styled.div`
  display: flex;
  margin: 0;
  font-size: 1rem;
  gap: 5px;
  align-items: center;
  text-align: center;
`;

const ButtonWrapper = styled(motion.div)`
  margin: 0;
  padding: 0;
`;

const SelectDeselectAllButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  padding: 5px;
  border-radius: 8px;
  border: 1px solid black;
`;

const SelectDeselectIcon = styled(IonIcon)`
  width: 1.5em;
  height: 1.5em;
`;

const NoAssignmentsContainer = styled.div`
  position: relative;
  width: 100%;
  z-index: 5;
  min-height: 350px;
  margin-bottom: 70px;
`;

const LogoContainer = styled(AbsoluteCenterContainer)`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 16px;
  text-align: center;
  z-index: 5;

  img {
    height: 250px;
  }
`;

const LogoContainerHeading = styled.h5`
  margin: 0 0 25px 0;
  width: 100%;
`;

type Props = {
  assignmentData: Assignment[];
  selectedAdvancedSubjIDs: string[];
  setSelectedAdvancedSubjIDs: React.Dispatch<React.SetStateAction<string[]>>;
  filterByCurrentLevel: boolean;
  filterByLastUpdate: LastUpdateChoice;
  assignmentTypeFilter?: SubjectType[];
  showMeaning?: boolean;
};

// TODO: break this down into smaller components
// TODO: allow different sort orders
function AssignmentSelector({
  assignmentData,
  selectedAdvancedSubjIDs,
  setSelectedAdvancedSubjIDs,
  filterByCurrentLevel,
  filterByLastUpdate,
  assignmentTypeFilter,
  showMeaning = true,
}: Props) {
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [areAllSelected, setAreAllSelected] = useState<boolean>(false);
  const { userInfo } = useUserInfoStoreFacade();
  const settingsType = useAssignmentSettingsCtxStore((s) => s.settingsType);

  const filteredAssignments = filterAssignmentsByLastUpdate(
    assignmentData,
    filterByLastUpdate.value
  );
  const assignmentSubjIDs = filteredAssignments.map(
    (assignmentItem: Assignment) => assignmentItem.subject_id
  );

  const { isLoading: subjectsLoading, data: subjectsData } =
    useSubjectsByIDs(assignmentSubjIDs);

  useEffect(() => {
    if (subjectsData) {
      const sortedAssignments = sortBySubjectTypeAndLevel(subjectsData);
      const subjectsFiltered = assignmentTypeFilter
        ? filterSubjectsByType(
            sortedAssignments,
            Array.from(assignmentTypeFilter)
          )
        : sortedAssignments;
      const subjectsFilteredByLevel =
        filterByCurrentLevel && userInfo && userInfo.level
          ? filterSubjectsByLevel(subjectsFiltered, userInfo.level)
          : subjectsFiltered;

      setAvailableSubjects(subjectsFilteredByLevel);
    } else {
      setAvailableSubjects([]);
    }
  }, [
    subjectsLoading,
    assignmentTypeFilter,
    filterByCurrentLevel,
    subjectsData?.length,
  ]);

  const onSelectDeselectAllPress = () => {
    if (areAllSelected) {
      setSelectedAdvancedSubjIDs([]);
    } else {
      setSelectedAdvancedSubjIDs(
        availableSubjects.map((subject) => `${subject.id}`)
      );
    }
    setAreAllSelected(!areAllSelected);
  };

  return (
    <>
      {availableSubjects ? (
        availableSubjects.length === 0 ? (
          <NoAssignmentsContainer>
            <LogoContainer>
              <LogoContainerHeading>
                Hmm, looks like we can't find any {settingsType}s using those
                filters...
              </LogoContainerHeading>
              <img
                src={LogoExclamation}
                alt="Unhappy crabigator looking upwards"
              />
            </LogoContainer>
          </NoAssignmentsContainer>
        ) : (
          <>
            <SelectedInfoContainer>
              <NumSelectedContainer>
                <Counter
                  value={selectedAdvancedSubjIDs.length}
                  maxNum={availableSubjects.length}
                />
                selected out of{" "}
                <Counter
                  value={availableSubjects.length}
                  maxNum={availableSubjects.length}
                />
              </NumSelectedContainer>
              <AnimatePresence mode="wait">
                {areAllSelected ? (
                  <ButtonWrapper
                    key="deselect_all"
                    transition={{
                      type: "spring",
                      duration: 0.5,
                      bounce: 0.5,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <SelectDeselectAllButton
                      onPress={onSelectDeselectAllPress}
                      backgroundColor="var(--ion-color-danger)"
                    >
                      Deselect All
                      <SelectDeselectIcon src={RemoveIcon} />
                    </SelectDeselectAllButton>
                  </ButtonWrapper>
                ) : (
                  <ButtonWrapper
                    key="select_all"
                    transition={{
                      type: "spring",
                      duration: 0.75,
                      bounce: 0.5,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <SelectDeselectAllButton
                      onPress={onSelectDeselectAllPress}
                      backgroundColor="var(--ion-color-tertiary)"
                      color="black"
                    >
                      Select All
                      <SelectDeselectIcon
                        src={areAllSelected ? RemoveIcon : CheckIcon}
                      />
                    </SelectDeselectAllButton>
                  </ButtonWrapper>
                )}
              </AnimatePresence>
            </SelectedInfoContainer>
            <SubjectList
              type="multiple"
              value={selectedAdvancedSubjIDs}
              onValueChange={setSelectedAdvancedSubjIDs}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {(availableSubjects as Subject[]).map(
                  (subject: Subject, index: number) => (
                    <ToggleGroup.Item
                      value={`${subject.id}`}
                      key={`toggle_item_${subject.id}`}
                      asChild
                    >
                      <SubjectItem
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          opacity: { duration: 0.2 },
                          scale: { duration: 0.2 },
                          layout: {
                            type: "spring",
                            bounce: 0.2,
                            duration: Math.max(0.2, Math.min(index * 0.2, 2)),
                          },
                        }}
                        subjtype={subject.object}
                      >
                        <Characters subject={subject} fontSize="2rem" />
                        {showMeaning && subject.object === "radical" && (
                          <RadicalMeaning radical={subject as Radical} />
                        )}

                        {showMeaning ? (
                          (subject.object === "kanji" ||
                            subject.object === "vocabulary" ||
                            subject.object === "kana_vocabulary") && (
                            <ReadingAndMeaning
                              subject={
                                subject as Kanji | Vocabulary | KanaVocabulary
                              }
                            />
                          )
                        ) : (
                          <LvlBubble>Lvl {subject.level}</LvlBubble>
                        )}
                        <AnimatePresence>
                          {selectedAdvancedSubjIDs.includes(
                            `${subject.id}`
                          ) && (
                            <CheckIconContainer
                              key={`${subject.id}`}
                              transition={{
                                type: "spring",
                                duration: 0.75,
                                bounce: 0.5,
                              }}
                              initial={{ scale: 0, rotate: 90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 90 }}
                            >
                              <Check
                                className="checkmark"
                                src={CheckCircleIcon}
                              />
                            </CheckIconContainer>
                          )}
                        </AnimatePresence>
                      </SubjectItem>
                    </ToggleGroup.Item>
                  )
                )}
              </AnimatePresence>
            </SubjectList>
          </>
        )
      ) : (
        <IonSkeletonText
          animated={true}
          style={{ height: "50px" }}
        ></IonSkeletonText>
      )}
    </>
  );
}

export default AssignmentSelector;
