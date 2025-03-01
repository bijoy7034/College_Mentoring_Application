import React, { useState } from "react";

const semesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

const fieldDetails = {
  traits: {
    goal: "Write down the initiatives for attaining your goal.",
    characterTraits:
      "Refer to tables 1, 2, and specify where you need improvement. Also, give comments on performance.",
    personalTraits: "Refer to tables 1, 2, and specify where you need help.",
    learningAbility: "Grasping power: Quick learner, moderate, or slow.",
    groupDynamics: "Are you cooperative? Good in teamwork?",
    leadership: "Leadership quality: Excellent, good, or not a good leader.",
    sincerity: "Rate yourself in sincerity, accountability, and punctuality.",
  },
  curricular: {
    universityResult: "Enter your university exam result for this semester.",
    studyHabits: "Describe your working/study habits and reading habits.",
    onlineMaterial: "How frequently do you use online study material?",
    professionalActivities:
      "Are you involved in professional bodies (IEEE, ACM, etc.)?",
    extraActivities:
      "List your involvement in sports, games, culturals, or extracurricular activities.",
  },
};

const SemesterGrid = () => {
  const [data, setData] = useState(
    Array(8).fill({
      curricular: {
        universityResult: "",
        studyHabits: "",
        onlineMaterial: "",
        professionalActivities: "",
        extraActivities: "",
      },
      traits: {
        goal: "",
        characterTraits: "",
        personalTraits: "",
        learningAbility: "",
        groupDynamics: "",
        leadership: "",
        sincerity: "",
      },
    })
  );

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (index, section, field, value) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [section]: {
          ...newData[index][section],
          [field]: value,
        },
      };
      return newData;
    });
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Semester Details</h2>
      <div className="row">
        {semesters.map((sem, index) => (
          <React.Fragment key={index}>
            <div className="col-md-6 col-lg-3 mb-4">
              <div
                className={`card text-white bg-primary shadow-sm rounded ${
                  expandedIndex === index ? "active" : ""
                }`}
                onClick={() => toggleExpand(index)}
                style={{ cursor: "pointer", transition: "0.3s" }}
              >
                <div className="card-body text-center">
                  <h5 className="card-title">{sem}</h5>
                </div>
              </div>
            </div>

            {expandedIndex === index && (
              <div className="col-12 m-3">
                <div className="card mt-2 shadow-sm p-3">
                  <div className="card-body">
                    <h5 className="text-primary">Curricular Details</h5>
                    <div className="row">
                      {Object.entries(data[index].curricular).map(
                        ([field, value]) => (
                          <div key={field} className="col-md-6 mb-2">
                            <label className="form-label">
                              {field
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .replace(/^./, (str) => str.toUpperCase())}
                            </label>

                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "curricular",
                                  field,
                                  e.target.value
                                )
                              }
                              className="form-control"
                            />
                            <small className="text-muted">
                              {fieldDetails.curricular[field]}
                            </small>
                          </div>
                        )
                      )}
                    </div>

                    <h5 className="text-primary mt-3">Traits & Habits</h5>
                    <div className="row">
                      {Object.entries(data[index].traits).map(
                        ([field, value]) => (
                          <div key={field} className="col-md-6 mb-2">
                            <label className="form-label">
                            {field
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .replace(/^./, (str) => str.toUpperCase())}
                            </label>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "traits",
                                  field,
                                  e.target.value
                                )
                              }
                              className="form-control"
                            />
                            <small className="text-muted">
                              {fieldDetails.traits[field]}
                            </small>
                          </div>
                        )
                      )}
                    </div>

                    <button
                      className="btn btn-success mt-3"
                      onClick={() => setShowModal(true)}
                    >
                      Show Character & Personality Traits
                    </button>

                    <button
                      className="btn btn-danger mt-3 ms-2"
                      onClick={() => setExpandedIndex(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
                <br />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Bootstrap Modal for Table 1 and Table 2 */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Traits & Habits of Mentee</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                {/* Table 1 */}
                <h5>Table 1: Character Traits</h5>
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Character Traits</th>
                      <th>Related Traits</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Honesty</td>
                      <td>Truthfulness, Loyalty, Integrity</td>
                    </tr>
                    <tr>
                      <td>Responsibility</td>
                      <td>Dependability, Reliability</td>
                    </tr>
                    <tr>
                      <td>Perseverance</td>
                      <td>Diligence, Patience</td>
                    </tr>
                    <tr>
                      <td>Caring</td>
                      <td>Kindness, Compassion, Generosity</td>
                    </tr>
                    <tr>
                      <td>Respect</td>
                      <td>Self Respect, Respect for others</td>
                    </tr>
                    <tr>
                      <td>Self-Discipline</td>
                      <td>Self Control</td>
                    </tr>
                    <tr>
                      <td>Integrity</td>
                      <td>Honesty, Trustworthiness</td>
                    </tr>
                    <tr>
                      <td>Courage</td>
                      <td>Fortitude, Determination</td>
                    </tr>
                  </tbody>
                </table>

                {/* Table 2 */}
                <h5>Table 2: Positive & Negative Traits</h5>
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Positive Traits</th>
                      <th>Negative Traits</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Accepts authority, loyal, devoted</td>
                      <td>Rebellious</td>
                    </tr>
                    <tr>
                      <td>Aspiring, ambitious, motivated</td>
                      <td>Self-satisfied, unmotivated</td>
                    </tr>
                    <tr>
                      <td>Cheerful</td>
                      <td>Cheerless, gloomy, sour, grumpy</td>
                    </tr>
                    <tr>
                      <td>Determined</td>
                      <td>Indecisive, unsure</td>
                    </tr>
                    <tr>
                      <td>Does what is necessary, right</td>
                      <td>Does what is convenient</td>
                    </tr>
                    <tr>
                      <td>Enthusiastic</td>
                      <td>Rude, impolite</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterGrid;
