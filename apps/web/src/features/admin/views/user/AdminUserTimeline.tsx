import Badge from "@codegouvfr/react-dsfr/Badge";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { useId, useState } from "react";

import type { AdminUserTimelineEvent } from "../../core/admin.types";
import { formatAdminDate } from "../formatAdminDate";
import {
  getTimelineEventBadge,
  getTimelineEventCategory,
  getTimelineEventDetail,
  isTimelineEventInError,
  type TimelineEventCategory,
} from "./timelineEventDisplay";
import { getTimelineEventLabel } from "./timelineEventLabel";

type Props = {
  events: AdminUserTimelineEvent[];
  lifecycleEmailMaxAttempts: number;
};

type TimelineFilter = "all" | TimelineEventCategory;

type KeyedTimelineEvent = { key: string; event: AdminUserTimelineEvent };

const FILTERS: { value: TimelineFilter; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "activity", label: "Activité" },
  { value: "email", label: "Emails" },
];

const EMPTY_MESSAGE = "Aucune activité enregistrée.";

function withTimelineKeys(events: AdminUserTimelineEvent[]): KeyedTimelineEvent[] {
  const occurrencesByBaseKey = new Map<string, number>();

  return events.map((event) => {
    const baseKey = `${event.type}|${event.date}|${event.entityId ?? ""}|${event.emailType ?? ""}`;
    const occurrences = occurrencesByBaseKey.get(baseKey) ?? 0;
    occurrencesByBaseKey.set(baseKey, occurrences + 1);
    return { key: occurrences === 0 ? baseKey : `${baseKey}#${occurrences}`, event };
  });
}

function getMarkerLabel(event: AdminUserTimelineEvent): string {
  if (isTimelineEventInError(event)) return "Email en échec";
  return getTimelineEventCategory(event) === "email" ? "Email" : "Activité";
}

function TimelineMarker({ event }: { event: AdminUserTimelineEvent }) {
  const icon =
    getTimelineEventCategory(event) === "email" ? "fr-icon-mail-line" : "fr-icon-user-line";
  const colors = isTimelineEventInError(event)
    ? "border-(--text-default-error) text-(--text-default-error) bg-(--background-contrast-error)"
    : "border-border-grey text-(--text-mention-grey) bg-(--background-default-grey)";

  return (
    <span
      role="img"
      aria-label={getMarkerLabel(event)}
      className={`absolute -left-[13px] top-0 flex size-6 items-center justify-center rounded-full border-2 ${colors}`}
    >
      <span className={`${icon} fr-icon--sm`} aria-hidden="true" />
    </span>
  );
}

function TimelineEvent({
  event,
  lifecycleEmailMaxAttempts,
}: {
  event: AdminUserTimelineEvent;
  lifecycleEmailMaxAttempts: number;
}) {
  const badge = getTimelineEventBadge(event);
  const detail = getTimelineEventDetail(event, lifecycleEmailMaxAttempts);

  return (
    <li className="relative pl-6 pb-4">
      <TimelineMarker event={event} />
      <time dateTime={event.date} className="block text-sm text-(--text-mention-grey)">
        {formatAdminDate(event.date)}
      </time>
      <span>{getTimelineEventLabel(event)}</span>
      {badge && (
        <Badge as="span" small noIcon severity={badge.severity} className="ml-2">
          {badge.label}
        </Badge>
      )}
      {detail && <p className="m-0 text-sm text-(--text-mention-grey)">{detail}</p>}
    </li>
  );
}

function AdminUserTimeline({ events, lifecycleEmailMaxAttempts }: Props) {
  const [filter, setFilter] = useState<TimelineFilter>("all");
  const headingId = useId();

  const heading = (
    <h2 id={headingId} className="text-xl">
      Activité
    </h2>
  );

  if (events.length === 0) {
    return (
      <>
        {heading}
        <p>{EMPTY_MESSAGE}</p>
      </>
    );
  }

  const visibleEvents = withTimelineKeys(events)
    .filter(({ event }) => filter === "all" || getTimelineEventCategory(event) === filter)
    .toSorted((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime());

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {heading}
        <ul className="fr-tags-group">
          {FILTERS.map(({ value, label }) => (
            <li key={value}>
              <Tag
                pressed={filter === value}
                onClick={() => {
                  setFilter(value);
                }}
                nativeButtonProps={{ type: "button" }}
              >
                {label}
              </Tag>
            </li>
          ))}
        </ul>
      </div>
      {visibleEvents.length === 0 ? (
        <p>{EMPTY_MESSAGE}</p>
      ) : (
        <ol aria-labelledby={headingId} className="list-none p-0 m-0 border-l-2 border-border-grey">
          {visibleEvents.map(({ key, event }) => (
            <TimelineEvent
              key={key}
              event={event}
              lifecycleEmailMaxAttempts={lifecycleEmailMaxAttempts}
            />
          ))}
        </ol>
      )}
    </>
  );
}

export default AdminUserTimeline;
