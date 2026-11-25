import { useState } from 'react';
import { Icon } from '../../../shared/components/Icons';
import { TEAM } from '../../../shared/data/team';
import type { TeamMember } from '../../../shared/types';
import { SectionHeading } from './SectionHeading';

/**
 * Gets the initials of a name, used while the profile photo is not available
 * @param name full name of the person
 * @returns the first letter of the first name and of the first surname
 */
function initials(name: string): string {
  const words = name.split(' ');
  let second = '';
  if (words.length >= 3) {
    second = words[words.length - 2].charAt(0);
  } else if (words.length === 2) {
    second = words[1].charAt(0);
  }
  return `${words[0].charAt(0)}${second}`;
}

/**
 * Card of one member with the GitHub profile photo
 * @param props member of the team
 * @returns the member card
 */
function MemberCard({ member }: { member: TeamMember }) {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <a className="member" href={`https://github.com/${member.github}`} target="_blank" rel="noreferrer">
      <span className="member-avatar">
        {!photoFailed && (
          <img
            src={`https://github.com/${member.github}.png?size=160`}
            alt=""
            loading="lazy"
            onError={() => setPhotoFailed(true)}
          />
        )}
        {photoFailed && <span>{initials(member.name)}</span>}
      </span>
      <strong>{member.name}</strong>
      <span className="member-github">
        <Icon name="github" />
        {member.github}
      </span>
    </a>
  );
}

/**
 * The people who built the project
 * @returns the team section
 */
export function TeamSection() {
  return (
    <section className="section" id="equipo">
      <div className="section-inner">
        <SectionHeading eyebrow="Equipo" title="Quiénes lo construyeron">
          {TEAM.length} estudiantes de la Escuela Colombiana de Ingeniería que diseñaron, desarrollaron y desplegaron
          CampusSeguro trabajando en conjunto.
        </SectionHeading>
        <div className="team-grid">
          {TEAM.map((member) => (
            <MemberCard key={member.github} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
