'use client';

import React, { useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Column } from './DataTable';

interface VirtualTableProps<T> {
  columns: Column<T>[];
  data: T[];
  height?: number;
  rowHeight?: number;
  onLoadMore?: () => Promise<void>;
  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  className?: string;
  onRowClick?: (item: T) => void;
}

const VirtualTable = <T extends Record<string, any>>({
  columns,
  data,
  height = 600,
  rowHeight = 50,
  onLoadMore,
  hasNextPage = false,
  isNextPageLoading = false,
  className = '',
  onRowClick,
}: VirtualTableProps<T>) => {
  const listRef = useRef<List>(null);

  // Calculate total items including loading indicator
  const itemCount = hasNextPage ? data.length + 1 : data.length;

  // Check if an item is loaded
  const isItemLoaded = useCallback(
    (index: number) => !hasNextPage || index < data.length,
    [data.length, hasNextPage]
  );

  // Load more items
  const loadMoreItems = useCallback(
    () => {
      if (isNextPageLoading || !onLoadMore) return Promise.resolve();
      return onLoadMore();
    },
    [isNextPageLoading, onLoadMore]
  );

  // Render a single row
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    // Loading row
    if (!isItemLoaded(index)) {
      return (
        <div style={style} className="flex items-center justify-center border-b">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          <span className="ml-2 text-gray-600">加载更多...</span>
        </div>
      );
    }

    const item = data[index];
    if (!item) return null;

    return (
      <div
        style={style}
        className={`flex items-center border-b hover:bg-gray-50 ${
          onRowClick ? 'cursor-pointer' : ''
        }`}
        onClick={() => onRowClick?.(item)}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className={`flex-1 px-4 py-2 text-sm text-gray-900 text-${
              column.align || 'left'
            }`}
            style={{ width: column.width }}
          >
            {column.render
              ? column.render(item[column.key], item)
              : item[column.key]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="border-b bg-gray-50">
        <div className="flex items-center font-medium text-gray-700">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`flex-1 px-4 py-3 text-sm font-semibold text-${
                column.align || 'left'
              }`}
              style={{ width: column.width }}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Virtual list body */}
      {onLoadMore && hasNextPage ? (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <List
              ref={(list) => {
                ref(list);
                // @ts-ignore
                listRef.current = list;
              }}
              height={height}
              itemCount={itemCount}
              itemSize={rowHeight}
              onItemsRendered={onItemsRendered}
              width="100%"
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      ) : (
        <List
          ref={listRef}
          height={height}
          itemCount={data.length}
          itemSize={rowHeight}
          width="100%"
        >
          {Row}
        </List>
      )}
    </div>
  );
};

export default React.memo(VirtualTable);