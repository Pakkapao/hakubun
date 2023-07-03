import {
  ReviewSessionQueueState,
  ReviewSessionQueueAction,
} from "../types/ReviewSessionTypes";

// TODO: add option to hide popover, used for when new session is starting
export const reviewSessionQueueReducer = (
  state: ReviewSessionQueueState,
  action: ReviewSessionQueueAction
) => {
  switch (action.type) {
    case "CORRECT_SHOW_RESULT":
      return { ...state, isBottomSheetVisible: true };
    case "CORRECT_MOVE_TO_NEXT":
      // TODO: rn just adding to back of queue, change to add to some random spot
      return {
        ...state,
        isBottomSheetVisible: false,
        displayPopoverMsg: false,
        currReviewCardIndex: state.currReviewCardIndex + 1,
      };
    case "WRONG_SHOW_RESULT":
      return {
        ...state,
        isBottomSheetVisible: true,
        showRetryButton: true,
      };
    case "WRONG_MOVE_TO_NEXT":
      // TODO: rn just adding to back of queue, change to add to some random spot
      return {
        ...state,
        isBottomSheetVisible: false,
        showRetryButton: false,
        displayPopoverMsg: false,
        currReviewCardIndex: state.currReviewCardIndex + 1,
      };
    case "WRONG_SHOW_RESULT":
      return {
        ...state,
        isBottomSheetVisible: true,
        showRetryButton: true,
      };
    case "SUBMIT_CHOICE":
      return {
        ...state,
        isSecondClick: !state.isSecondClick,
      };
    case "RETRY_REVIEW":
      return {
        ...state,
        isSecondClick: false,
        displayPopoverMsg: false,
        isBottomSheetVisible: false,
        showRetryButton: false,
      };
    case "SHOW_POPOVER_MSG":
      return {
        ...state,
        popoverInfo: action.payload,
        displayPopoverMsg: true,
      };
    case "RESET_REVIEW_CARDS":
      return {
        ...state,
        currReviewCardIndex: 0,
        displayPopoverMsg: false,
        isSecondClick: false,
        isBottomSheetVisible: false,
        showRetryButton: false,
      };
    default: {
      throw new Error(
        `Unhandled review session queue reducer action type: ${action.type}`
      );
    }
  }
};