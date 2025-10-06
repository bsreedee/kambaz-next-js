export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <h2>Assignment Name</h2>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />

      <textarea
        id="wd-description"
        rows={5}
        cols={50}
      >
        The assignment is available online. Submit a link to the landing page of your Web
        application running on Netlify. The landing page should include: your full name and section, 
        links to each lab assignment, link to the Kambaz application, and all relevant source code repositories. 
        The Kambaz application should include a link to navigate back to the landing page.
      </textarea>
      <br />

      <table>
        <tbody>
          {/* Points */}
          <tr>
            <td align="right"><label htmlFor="wd-points">Points</label></td>
            <td><input id="wd-points" type="number" defaultValue={100} /></td>
          </tr>

          {/* Assignment Group */}
          <tr>
            <td align="right"><label htmlFor="wd-group">Assignment Group</label></td>
            <td>
              <select id="wd-group" defaultValue="ASSIGNMENTS">
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="PROJECT">PROJECT</option>
              </select>
            </td>
          </tr>

          {/* Display Grade As */}
          <tr>
            <td align="right"><label htmlFor="wd-display-grade-as">Display Grade as</label></td>
            <td>
              <select id="wd-display-grade-as" defaultValue="Percentage">
                <option value="Percentage">Percentage</option>
                <option value="Points">Points</option>
                <option value="Complete/Incomplete">Complete/Incomplete</option>
              </select>
            </td>
          </tr>

          {/* Submission Type */}
          <tr>
            <td align="right" valign="top"><label htmlFor="wd-submission-type">Submission Type</label></td>
            <td>
              <select id="wd-submission-type" defaultValue="Online">
                <option value="Online">Online</option>
                <option value="On Paper">On Paper</option>
                <option value="External Tool">External Tool</option>
              </select>
              <br />
              <label>
                <input type="checkbox" id="wd-text-entry" /> Text Entry
              </label><br />
              <label>
                <input type="checkbox" id="wd-website-url" /> Website URL
              </label><br />
              <label>
                <input type="checkbox" id="wd-media-recordings" /> Media Recordings
              </label><br />
              <label>
                <input type="checkbox" id="wd-student-annotation" /> Student Annotation
              </label><br />
              <label>
                <input type="checkbox" id="wd-file-upload" /> File Uploads
              </label>
            </td>
          </tr>

          {/* Assign & Dates */}
          <tr>
            <td align="right" valign="top"><label>Assign</label></td>
            <td>
              <label htmlFor="wd-assign-to">Assign to</label><br />
              <input id="wd-assign-to" defaultValue="Everyone" /><br /><br />

              <label htmlFor="wd-due-date">Due</label><br />
              <input id="wd-due-date" type="date" defaultValue="2024-05-13" /><br /><br />

              <label htmlFor="wd-available-from">Available from</label><br />
              <input id="wd-available-from" type="date" defaultValue="2024-05-06" /><br /><br />

              <label htmlFor="wd-available-until">Until</label><br />
              <input id="wd-available-until" type="date" defaultValue="2024-05-20" /><br />
            </td>
          </tr>
        </tbody>
      </table>

      <br />
      <button>Cancel</button>
      <button>Save</button>
    </div>
  );
}
