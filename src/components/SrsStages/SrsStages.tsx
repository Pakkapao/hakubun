import { IonCol, IonGrid, IonRow } from "@ionic/react";
import { SrsLevelName } from "../../types/MiscTypes";
import { getSrsLevelColor } from "../../services/SubjectAndAssignmentService";
import { useAssignmentsByStage } from "../../hooks/useAssignmentsByStage";
import SrsStagesLoadingSkeleton from "./SrsStagesLoadingSkeleton";
import styled from "styled-components";

const SrsButtonContainer = styled(IonGrid)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0;
`;

const ButtonRowContainer = styled(IonRow)`
  width: 100%;
`;

type ButtonProps = {
  srsStage: SrsLevelName;
};

const SrsStageButton = styled.button<ButtonProps>`
  width: 100%;
  margin: 0;
  padding: 10px 0;
  color: white;
  border-radius: 6px;
  background: ${({ srsStage }) => getSrsLevelColor(srsStage)};
  &:focus-visible {
    outline: 2px solid white;
    --outline: 2px solid white;
  }
`;

const NumItemsInStage = styled.p`
  margin: 5px 0;
  font-size: 1.25rem;
  font-weight: 700;
`;

const StageName = styled.p`
  margin: 5px 0;
  font-size: 1rem;
  text-transform: uppercase;
`;

function SrsStages() {
  const {
    isLoading: apprenticeStageDataLoading,
    data: apprenticeStageData,
    error: apprenticeStageErr,
  } = useAssignmentsByStage("apprentice");

  const {
    isLoading: guruStageDataLoading,
    data: guruStageData,
    error: guruStageDataErr,
  } = useAssignmentsByStage("guru");

  const {
    isLoading: masterStageDataLoading,
    data: masterStageData,
    error: masterStageErr,
  } = useAssignmentsByStage("master");

  const {
    isLoading: enlightenedStageDataLoading,
    data: enlightenedStageData,
    error: enlightenedStageErr,
  } = useAssignmentsByStage("enlightened");

  const {
    isLoading: burnedStageDataLoading,
    data: burnedStageData,
    error: burnedStageErr,
  } = useAssignmentsByStage("burned");

  let stagesLoading =
    apprenticeStageDataLoading ||
    guruStageDataLoading ||
    masterStageDataLoading ||
    enlightenedStageDataLoading ||
    burnedStageDataLoading;

  if (stagesLoading) {
    <SrsButtonContainer>
      <ButtonRowContainer>
        <SrsStagesLoadingSkeleton></SrsStagesLoadingSkeleton>
      </ButtonRowContainer>
    </SrsButtonContainer>;
  }

  return (
    <SrsButtonContainer>
      <ButtonRowContainer>
        <IonCol size-xs="6" size-md="3">
          <SrsStageButton
            srsStage="apprentice"
            aria-label="Apprentice SRS Stage"
          >
            <div>
              {apprenticeStageData && (
                <NumItemsInStage>{apprenticeStageData.length}</NumItemsInStage>
              )}
              <StageName>Apprentice</StageName>
            </div>
          </SrsStageButton>
        </IonCol>
        <IonCol size-xs="6" size-md="3">
          <SrsStageButton srsStage="guru" aria-label="Guru SRS Stage">
            <div>
              {guruStageData && (
                <NumItemsInStage>{guruStageData.length}</NumItemsInStage>
              )}
              <StageName>Guru</StageName>
            </div>
          </SrsStageButton>
        </IonCol>
        <IonCol size-xs="6" size-md="3">
          <SrsStageButton srsStage="master" aria-label="Master SRS Stage">
            <div>
              {masterStageData && (
                <NumItemsInStage>{masterStageData.length}</NumItemsInStage>
              )}
              <StageName>Master</StageName>
            </div>
          </SrsStageButton>
        </IonCol>
        <IonCol size-xs="6" size-md="3">
          <SrsStageButton
            srsStage="enlightened"
            aria-label="Enlightened SRS Stage"
          >
            <div>
              {enlightenedStageData && (
                <NumItemsInStage>{enlightenedStageData.length}</NumItemsInStage>
              )}
              <StageName>Enlightened</StageName>
            </div>
          </SrsStageButton>
        </IonCol>
        <IonCol size-xs="12" size-md="6">
          <SrsStageButton srsStage="burned" aria-label="Burned SRS Stage">
            <div>
              {burnedStageData && (
                <NumItemsInStage>{burnedStageData.length}</NumItemsInStage>
              )}
              <StageName>Burned</StageName>
            </div>
          </SrsStageButton>
        </IonCol>
      </ButtonRowContainer>
    </SrsButtonContainer>
  );
}

export default SrsStages;
