import React, { createContext, useContext } from "react";
import { useReviewSessionInfo, Session } from "../hooks/useReviewSessionInfo";
import { Assignment } from "../types/Assignment";
import { Subject } from "../types/Subject";

type ReviewSessionContextData = {
  reviewSession: Session | null;
  reviewSessionInProgress: boolean;
  startReviewSession: (subjectssToReview: Subject[]) => void;
  getSessionAssignmentsAndSubjIDs: () => {
    assignments: Assignment[];
    subjIDs: number[];
  };
  setSessionAssignments: (assignmentsToReview: Assignment[]) => void;
  endReviewSession: () => void;
};

const ReviewSessionContext = createContext<ReviewSessionContextData>(
  {} as ReviewSessionContextData
);

type ProviderProps = {
  children?: React.ReactNode;
};

const ReviewSessionProvider = ({ children }: ProviderProps) => {
  const {
    reviewSession,
    reviewSessionInProgress,
    getSessionAssignmentsAndSubjIDs,
    setSessionAssignments,
    startReviewSession,
    endReviewSession,
  } = useReviewSessionInfo();

  return (
    <ReviewSessionContext.Provider
      value={{
        reviewSession,
        reviewSessionInProgress,
        getSessionAssignmentsAndSubjIDs,
        setSessionAssignments,
        startReviewSession,
        endReviewSession,
      }}
    >
      {children}
    </ReviewSessionContext.Provider>
  );
};

const useReviewSession = () => {
  const context = useContext(ReviewSessionContext);

  if (!context) {
    throw new Error(
      "useReviewSession must be used within a ReviewSessionProvider"
    );
  }

  return context;
};

export { ReviewSessionContext, ReviewSessionProvider, useReviewSession };
