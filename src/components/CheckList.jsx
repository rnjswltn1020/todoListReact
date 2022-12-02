import React from "react";
import styles from "../App.module.css";
export default function CheckList() {
  return (
    <ul>
      <li>
        <div>
          <input type="checkbox" />
          <span>공부하기</span>
        </div>
        <span>trash</span>
      </li>
    </ul>
  );
}
