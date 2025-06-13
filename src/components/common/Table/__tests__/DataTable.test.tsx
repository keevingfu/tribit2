import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataTable, { Column } from '../DataTable';

interface TestData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const mockData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'inactive' },
];

const columns: Column<TestData>[] = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Name', sortable: true, filterable: true },
  { key: 'email', header: 'Email', filterable: true },
  { key: 'role', header: 'Role', filterable: true },
  {
    key: 'status',
    header: 'Status',
    render: (value) => (
      <span className={`badge ${value === 'active' ? 'badge-success' : 'badge-error'}`}>
        {value}
      </span>
    ),
  },
];

describe('DataTable Component', () => {
  it('should render table with correct headers', () => {
    render(<DataTable columns={columns} data={mockData} />);
    
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('should render all data rows', () => {
    render(<DataTable columns={columns} data={mockData} />);
    
    mockData.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.email)).toBeInTheDocument();
    });
  });

  it('should handle sorting when clicking sortable headers', () => {
    render(<DataTable columns={columns} data={mockData} />);
    
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    // Check if data is sorted (first should be Alice after ascending sort)
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Alice Brown');
  });

  it('should show loading state', () => {
    render(<DataTable columns={columns} data={[]} loading={true} />);
    
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('should show empty message when no data', () => {
    render(
      <DataTable 
        columns={columns} 
        data={[]} 
        emptyMessage="No data available" 
      />
    );
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should handle pagination when enabled', () => {
    render(
      <DataTable 
        columns={columns} 
        data={mockData} 
        showPagination={true}
        pageSize={2}
      />
    );
    
    // Should only show 2 items per page
    const visibleNames = mockData.slice(0, 2).map(item => item.name);
    visibleNames.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
    
    // Third item should not be visible
    expect(screen.queryByText(mockData[2].name)).not.toBeInTheDocument();
  });

  it('should handle row click when callback provided', () => {
    const handleRowClick = jest.fn();
    render(
      <DataTable 
        columns={columns} 
        data={mockData} 
        onRowClick={handleRowClick}
      />
    );
    
    const firstRow = screen.getByText(mockData[0].name).closest('tr');
    if (firstRow) {
      fireEvent.click(firstRow);
      expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
    }
  });

  it('should apply custom row classes', () => {
    render(
      <DataTable 
        columns={columns} 
        data={mockData} 
        striped={true}
        hoverable={true}
        bordered={true}
      />
    );
    
    const tableContainer = screen.getByRole('table').parentElement;
    // Check if parent container has overflow and border classes
    expect(tableContainer?.className).toContain('overflow-hidden');
    expect(tableContainer?.className).toContain('border');
  });

  it('should render custom cell content with render function', () => {
    render(<DataTable columns={columns} data={mockData} />);
    
    // Check if status badges are rendered correctly
    const activeBadges = screen.getAllByText('active');
    const inactiveBadges = screen.getAllByText('inactive');
    
    expect(activeBadges.length).toBeGreaterThan(0);
    expect(inactiveBadges.length).toBeGreaterThan(0);
  });

  it('should handle column alignment', () => {
    const columnsWithAlignment: Column<TestData>[] = [
      { key: 'id', header: 'ID', align: 'center' },
      { key: 'name', header: 'Name', align: 'left' },
      { key: 'email', header: 'Email', align: 'right' },
    ];
    
    render(<DataTable columns={columnsWithAlignment} data={mockData.slice(0, 1)} />);
    
    const cells = screen.getAllByRole('cell');
    expect(cells[0].className).toContain('text-center');
    expect(cells[1].className).toContain('text-left');
    expect(cells[2].className).toContain('text-right');
  });
});