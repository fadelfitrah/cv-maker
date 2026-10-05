import React from 'react';
import { ModernTemplate } from './ModernTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';
import { TechTemplate } from './TechTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { templateService } from '../../services/templateService';

export function TemplateRenderer({ data }) {
  const templateId = data.theme?.templateId || 'modern';
  const fontClass = templateService.getFontFamilyClass(data.theme?.fontFamily);
  const sizeClass = templateService.getFontSizeClass(data.theme?.fontSize);

  const renderSelectedTemplate = () => {
    switch (templateId) {
      case 'minimalist':
        return <MinimalistTemplate data={data} />;
      case 'tech':
        return <TechTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'modern':
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className={`w-full h-full bg-white text-slate-900 ${fontClass} ${sizeClass}`}>
      {renderSelectedTemplate()}
    </div>
  );
}
