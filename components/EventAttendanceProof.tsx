import React from 'react';

interface Poap {
  event: {
    name: string;
    description: string;
  };
  imageUrl: string;
}

interface EventAttendanceProofProps {
  poaps: Poap[];
}

const EventAttendanceProof: React.FC<EventAttendanceProofProps> = ({ poaps }: EventAttendanceProofProps) => {
  return (
    <div className="event-attendance-proof">
      <h2>Event Attendance Proof</h2>
      {poaps.length === 0 ? (
        <p>No POAPs found for this event.</p>
      ) : (
        <ul>
          {poaps.map((poap, index) => (
            <li key={index}>
              <h3>{poap.event.name}</h3>
              <p>{poap.event.description}</p>
              <img src={poap.imageUrl} alt={`POAP for ${poap.event.name}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// PropTypes validation removed as we're using TypeScript interfaces

export default EventAttendanceProof;
