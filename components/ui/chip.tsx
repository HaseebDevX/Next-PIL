import React from 'react';

export default function ThemeChip(prop: { title: string; color: string }) {
  return (
    <div className={` content-center rounded-full px-2.5 text-center text-white ${prop.color}`}>
      <p>{prop.title}</p>
    </div>
  );
}
