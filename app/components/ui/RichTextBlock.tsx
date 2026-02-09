'use client';

import React from 'react';

/**
 * Rendert vom RichTextEditor gespeichertes HTML (WYSIWYG).
 * Für alle Überschriften/Untertitel die als richtext im Builder gepflegt werden.
 */
export function RichTextBlock({
  html,
  tag: Tag = 'span',
  className,
}: {
  html: string | undefined | null;
  tag?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  const value = html == null ? '' : String(html).trim();
  if (value === '') return null;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: value }} />;
}
