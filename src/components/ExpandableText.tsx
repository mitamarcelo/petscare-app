import React, { useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import styles from "@/styles/ExpandableText.module.scss";
import { createMarkup } from "@/utils/markup";

type ExpandableTextProps = {
  text: string;
};

const ExpandableText: React.FC<ExpandableTextProps> = ({ text }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const markupText = createMarkup(text);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [expandable, setExpandable] = useState<boolean>(false);

  const handleShowMoreToggle = () => {
    setShowMore((p) => !p);
  };

  useLayoutEffect(() => {
    const wrapperHeight = wrapperRef.current?.clientHeight;
    setExpandable(wrapperHeight == 100);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles.expandableWrapper, {
        [styles.expanded]: showMore,
      })}
    >
      {expandable && (
        <div className={styles.expandLink} onClick={handleShowMoreToggle}>
          {showMore ? "Mostrar Menos" : "Mostrar Mais"}
        </div>
      )}
      <div dangerouslySetInnerHTML={createMarkup(text)}></div>
    </div>
  );
};

export default ExpandableText;
