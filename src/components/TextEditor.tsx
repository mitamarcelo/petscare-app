import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { ContentState, EditorState } from "draft-js";
import { convertToHTML } from "draft-convert";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import styles from "@/styles/TextEditor.module.scss";

type TextEditorProps = {
  initialValue: string;
  onChange: (value: string) => void;
};

const Editor = dynamic(() =>
  import("react-draft-wysiwyg").then((mod) => mod.Editor)
);

const TextEditor: React.FC<TextEditorProps> = ({ initialValue, onChange }) => {
  const _contentState = ContentState.createFromText(initialValue);

  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createWithContent(_contentState)
  );

  useEffect(() => {
    onChange(convertToHTML(editorState.getCurrentContent()));
  }, [editorState]);

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={setEditorState}
      wrapperClassName={styles.wrapper}
      editorClassName={styles.editor}
      toolbarClassName={styles.toolbar}
    />
  );
};

export default TextEditor;
