/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styles from './Table.module.css';

interface TableProps {
  data: any[];
  columns: { key: string; label: string }[];
}

export const Table: React.FC<TableProps> = ({ data, columns }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={styles.headerCell}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.key} className={styles.cell}>
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
