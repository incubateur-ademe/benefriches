import type { AdminUserTimelineEvent } from "../../core/admin.types";
import { getTimelineEventLabel } from "../../core/timelineEventLabel";
import { formatAdminDate } from "../formatAdminDate";

type Props = {
  events: AdminUserTimelineEvent[];
};

function AdminUserTimeline({ events }: Props) {
  if (events.length === 0) return <p>Aucune activité enregistrée.</p>;

  const sortedEvents = events.toSorted(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <ol className="list-none p-0 m-0 border-l-2 border-border-grey">
      {sortedEvents.map((event, index) => (
        <li key={`${event.type}-${event.date}-${event.entityId ?? index}`} className="pl-6 pb-4">
          <time dateTime={event.date} className="block text-sm text-(--text-mention-grey)">
            {formatAdminDate(event.date)}
          </time>
          <span>{getTimelineEventLabel(event)}</span>
        </li>
      ))}
    </ol>
  );
}

export default AdminUserTimeline;
