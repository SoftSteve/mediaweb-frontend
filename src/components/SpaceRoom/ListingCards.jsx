import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function MediaCard({imgSrc, title, description, venmoLink, donoLink, className = '',}) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-xl shadow-md ${className}`}>
      <img
        src={imgSrc}
        alt={title}
        loading="eager"
        className="h-48 w-full object-cover"
      />

      <div className="flex flex-col gap-2 bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        {description && <p className="line-clamp- text-sm text-gray-600">{description}</p>}

        <div className="mt-auto flex gap-2">
          {venmoLink && <ActionButton {...venmoLink} solid />}
          {donoLink && <ActionButton {...donoLink} />}
        </div>
      </div>
    </div>
  );
}


function ActionButton({ icon, label, href, onClick, solid = false }) {
  const base =
    'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-lg font-medium transition';
  const solidStyle = 'bg-[#008CFF] text-white hover:bg-indigo-700';
  const ghostStyle = 'border border-gray-300 text-gray-700 hover:bg-gray-50';
  const classes = `${base} ${solid ? solidStyle : ghostStyle}`;

  const Tag = href ? 'a' : 'button';
  const extraProps = href ? { href } : { type: 'button' };

  return (
    <Tag
      {...extraProps}
      onClick={onClick}
      className={classes}
      aria-label={label}
    >
      {icon ? icon : label}
    </Tag>
  );
}