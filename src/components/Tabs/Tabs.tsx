import { useTabListState } from "react-stately";
import { useRef } from "react";
import {
  useTab,
  useTabList,
  useTabPanel,
  AriaTabListProps,
  AriaTabProps,
  AriaTabPanelProps,
} from "react-aria";
import { Orientation, Node } from "@react-types/shared";
import { TabListState } from "@react-stately/tabs";
import styled from "styled-components/macro";

const TabItemsContainer = styled.div`
  display: flex;
  position: relative;
  margin: 10px;
  border: 2px solid lightgray;
  padding: 4px 2px;
  border-radius: 24px;
  z-index: 0;
  justify-content: space-evenly;

  [role="tablist"] {
    display: inline-flex;
  }

  [role="tab"] {
    padding: 8px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: default;
    outline: none;
    border-radius: 20px;
    color: white;
    transition: color 150ms;
    flex-grow: 1;
    text-align: center;
  }

  [role="tab"][aria-selected="true"] {
    color: white;
    background-color: var(--ion-color-secondary);
  }

  [role="tabpanel"] {
    padding: 18px 24px;
  }
`;

function Tabs(props: AriaTabListProps<AriaTabProps>) {
  let state = useTabListState(props);
  let ref = useRef(null);
  let { tabListProps } = useTabList(props, state, ref);

  return (
    <div className={`${props.orientation || undefined}`}>
      <TabItemsContainer {...tabListProps} ref={ref}>
        {[...state.collection].map((item: Node<AriaTabProps>) => (
          <Tab
            key={item.key}
            item={item}
            state={state}
            orientation={props.orientation}
          />
        ))}
      </TabItemsContainer>
      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
}

function Tab({
  item,
  state,
}: {
  item: Node<AriaTabProps>;
  state: TabListState<AriaTabProps>;
  orientation?: Orientation;
}) {
  let { key, rendered } = item;
  let ref = useRef(null);
  let { tabProps } = useTab({ key }, state, ref);

  return (
    <div {...tabProps} ref={ref}>
      {rendered}
    </div>
  );
}

function TabPanel({
  state,
  ...props
}: AriaTabPanelProps & { state: TabListState<AriaTabProps> }) {
  let ref = useRef(null);
  let { tabPanelProps } = useTabPanel(props, state, ref);

  return (
    <div {...tabPanelProps} ref={ref}>
      {state.selectedItem?.props.children}
    </div>
  );
}

export default Tabs;