export default function Navbar({
  onFileUpload,
  onToggleMode,
  isEditMode,
  onSave,
}) {
  return (
    <div
      style={{
        backgroundColor: isEditMode ? "#fcecc5cb" : "#e6f8fac2",
        padding: "1rem",
        borderRadius: "20px",
        marginBottom: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        fontSize: "1.2rem",
      }}
    >
      {/* Upload Another File */}
      <label
        className="upload-btn2"
        style={{
          backgroundColor: isEditMode ? "#f6ce60" : "#90e0ef",
          color: "#000000",
          padding: "10px 20px",
          borderRadius: "30px",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "all 0.3s ease-in-out",
        }}
      >
        Upload Another File
        <input
          type="file"
          accept=".csv"
          onChange={onFileUpload}
          style={{ display: "none" }}
        />
      </label>

      {/* Mode Toggle */}
      <div
        onClick={onToggleMode}
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <span
          style={{
            marginRight: "10px",
            fontWeight: "bold",
            color: "#000",
            fontSize: "1.2rem",
          }}
        >
          {isEditMode ? "Edit Mode" : "View Mode"}
        </span>
        <div
          style={{
            width: "50px",
            height: "26px",
            borderRadius: "15px",
            backgroundColor: isEditMode ? "#f6ce60" : "#90e0ef",
            position: "relative",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <div
            style={{
              height: "22px",
              width: "22px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              position: "absolute",
              top: "2px",
              left: isEditMode ? "26px" : "2px",
              transition: "left 0.3s ease-in-out",
              boxShadow: "0 0 4px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        style={{
          backgroundColor: isEditMode ? "#f6ce60" : "#90e0ef",
          color: "#000",
          padding: "10px 20px",
          border: "none",
          borderRadius: "30px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1rem",
          transition: "all 0.3s ease-in-out",
        }}
      >
        Save
      </button>
    </div>
  );
}
