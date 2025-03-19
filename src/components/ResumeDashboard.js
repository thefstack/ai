import React from "react";
import { Search, Filter, Plus, Trash2, Edit } from "lucide-react";
import styles from "@/css/ResumeDashboard.module.css";

const ResumeDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* Page Header */}
      <div className={styles.header}>
        <h2>All Resumes</h2>
        <div className={styles.searchContainer}>
          <input type="text" placeholder="Search" className={styles.searchInput} />
          <Search size={18} className={styles.searchIcon} />
          <button className={styles.filterButton}>
            <Filter size={16} /> Filter
          </button>
          <button className={styles.createButton}>
            <Plus size={16} /> Create New Resume
          </button>
        </div>
      </div>

      {/* Blue Line Separator */}
      <div className={styles.blueLine}></div>

      {/* Resume Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Resume Title</th>
              <th>Score</th>
              <th>Created</th>
              <th>Modified</th>
              <th>Job Title</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Software</td>
              <td>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar}></div>
                </div>
              </td>
              <td>—</td>
              <td>Feb 14, 2025</td>
              <td>Software</td>
              <td>Scratch</td>
              <td className={styles.actionButtons}>
                <Trash2 size={16} className={styles.trashIcon} />&nbsp;
                <Edit size={16} className={styles.editIcon} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResumeDashboard;
