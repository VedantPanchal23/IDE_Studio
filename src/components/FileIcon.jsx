import React from 'react';
import { VscJson, VscFileCode, VscFileMedia, VscFileZip, VscFile, VscMarkdown } from 'react-icons/vsc';
import { DiJavascript1, DiCss3Full, DiHtml5, DiPython } from 'react-icons/di';

const iconMap = {
  js: <DiJavascript1 className="text-yellow-500" />,
  html: <DiHtml5 className="text-orange-600" />,
  css: <DiCss3Full className="text-blue-500" />,
  json: <VscJson className="text-yellow-600" />,
  py: <DiPython className="text-blue-400" />,
  md: <VscMarkdown className="text-blue-300" />,
  png: <VscFileMedia />,
  jpg: <VscFileMedia />,
  jpeg: <VscFileMedia />,
  gif: <VscFileMedia />,
  zip: <VscFileZip />,
};

export default function FileIcon({ fileName }) {
  const extension = fileName.split('.').pop().toLowerCase();
  const icon = iconMap[extension] || <VscFile />;

  return <span className="mr-2 flex-shrink-0">{React.cloneElement(icon, { size: 18 })}</span>;
}
