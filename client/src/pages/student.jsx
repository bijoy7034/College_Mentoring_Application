import { useEffect, useState } from "react";
import StudentNav from "../components/studentNav";
import axios from "axios";
import Footer from "../components/footer";

const Student = () => {
    const [studentDetails, setStudentDetails] = useState(null);
    const [error, setError] = useState("");
    const [profile, setProfile] = useState(1)
    const [formData, setFormData] = useState({
        dob: "",
        grade_10: "",
        grade_12: "",
        blood_group: "",
        doctor_name: "",
        allergies: "",
        treatment: "",
        daily_medicine: "",
        religion: "",
        community: "",
        father: { name: "", occupation: "", phone: "" },
        mother: { name: "", occupation: "", phone: "" },
        siblings: [],
        guardian: { name: "", phone: "" }
    });

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/admin/student/profile", {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.data.profile) {
                    setProfile(0)
                    setError("You need to create a profile to use the application.");
                }

                setStudentDetails(response.data);
            } catch (err) {
                if (err.response) {
                    setError("Error fetching student profile: " + err.response.data.detail);
                } else {
                    setError("Network error. Please try again later.");
                }
            }
        };

        fetchStudent();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNestedChange = (parent, key, value) => {
        setFormData({ ...formData, [parent]: { ...formData[parent], [key]: value } });
    };

    const addSibling = () => {
        setFormData({ ...formData, siblings: [...formData.siblings, { name: "", occupation: "", phone: "" }] });
    };

    const handleSiblingChange = (index, key, value) => {
        const updatedSiblings = [...formData.siblings];
        updatedSiblings[index][key] = value;
        setFormData({ ...formData, siblings: updatedSiblings });
    };

    const handleSubmit = async () => {
        // Perform field validation
        if (!formData.dob || !formData.grade_10 || !formData.grade_12 || !formData.blood_group ||
            !formData.doctor_name || !formData.allergies || !formData.treatment || !formData.daily_medicine ||
            !formData.religion || !formData.community || !formData.father.name || !formData.father.occupation ||
            !formData.father.phone || !formData.mother.name || !formData.mother.occupation || !formData.mother.phone ||
            !formData.guardian.name || !formData.guardian.phone) {
            alert("Please fill in all the required fields.");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/admin/student/profile", formData, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            });
            alert("Profile Created Successfully!");
            setProfile(1)
            window.location.reload();
        } catch (err) {
            alert("Error creating profile. Try again.");
        }
    };

    return (
        <><div className="student">
            <StudentNav />

            {error && (
                <div className="alert alert-warning m-5 d-flex justify-content-between" role="alert">
                    {error}
                    <button className="btn btn-primary mx-5" onClick={() => setError("")}>
                        Create Profile
                    </button>
                </div>
            )}

            {!error && profile === 0 && (
                <div className="container student_stepper">

                    <div>
                        <h5>Personal Details</h5>
                        <div className="row">
                            <div className="col-md-4">
                                <label>Date of Birth:</label>
                                <input
                                    required
                                    type="date"
                                    name="dob"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={formData.dob} />
                            </div>
                            <div className="col-md-4">
                                <label>Native:</label>
                                <input
                                    required
                                    type="text"
                                    name="native"
                                    className="form-control" />
                            </div>
                        </div>

                        <h5>Academic History</h5>
                        <div className="row">
                            <div className="col-md-4">
                                <label>10th Grade:</label>
                                <input
                                    required
                                    type="text"
                                    name="grade_10"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={formData.grade_10} />
                            </div>
                            <div className="col-md-4">
                                <label>12th Grade:</label>
                                <input
                                    required
                                    type="text"
                                    name="grade_12"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={formData.grade_12} />
                            </div>
                        </div>

                        <h5>Medical History</h5>
                        <div className="row">
                            <div className="col-md-4">
                                <label>Blood Group:</label>
                                <select
                                    required
                                    name="blood_group"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={formData.blood_group}
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>


                            <div className="col-md-4">
                                <label>Doctor Name:</label>
                                <input
                                    required
                                    type="text"
                                    name="doctor_name"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={formData.doctor_name} />
                            </div>

                            <div className="col-md-4">
                                <label>Allergies:</label>
                                <input
                                    required
                                    type="text"
                                    name="allergies"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={formData.allergies} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <label>Undergoing Treatment:</label>
                                <input
                                    required
                                    type="text"
                                    name="treatment"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={formData.treatment} />
                            </div>
                            <div className="col-md-4">
                                <label>Medicine You Carry All Time:</label>
                                <input
                                    required
                                    type="text"
                                    name="daily_medicine"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={formData.daily_medicine} />
                            </div>
                        </div>

                        <h5>Family Details</h5>
                        <div className="row">
                            <div className="col-md-4">
                                <label>Religion:</label>
                                <input
                                    required
                                    type="text"
                                    name="religion"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={formData.religion} />
                            </div>

                            <div className="col-md-4">
                                <label>Community:</label>
                                <input
                                    required
                                    type="text"
                                    name="community"
                                    className="form-control"
                                    onChange={handleInputChange}
                                    value={formData.community} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <label>Father Name:</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => handleNestedChange("father", "name", e.target.value)}
                                    value={formData.father.name} />
                            </div>

                            <div className="col-md-4">
                                <label>Father Occupation:</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => handleNestedChange("father", "occupation", e.target.value)}
                                    value={formData.father.occupation} />
                            </div>

                            <div className="col-md-4">
                                <label>Father Phone:</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => handleNestedChange("father", "phone", e.target.value)}
                                    value={formData.father.phone} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <label>Mother Name:</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => handleNestedChange("mother", "name", e.target.value)}
                                    value={formData.mother.name} />
                            </div>

                            <div className="col-md-4">
                                <label>Mother Occupation:</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => handleNestedChange("mother", "occupation", e.target.value)}
                                    value={formData.mother.occupation} />
                            </div>

                            <div className="col-md-4">
                                <label>Mother Phone:</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => handleNestedChange("mother", "phone", e.target.value)}
                                    value={formData.mother.phone} />
                            </div>
                        </div>
                        <br />
                        <h6>Siblings:</h6>
                        {formData.siblings.map((sibling, index) => (
                            <div key={index}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <label>Name:</label>
                                        <input
                                            required
                                            type="text"
                                            className="form-control"
                                            onChange={(e) => handleSiblingChange(index, "name", e.target.value)}
                                            value={sibling.name} />
                                    </div>

                                    <div className="col-md-4">
                                        <label>Occupation:</label>
                                        <input
                                            required
                                            type="text"
                                            className="form-control"
                                            onChange={(e) => handleSiblingChange(index, "occupation", e.target.value)}
                                            value={sibling.occupation} />
                                    </div>

                                    <div className="col-md-4">
                                        <label>Phone:</label>
                                        <input
                                            required
                                            type="text"
                                            className="form-control"
                                            onChange={(e) => handleSiblingChange(index, "phone", e.target.value)}
                                            value={sibling.phone} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="btn btn-outline-dark mt-2 btn-sm" onClick={addSibling}>Add Sibling</button>


                        <div className="row">
                            <div className="col-md-4">
                                <label>Guardian Name:</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => handleNestedChange("guardian", "name", e.target.value)}
                                    value={formData.guardian.name} />
                            </div>

                            <div className="col-md-4">
                                <label>Guardian Phone:</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => handleNestedChange("guardian", "phone", e.target.value)}
                                    value={formData.guardian.phone} />
                            </div>
                        </div>

                        <button className="btn btn-success mt-3" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            )}

            {profile === 1 && (
                <div className="alert alert-info m-5" role="alert">
                    <div className="d-flex justify-content-between">
                        <span>
                            Profile already created. You can edit your details if needed.
                        </span>
                        <button className="btn btn-outline-primary btn-sm">Edit</button>
                    </div>
                </div>
            )}
        </div><Footer /></>
    );

};

export default Student;
