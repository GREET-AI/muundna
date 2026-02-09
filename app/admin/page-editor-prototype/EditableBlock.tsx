'use client';

import React, { useRef, useLayoutEffect } from 'react';
import type { EditorStyle } from './PageEditorContext';

/** Nur Tags, die wir im Editor nutzen (ref/contentEditable-kompatibel). */
type EditableTag = 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'a' | 'strong' | 'em';

type EditableBlockProps = {
  sectionIndex: number;
  propKey: string;
  value: string;
  style?: EditorStyle;
  tag?: EditableTag;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  isSelected?: boolean;
  /** Stufe 2: Inline-Edit (contentEditable). */
  isEditing?: boolean;
  onBlur?: (value: string) => void;
  label?: string;
};

/**
 * Einzelnes bearbeitbares Element. Klick wählt; bei isEditing wird contentEditable gesetzt.
 */
export function EditableBlock({
  sectionIndex,
  propKey,
  value,
  style = {},
  tag: Tag = 'span',
  className = '',
  onClick,
  isSelected,
  isEditing,
  onBlur,
  label,
}: EditableBlockProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inlineStyle: React.CSSProperties = {
    ...(style.fontSize != null && { fontSize: style.fontSize }),
    ...(style.color != null && { color: style.color }),
    ...(style.backgroundColor != null && { backgroundColor: style.backgroundColor }),
  };

  useLayoutEffect(() => {
    if (isEditing && ref.current) {
      if (ref.current.innerHTML !== (value || '')) ref.current.innerHTML = value || '';
      if (document.activeElement !== ref.current) ref.current.focus();
    }
  }, [isEditing, value]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };

  const handleBlur = () => {
    if (ref.current && onBlur) onBlur(ref.current.innerHTML || ref.current.innerText || '');
  };

  if (isEditing) {
    return (
      <span
        ref={ref}
        data-editor-block
        data-section-index={sectionIndex}
        data-prop-key={propKey}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        className={`outline-none rounded cursor-text border border-transparent ring-2 ring-blue-500 ring-offset-2 min-w-[2ch] ${className}`}
        style={inlineStyle}
      />
    );
  }

  return (
    <Tag
      data-editor-block
      data-section-index={sectionIndex}
      data-prop-key={propKey}
      title={label ? `${label} (klicken zum Bearbeiten)` : 'Klicken zum Bearbeiten'}
      className={`outline-none rounded cursor-text border border-transparent transition-colors ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:border-[#cb530a]/50 hover:bg-[#cb530a]/5'} ${className}`}
      style={inlineStyle}
      onClick={handleClick}
      suppressContentEditableWarning
    >
      {value || <span className="text-neutral-400 italic">Leer – klicken zum Bearbeiten</span>}
    </Tag>
  );
}
