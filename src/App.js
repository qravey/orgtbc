import React, { useState, useEffect } from "react";

const API_KEY = "QIACJgPcWDoR9xZTuu8s4zeb3k4WJTkN";
const ORG_SID = "ADI";

const StarRating = ({ stars, onRate }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3].map((star) => (
        <button
          key={star}
          className={`px-2 py-1 rounded-full ${star <= stars ? "bg-yellow-400" : "bg-gray-200"}`}
          onClick={() => onRate(star)}
        >
          ⭐
        </button>
      ))}
    </div>
  );
};

const OrganizationMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          `https://api.starcitizen-api.com/${API_KEY}/v1/live/organization_members/${ORG_SID}`
        );
        const data = await response.json();
        if (data.success) {
          setMembers(data.data);
        } else {
          throw new Error("Failed to fetch members");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleStarChange = (handle, newStars) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.handle === handle ? { ...member, stars: newStars } : member
      )
    );
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Organization Members</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Avatar</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Stars</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.handle} className="border border-gray-300">
              <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <img src={member.image} alt={member.display} className="w-12 h-12 rounded-full" />
              </td>
              <td className="border border-gray-300 px-4 py-2">{member.display}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <StarRating stars={member.stars} onRate={(newStars) => handleStarChange(member.handle, newStars)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <OrganizationMembers />
    </div>
  );
}
