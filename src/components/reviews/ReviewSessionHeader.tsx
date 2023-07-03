import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  useIonRouter,
} from "@ionic/react";

import HomeIcon from "../../images/home.svg";
import styled from "styled-components/macro";
import { SubjectType } from "../../types/Subject";
import { getSubjectColor } from "../../services/SubjectAndAssignmentService";
import { useReviewQueue } from "../../hooks/useReviewQueue";
import { ReviewQueueItem } from "../../types/ReviewSessionTypes";

type HeaderStyleProps = {
  subjType: SubjectType;
};

const SessionHeader = styled(IonHeader)<HeaderStyleProps>`
  box-shadow: none;
  --ion-toolbar-background: ${({ subjType }) => getSubjectColor(subjType)};
  --ion-background-color: ${({ subjType }) => getSubjectColor(subjType)};
  background-color: ${({ subjType }) => getSubjectColor(subjType)};

  button::part(native) {
    padding-inline-start: 0;
    padding-inline-end: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const Toolbar = styled(IonToolbar)`
  padding: 5px 0;
  --ion-safe-area-top: 5px;
  padding-top: var(--ion-safe-area-top, 5px);
`;

const NumReviewsLeftContainer = styled.div`
  text-align: end;
  padding-right: 22px;
`;

const NumReviewsLeftText = styled.p`
  font-size: 1.5rem;
  margin: 0;
`;

const HomeBtn = styled(IonButton)`
  ion-icon {
    font-size: 36px;
  }
`;

const HomeIconStyled = styled(IonIcon)`
  .sc-ion-buttons-md-s ion-icon[slot="icon-only"] {
    font-size: 64px;
  }
`;

type Props = {
  currentReviewItem: ReviewQueueItem;
};

export const ReviewSessionHeader = ({ currentReviewItem }: Props) => {
  const router = useIonRouter();
  const { queueDataState } = useReviewQueue();
  let currItemSubjType = currentReviewItem.object as SubjectType;

  let notReviewed = queueDataState.reviewQueue.filter(
    (reviewItem) => reviewItem.is_reviewed === false
  );

  // TODO: calculate some other way, this is showing wrong #
  let numUniqueItemsInQueue = [
    ...new Map(
      notReviewed.map((unreviewedCard) => [
        unreviewedCard.assignment_id,
        unreviewedCard,
      ])
    ).values(),
  ].length;

  return (
    <SessionHeader subjType={currItemSubjType}>
      <Toolbar>
        <IonButtons slot="start">
          <HomeBtn
            onClick={() => router.push("/home")}
            className="ion-no-padding ion-no-margin"
          >
            <HomeIconStyled icon={HomeIcon}></HomeIconStyled>
          </HomeBtn>
        </IonButtons>
        <NumReviewsLeftContainer>
          <NumReviewsLeftText>{numUniqueItemsInQueue}</NumReviewsLeftText>
        </NumReviewsLeftContainer>
      </Toolbar>
    </SessionHeader>
  );
};