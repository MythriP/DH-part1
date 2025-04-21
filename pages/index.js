import { useState } from "react";
import Papa from "papaparse";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [logMessages, setLogMessages] = useState([]);

  const REQUIRED_FIELDS = [
    "Patient Name",
    "Email",
    "Phone",
    "Referring Provider",
  ];

  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages((prev) => [...prev, { type, message, timestamp }]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".csv")) {
      addLog("error", "Please upload a .csv file.");
      return;
    }

    setIsStarted(true);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;

        if (results.errors.length) {
          addLog("error", "CSV parsing error: " + results.errors[0].message);
          return;
        }

        if (data.length === 0) {
          addLog("warning", "CSV uploaded but contains no data.");
          return;
        }

        const uploadedHeaders = Object.keys(data[0] || {});
        const hasAllHeaders = REQUIRED_FIELDS.every((h) =>
          uploadedHeaders.includes(h)
        );
        if (!hasAllHeaders) {
          addLog(
            "warning",
            "⚠️ Might have uploaded wrong file, check the fields again."
          );
        }

        setHeaders(uploadedHeaders);
        setTableData(data);
      },
      error: (err) => {
        addLog("error", "Failed to parse CSV.");
        console.error(err);
      },
    });
  };

  const handleCellChange = (rowIndex, key, value) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][key] = value;
    setTableData(updatedData);
  };

  const validateTable = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;

    const newValidationErrors = {};
    let hasIssue = false;

    tableData.forEach((row, rowIndex) => {
      REQUIRED_FIELDS.forEach((field) => {
        if (!row[field]) {
          newValidationErrors[`${rowIndex}-${field}`] = "Missing field";
          hasIssue = true;
        }
      });

      if (row["Email"] && !emailRegex.test(row["Email"])) {
        newValidationErrors[`${rowIndex}-Email`] = "Invalid email";
        hasIssue = true;
      }

      if (row["Phone"] && !phoneRegex.test(row["Phone"])) {
        newValidationErrors[`${rowIndex}-Phone`] = "Invalid phone number";
        hasIssue = true;
      }
    });

    setValidationErrors(newValidationErrors);

    if (hasIssue) {
      addLog("error", "⚠️ Fill all fields before saving.");
    }

    return hasIssue;
  };

  const handleSave = () => {
    setLogMessages([]);

    const hasRequiredHeaders = REQUIRED_FIELDS.every((field) =>
      headers.includes(field)
    );

    if (!hasRequiredHeaders) {
      addLog(
        "error",
        "Re-check if these exist or not: Patient Name, Email, Phone, Referring Provider"
      );
      return;
    }

    const hasErrors = validateTable();

    if (!hasErrors) {
      addLog("success", " Data saved successfully!");
    }
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      if (next) setLogMessages([]);
      return next;
    });
  };

  return (
    <>
      {!isStarted ? (
        <div className="container-start">
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "1.5rem",
              color: "#5e4400",
            }}
          >
            Let’s Start!
          </h1>
          <label htmlFor="csv-upload" className="upload-btn">
            📁 Upload CSV
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>
      ) : (
        <div
          className={`${
            isEditMode ? "container-edit" : "container-read"
          } mode-transition`}
        >
          <Heading />
          <Navbar
            onFileUpload={handleFileUpload}
            onToggleMode={toggleEditMode}
            isEditMode={isEditMode}
            onSave={handleSave}
          />

          <h3
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.5rem",
              margin: "1rem 0",
            }}
          >
            {fileName}
          </h3>

          <div
            className="mode-transition"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              alignItems: "flex-start",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                flex: "1 1 80%",
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  fontSize: "1.1rem",
                }}
              >
                <thead>
                  <tr>
                    {headers.map((header, i) => (
                      <th key={i}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {headers.map((key, colIndex) => (
                        <td key={colIndex}>
                          <div style={{ position: "relative" }}>
                            <input
                              type="text"
                              disabled={!isEditMode}
                              value={row[key] || ""}
                              onChange={(e) =>
                                handleCellChange(rowIndex, key, e.target.value)
                              }
                              style={{
                                width: "100%",
                                boxSizing: "border-box",
                                fontSize: "1.3rem",
                                padding: "6px 8px",
                                backgroundColor: validationErrors[
                                  `${rowIndex}-${key}`
                                ]
                                  ? "#ffe5e5"
                                  : !row[key]
                                  ? "#fcd8d6"
                                  : isEditMode
                                  ? "#fff9db"
                                  : "#e3f5ff",
                                border: validationErrors[`${rowIndex}-${key}`]
                                  ? "1px solid red"
                                  : "1px solid #ccc",
                                color: isEditMode ? "#333" : "#666",
                              }}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isEditMode && (
              <div
                style={{
                  width: "20%",
                  backgroundColor: "#fffaf0",
                  border: "2px solid #d4a300",
                  borderRadius: "8px",
                  padding: "1rem",
                  fontSize: "0.9rem",
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                <h4 style={{ marginTop: 0, color: "#8b6500" }}>Console</h4>
                {logMessages.length === 0 ? (
                  <p style={{ color: "#666" }}>No messages yet.</p>
                ) : (
                  <ul
                    style={{
                      paddingLeft: "1rem",
                      listStyleType: "none",
                      margin: 0,
                    }}
                  >
                    {logMessages.map((log, idx) => (
                      <li
                        key={idx}
                        style={{
                          color:
                            log.type === "error"
                              ? "#b20000"
                              : log.type === "warning"
                              ? "#a67c00"
                              : "green",
                          marginBottom: "0.5rem",
                        }}
                      >
                        ● [{log.timestamp}] {log.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
