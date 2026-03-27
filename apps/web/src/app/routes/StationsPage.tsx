import { useEffect, useState } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { getStationExplorerContent, getStationMapContent, getStationMapLayout, getStations } from '@/content/stations';
import { StationDetail } from '@/features/stations/StationDetail';
import { StationMap } from '@/features/stations/StationMap';
import { useLearnerProgress } from '@/lib/progress';

function shuffle<T>(items: T[]): T[] {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = next[index];
    next[index] = next[swapIndex];
    next[swapIndex] = current;
  }

  return next;
}

export function StationsPage() {
  const mapContent = getStationMapContent();
  const explorerContent = getStationExplorerContent();
  const layout = getStationMapLayout();
  const stations = getStations();
  const { state, setLastViewedStation, toggleStationBookmark, setModuleProgress, recordRecognitionAttempt } =
    useLearnerProgress();
  const [selectedStationId, setSelectedStationId] = useState<string>(state.lastViewedStationId ?? stations[0]?.id ?? '');
  const [flashcardOrder, setFlashcardOrder] = useState(() => stations.map((station) => station.id));
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardRevealed, setFlashcardRevealed] = useState(false);
  const [mapQuizIndex, setMapQuizIndex] = useState(0);
  const [mapQuizAnswer, setMapQuizAnswer] = useState<string | null>(null);
  const [challengeAnswer, setChallengeAnswer] = useState<string | null>(null);
  const selectedStation = stations.find((station) => station.id === selectedStationId);
  const currentFlashcard = stations.find((station) => station.id === flashcardOrder[flashcardIndex]) ?? stations[0];
  const currentQuizRound = mapContent.quizRounds[mapQuizIndex] ?? mapContent.quizRounds[0];
  const challengePrompt = selectedStation?.quizItems[0];
  const challengeStat = selectedStation ? state.stationRecognitionStats[selectedStation.id] : undefined;

  useEffect(() => {
    if (selectedStationId) {
      setLastViewedStation(selectedStationId);
      setModuleProgress('station-map', 35);
      setModuleProgress('station-explorer', 25);
    }
  }, [selectedStationId, setLastViewedStation, setModuleProgress]);

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Overview</div>
            <h2>Read the mediastinum as map plus correlate</h2>
          </div>
        </div>
        <div className="mini-card-grid">
          {mapContent.introSections.map((section) => (
            <article key={section.id} className="mini-card">
              <strong>{section.title}</strong>
              <p>{section.summary}</p>
              <span>{section.takeaway}</span>
            </article>
          ))}
          {explorerContent.introSections.map((section) => (
            <article key={section.id} className="mini-card">
              <strong>{section.title}</strong>
              <p>{section.summary}</p>
              <span>{section.takeaway}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Map</div>
            <h2>Core IASLC stations</h2>
          </div>
        </div>
        <div className="split-grid split-grid--map">
          <div className="stack-card">
            <StationMap
              layout={layout}
              onSelect={(stationId) => {
                setSelectedStationId(stationId);
                setMapQuizAnswer(null);
                setChallengeAnswer(null);
              }}
              selectedStationId={selectedStationId}
              stations={stations}
            />
            <div className="tag-row">
              {mapContent.mapTips.map((tip) => (
                <span key={tip} className="tag">
                  {tip}
                </span>
              ))}
            </div>
          </div>

          <div>
            {selectedStation ? (
              <StationDetail
                isBookmarked={state.bookmarkedStations.includes(selectedStation.id)}
                onToggleBookmark={toggleStationBookmark}
                station={selectedStation}
              />
            ) : (
              <EmptyState
                detail="Select a station from the map to open the detail card, media slots, and recognition challenge."
                icon="◎"
                title="No station selected"
              />
            )}
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Flashcards</div>
            <h2>{mapContent.flashcardPrompt}</h2>
          </div>
          <button
            className="button button--ghost"
            onClick={() => {
              setFlashcardOrder(shuffle(stations.map((station) => station.id)));
              setFlashcardIndex(0);
              setFlashcardRevealed(false);
              setModuleProgress('station-map', 50);
            }}
            type="button"
          >
            Shuffle
          </button>
        </div>

        {currentFlashcard ? (
          <div
            className="flashcard"
            onClick={() => setFlashcardRevealed((current) => !current)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setFlashcardRevealed((current) => !current);
              }
            }}
            role="button"
            tabIndex={0}
          >
            {!flashcardRevealed ? (
              <>
                <div className="flashcard__station">{currentFlashcard.id}</div>
                <span>Tap to reveal</span>
              </>
            ) : (
              <>
                <h3>{currentFlashcard.displayName}</h3>
                <p>{currentFlashcard.description}</p>
                <span>{currentFlashcard.memoryCues[0]}</span>
              </>
            )}
          </div>
        ) : null}

        <div className="button-row">
          <button
            className="button button--ghost"
            onClick={() => {
              setFlashcardIndex((index) => (index - 1 + flashcardOrder.length) % flashcardOrder.length);
              setFlashcardRevealed(false);
            }}
            type="button"
          >
            Previous
          </button>
          <button
            className="button"
            onClick={() => {
              setFlashcardIndex((index) => (index + 1) % flashcardOrder.length);
              setFlashcardRevealed(false);
            }}
            type="button"
          >
            Next
          </button>
        </div>
      </section>

      <div className="split-grid">
        <section className="section-card">
          <div className="section-card__heading">
            <div>
              <div className="eyebrow">Pin-the-station quiz</div>
              <h2>{currentQuizRound.prompt}</h2>
            </div>
          </div>
          <StationMap
            layout={layout}
            onSelect={(stationId) => {
              setMapQuizAnswer(stationId);
              if (stationId === currentQuizRound.stationId) {
                setModuleProgress('station-map', mapQuizIndex === mapContent.quizRounds.length - 1 ? 100 : 70, mapQuizIndex === mapContent.quizRounds.length - 1);
              }
            }}
            quizMode
            selectedStationId={mapQuizAnswer}
            stations={stations}
          />
          <div className={`feedback-banner${mapQuizAnswer === currentQuizRound.stationId ? ' feedback-banner--success' : ''}`}>
            <strong>{mapQuizAnswer ? (mapQuizAnswer === currentQuizRound.stationId ? 'Correct station' : 'Not quite') : 'Hint'}</strong>
            <p>{mapQuizAnswer ? currentQuizRound.hint : currentQuizRound.hint}</p>
          </div>
          <div className="button-row">
            <button
              className="button button--ghost"
              disabled={mapQuizIndex === 0}
              onClick={() => {
                setMapQuizIndex((index) => index - 1);
                setMapQuizAnswer(null);
              }}
              type="button"
            >
              Previous
            </button>
            <button
              className="button"
              disabled={mapQuizIndex === mapContent.quizRounds.length - 1}
              onClick={() => {
                setMapQuizIndex((index) => index + 1);
                setMapQuizAnswer(null);
              }}
              type="button"
            >
              Next
            </button>
          </div>
        </section>

        <section className="section-card">
          <div className="section-card__heading">
            <div>
              <div className="eyebrow">Recognition challenge</div>
              <h2>{challengePrompt?.prompt ?? 'Select a station to load a challenge.'}</h2>
            </div>
          </div>
          {selectedStation && challengePrompt ? (
            <>
              <div className="stack-list">
                {challengePrompt.optionIds.map((optionId) => (
                  <button
                    key={optionId}
                    className={`choice-card${challengeAnswer === optionId ? ' choice-card--selected' : ''}${
                      challengeAnswer
                        ? optionId === selectedStation.id
                          ? ' choice-card--correct'
                          : challengeAnswer === optionId
                            ? ' choice-card--incorrect'
                            : ''
                        : ''
                    }`}
                    onClick={() => {
                      setChallengeAnswer(optionId);
                      recordRecognitionAttempt(selectedStation.id, optionId === selectedStation.id);
                      setModuleProgress('station-explorer', optionId === selectedStation.id ? 80 : 55);
                    }}
                    type="button"
                  >
                    <strong>{optionId}</strong>
                  </button>
                ))}
              </div>
              <div className={`feedback-banner${challengeAnswer === selectedStation.id ? ' feedback-banner--success' : ''}`}>
                <strong>{challengeAnswer ? (challengeAnswer === selectedStation.id ? 'Correct' : 'Review the correlate') : 'Use the selected station detail card'}</strong>
                <p>
                  {challengeAnswer
                    ? selectedStation.views[challengePrompt.viewId].caption
                    : 'The selected station detail card stays synchronized with this challenge so you can compare cues before answering.'}
                </p>
                {challengeStat ? (
                  <p>
                    {challengeStat.correct}/{challengeStat.attempts} correct for {selectedStation.id}
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <EmptyState
              detail="Pick a station on the map to open a synchronized correlate challenge."
              icon="◌"
              title="Challenge waits for a station"
            />
          )}
        </section>
      </div>
    </div>
  );
}
