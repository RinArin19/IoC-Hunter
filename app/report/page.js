import React, { Suspense } from 'react';
import ReportPreviewInner from './ReportPreviewInner';

export default function ReportPreview() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: '#fff' }}>Loading...</div>}>
      <ReportPreviewInner />
    </Suspense>
  );
}
