import React from 'react';

interface RTBSkillViewProps {
  skillData: {
    title: string;
    description: string;
    coachName: string;
    coachImage: string;
  };
}

const RTBSkillView: React.FC<RTBSkillViewProps> = ({ skillData }) => {
  return (
    <div className="skill-view">
      <h2>{skillData.title}</h2>
      <img src={skillData.coachImage} alt={skillData.coachName} className="coach-image" />
      <p>{skillData.description}</p>
      <p>Coached by: {skillData.coachName}</p>
    </div>
  );
};

export default RTBSkillView;
