import React from "react";

interface Item {
  content: string;
  id?: string;
  ImageComponent?: React.ReactNode;
  handleOnClick?: () => void;
}

interface List {
  items: Item[];
}

export type { Item, List };
