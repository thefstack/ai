import React from 'react';
import styles from '@/css/Tooltips.module.css'; // Tooltip specific CSS

const Tooltip = ({ text, bg='transparent', ToolTipColor='black',top=false, right=false, left=false, children }) => {

  return (
    <div className={styles.tooltipWrapper}>
      {children}
      <span className={styles.tooltipText} style={{padding:"5px",background:bg ,color:ToolTipColor,top:!top && "100%", bottom:top && "100%", right:right && "100%", left:left && "100%"}}>{text}</span>
    </div>
  );
};

export default Tooltip;
