import { useState } from "react";
import { useAssignmentSettingsCtxStore } from "../../stores/useAssignmentSettingsCtxStore/useAssignmentSettingsCtxStore";
import { AssignmentTypeName } from "../AssignmentTypeSelector/AssignmentTypeSelector.types";
import { SubjectType } from "../../types/Subject";
import { LastUpdateChoice } from "../LastUpdateOption/LastUpdateOption.types";
import AssignmentTypeSelector from "../AssignmentTypeSelector";
import Collapsible from "../Collapsible";
import BackToBackOption from "../BackToBackOption";
import CurrentLevelOnlyOption from "../CurrentLevelOnlyOption";
import LastUpdateOption from "../LastUpdateOption";
import styled from "styled-components";

const FilterSettingContainer = styled.div`
  display: flex;
  margin-bottom: 12px;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
`;

type Props = {
  availableAssignmentTypeNames: AssignmentTypeName[];
  selectedAssignmentTypes: SubjectType[];
  setSelectedAssignmentTypes: (assignmentTypesSelected: SubjectType[]) => void;
  showBackToBackOption: boolean;
  lastUpdateChoice: LastUpdateChoice;
  setLastUpdateChoice: (selectedLastUpdate: LastUpdateChoice) => void;
  filterByCurrentLevel: boolean;
  setFilterByCurrentLevel: (isFilteringByCurrLvl: boolean) => void;
};

function AdvancedAssignmentFilters({
  availableAssignmentTypeNames,
  selectedAssignmentTypes,
  setSelectedAssignmentTypes,
  showBackToBackOption,
  lastUpdateChoice,
  setLastUpdateChoice,
  filterByCurrentLevel,
  setFilterByCurrentLevel,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const backToBackChoice = useAssignmentSettingsCtxStore(
    (s) => s.backToBackChoice
  );
  const setBackToBackChoice = useAssignmentSettingsCtxStore(
    (s) => s.setBackToBackChoice
  );

  return (
    <Collapsible title="Filters" isOpen={isOpen} setIsOpen={setIsOpen}>
      <FilterSettingContainer>
        <AssignmentTypeSelector
          headingFontSize="small"
          availableAssignmentTypeNames={availableAssignmentTypeNames}
          selectedAssignmentTypes={selectedAssignmentTypes}
          setSelectedAssignmentTypes={setSelectedAssignmentTypes}
        />
      </FilterSettingContainer>
      {showBackToBackOption && (
        <FilterSettingContainer>
          <BackToBackOption
            headingFontSize="small"
            backToBackChoice={backToBackChoice}
            setBackToBackChoice={setBackToBackChoice}
          />
        </FilterSettingContainer>
      )}
      <FilterSettingContainer>
        <LastUpdateOption
          lastUpdateChoice={lastUpdateChoice}
          onLastUpdateChoiceChange={setLastUpdateChoice}
          headingFontSize="small"
        />
      </FilterSettingContainer>
      <FilterSettingContainer>
        <CurrentLevelOnlyOption
          isSwitchedOn={filterByCurrentLevel}
          setIsSwitchedOn={setFilterByCurrentLevel}
          headingFontSize="small"
        />
      </FilterSettingContainer>
    </Collapsible>
  );
}

export default AdvancedAssignmentFilters;
