import React from 'react';

interface Item {
  id?: string | number;
  content: string;
  ImageComponent?: React.ReactNode;
  handleOnClick?: () => void;
  position?: '' | 'center';
}

interface List {
  items: Item[];
}

export type { Item, List };
