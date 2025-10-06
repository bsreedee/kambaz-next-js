export default function Modules() {
  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button>Collapse All</button>
        <button>View Progress</button>
        <button>Publish All</button>
        <button>+ Module</button>
      </div>

      <ul id="wd-modules">
        {/* Week 1 */}
        <li className="wd-module">
          <div className="wd-title">Week 1</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">HTML Basics</span>
              <ul className="wd-content">
                <li className="wd-content-item">Elements, Tags, and Attributes</li>
                <li className="wd-content-item">Creating your first webpage</li>
              </ul>
            </li>
          </ul>
        </li>

        {/* Week 2 */}
        <li className="wd-module">
          <div className="wd-title">Week 2</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">CSS Basics</span>
              <ul className="wd-content">
                <li className="wd-content-item">Selectors and Properties</li>
                <li className="wd-content-item">Box Model</li>
                <li className="wd-content-item">Flexbox and Grid</li>
              </ul>
            </li>
          </ul>
        </li>

        {/* Week 3 */}
        <li className="wd-module">
          <div className="wd-title">Week 3</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">JavaScript Basics</span>
              <ul className="wd-content">
                <li className="wd-content-item">Variables and Data Types</li>
                <li className="wd-content-item">Functions and Loops</li>
                <li className="wd-content-item">DOM Manipulation</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
