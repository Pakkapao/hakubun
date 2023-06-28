import { IonIcon, IonRow, IonSkeletonText } from "@ionic/react";
import {
  Vocabulary,
  SubjectReading,
  PronunciationAudio,
} from "../../types/Subject";
import { getVocabReadings } from "../../services/SubjectAndAssignmentService";
import { useAudio } from "../../hooks/useAudio";
import { Readings, ReadingContainer } from "./SubjectDetailsStyled";
import styled from "styled-components/macro";
import SoundIcon from "../../images/sound.svg";

type AudioProps = {
  url: string;
};

const Btn = styled.button`
  background-color: transparent;
`;

const AudioBtn = ({ url }: AudioProps) => {
  const [playing, toggle] = useAudio(url);

  return (
    <Btn onClick={toggle}>
      <IonIcon icon={SoundIcon} />
    </Btn>
  );
};

const getAudioForReading = (
  audioItems: PronunciationAudio[],
  reading: SubjectReading
) => {
  let audioOptions = audioItems.filter(
    (audioOption: PronunciationAudio) =>
      audioOption.metadata.pronunciation === reading.reading
  );

  // TODO: change so not just getting first audio file, allow selecting based on voice in settings
  return audioOptions[0].url;
};

type VocabReadingProps = {
  vocab: Vocabulary;
};

const VocabReadingContainer = styled.div`
  display: flex;
  gap: 6px;
`;

// TODO: map reading to the pronunciation audio
export const VocabReadings = ({ vocab }: VocabReadingProps) => {
  let hasReadings = vocab.readings && vocab.readings.length !== 0;
  // TODO: refactor this, it's icky
  let readings;
  if (hasReadings) {
    readings = getVocabReadings(vocab.readings!);
    console.log(
      "🚀 ~ file: VocabReadings.tsx:113 ~ VocabReadings ~ readings:",
      readings
    );
  }
  // TODO: test layout with multiple pronunciations
  return hasReadings ? (
    <ReadingContainer>
      <IonRow>
        <Readings>
          <strong>Readings: </strong>
          {readings && readings.length
            ? readings.map((vocabReading: SubjectReading, index: number) => {
                return (
                  <VocabReadingContainer key={`reading_${index}`}>
                    <p>{vocabReading.reading}</p>
                    {hasReadings && (
                      <AudioBtn
                        url={getAudioForReading(
                          vocab.pronunciation_audios,
                          vocabReading
                        )}
                      />
                    )}
                  </VocabReadingContainer>
                );
              })
            : "-"}
        </Readings>
      </IonRow>
    </ReadingContainer>
  ) : (
    <ReadingContainer>
      <IonRow>
        <Readings>
          <strong>Readings: </strong>
          {vocab.characters}
        </Readings>
      </IonRow>
    </ReadingContainer>
  );
};
