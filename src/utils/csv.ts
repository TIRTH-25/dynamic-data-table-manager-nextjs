// For csv

import Papa from 'papaparse';
import { Row } from '@/types';

export function parseCsvFile(file: File): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (res) => {
        if (res.errors && res.errors.length) {
          reject(new Error(res.errors[0].message));
          return;
        }
      
        const data: Row[] = res.data.map((r: any, i: number) => ({
          id: String(Date.now() + i),
          ...r
        }));
        resolve(data);
      },
      error: (err) => reject(err)
    });
  });
}

export function exportRowsToCsv(rows: any[], filename = `export-${Date.now()}.csv`) {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
