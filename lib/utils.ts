import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uppercase(text?: string){
  if (text != undefined) {
    const convertedText = text.replace(/(?:^|_)([a-z])/g, function(match, char) {
      return char.toUpperCase();
    });
    return convertedText;
  } else {
    return "";
  }
}

export function lowercaseFirstLetter(text?: string) {
  if (text != undefined) {
    return text.charAt(0).toLowerCase() + text.slice(1);
  } else {
    return "";
  }
}

export function camelToKebabCase(text?: string) {
  if (text != undefined) {
    return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  } else {
    return "";
  }
}

export function camelToSnakeCase(text?: string) {
  if (text != undefined) {
    return text.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
  } else {
    return "";
  }
}

export function parseSQLStringToJson(text?: string) {
  if (text != undefined) {
    const lines: any = text.trim().split('\n');
    const tableName = lines[0].match(/Table\s+(\w+)\s+\{/)[1];
    const columns: any = [];
    lines.slice(1, -1).forEach((line: string) => {
      const matches = line.match(/\s*(\w+)\s+(\w+)\s*(\[.*\])?\s*(\[.*\])?/);
      if (matches) {
        const [, name, type, attributes1, attributes2] = matches;
        const column: any = { label: name, type };
        if (attributes1) {
          column.attributes1 = attributes1.replace(/\[|\]/g, '');
        }
        if (attributes2) {
          column.attributes2 = attributes2.replace(/\[|\]/g, '');
        }
        columns.push(column);
      }
    });
    return columns;
  } else {
    return "";
  }
}