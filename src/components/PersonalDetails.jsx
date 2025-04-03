import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";

const PersonalDetails = ({ nextStep, prevStep, personalInfo, setPersonalInfo }) => {


    const [error, setError] = useState("");
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetch("/data/states.json")
            .then((res) => res.json())
            .then((data) => {
                const formattedStates = data.map((state) => ({
                    label: state.name, // Show name in dropdown
                    value: state.code, // Store state code
                }));
                setStates(formattedStates);
            })
            .catch((err) => console.error("Error fetching states:", err));

        // Fetch Cities
        fetch("/data/cities.json")
            .then((res) => res.json())
            .then((data) => {
                setCities(data);
            })
            .catch((err) => console.error("Error fetching cities:", err));
    }, []);

    const handleStateChange = (e) => {
        const selectedState = e.value;
        setPersonalInfo({ ...personalInfo, state: selectedState, city: "" });
    };

    const handleChange = (e, field) => {
        setPersonalInfo({
            ...personalInfo,
            [field]: e.target.value,
        });
    };


    const proofOptions = [
        { label: "Passport", value: "Passport" },
        { label: "Aadhar Card", value: "Aadhar Card" },
    ];

    const handleContinue = () => {
        if (
            !personalInfo.firstName ||
            !personalInfo.lastName ||
            !personalInfo.dob ||
            !personalInfo.mobileNumber ||
            !personalInfo.email ||
            !personalInfo.address1 ||
            !personalInfo.city ||
            !personalInfo.state ||
            !personalInfo.postalCode ||
            !personalInfo.proofOfAddress ||
            !personalInfo.documentNumber
        ) {
            setError("Please fill all required fields.");
            return;
        }
        setError("");
        nextStep();
    };

    return (
        <div className="container mx-auto py-10 px-5">
            <h2 className="text-3xl font-bold text-center mb-6">Personal Details</h2>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        id="firstName"
                        placeholder="First Name*"
                        className="input input-accent w-full"
                        value={personalInfo.firstName}
                        onChange={(e) => handleChange(e, "firstName")}
                        required
                    />

                    <input
                        type="text"
                        id="middleName"
                        placeholder="Middle Name"
                        className="input input-accent w-full"
                        value={personalInfo.middleName}
                        onChange={(e) => handleChange(e, "middleName")}
                    />

                    <input
                        type="text"
                        id="lastName"
                        placeholder="Last Name*"
                        className="input input-accent w-full"
                        value={personalInfo.lastName}
                        onChange={(e) => handleChange(e, "lastName")}
                        required
                    />

                    <input
                        type="date"
                        id="dob"
                        className="input input-accent w-full"
                        value={personalInfo.dob}
                        onChange={(e) => handleChange(e, "dob")}
                        required
                    />
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        id="mobileNumber"
                        placeholder="Mobile Number*"
                        className="input input-accent w-full"
                        value={personalInfo.mobileNumber}
                        onChange={(e) => handleChange(e, "mobileNumber")}
                        required
                    />

                    <input
                        type="email"
                        id="email"
                        placeholder="Email ID*"
                        className="input input-accent w-full"
                        value={personalInfo.email}
                        onChange={(e) => handleChange(e, "email")}
                        required
                    />
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        id="address1"
                        placeholder="Address Line 1*"
                        className="input input-accent w-full"
                        value={personalInfo.address1}
                        onChange={(e) => handleChange(e, "address1")}
                        required
                    />

                    <input
                        type="text"
                        id="address2"
                        placeholder="Address Line 2"
                        className="input input-accent w-full"
                        value={personalInfo.address2}
                        onChange={(e) => handleChange(e, "address2")}
                    />

                    <Dropdown
                        className="input input-accent w-full"
                        value={personalInfo.state}
                        options={states}
                        optionLabel="label"
                        onChange={handleStateChange} // Use correct handler
                        placeholder="Select State*"
                    />

                    <Dropdown
                        className="input input-accent w-full"
                        value={personalInfo.city}
                        options={
                            Array.isArray(cities[personalInfo.state])
                                ? cities[personalInfo.state].map((city) => ({
                                    label: city,
                                    value: city,
                                }))
                                : []
                        }
                        onChange={(e) => handleChange(e, "city")}
                        optionLabel="label"
                        placeholder="Select City*"
                        disabled={!personalInfo.state}
                    />


                    <input
                        type="text"
                        id="postalCode"
                        placeholder="Postal Code*"
                        className="input input-accent w-full"
                        value={personalInfo.postalCode}
                        onChange={(e) => handleChange(e, "postalCode")}
                        required
                    />
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Proof of Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Dropdown
                        id="proofOfAddress"
                        className="input input-accent w-full"
                        value={personalInfo.proofOfAddress}
                        options={proofOptions}
                        optionLabel="label" // ✅ Fix: Show readable labels
                        onChange={(e) => handleChange(e, "proofOfAddress")}
                        placeholder="Select Proof of Address"
                        required
                    />


                    {personalInfo.proofOfAddress && (
                        <input
                            type="text"
                            id="documentNumber"
                            placeholder={
                                personalInfo.proofOfAddress === "Passport"
                                    ? "Passport Number*"
                                    : "Aadhar Number*"
                            }
                            className="input input-accent w-full"
                            value={personalInfo.documentNumber}
                            onChange={(e) => handleChange(e, "documentNumber")}
                            required
                        />
                    )}
                </div>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="flex justify-center gap-4">
                <button className="btn btn-secondary" onClick={prevStep}>
                    Back
                </button>
                <button className="btn btn-success" onClick={handleContinue}>
                    Continue
                </button>
            </div>
        </div>
    );
};

export default PersonalDetails;
