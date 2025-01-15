import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";

const Selector = () => {
  return (
    <>
      <IonSegment value="default">
        <IonSegmentButton value="default">
          <IonLabel>Default</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="segment">
          <IonLabel>Segment</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </>
  );
};

export default Selector;
