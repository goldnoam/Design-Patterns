
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PatternDetail from './PatternDetail';
import { PatternCategory } from '../types';

const mockPattern = {
  id: 'adapter-id',
  name: 'Adapter',
  category: PatternCategory.STRUCTURAL,
  description: 'Converts the interface of a class.',
  whenToUse: ['When interfaces are incompatible'],
  pros: ['Highly reusable', 'Single responsibility'],
  cons: ['Increased complexity'],
  codeExample: 'class Adapter {};',
  visualAidUrl: 'https://example.com/adapter.jpg'
};

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe('PatternDetail Component', () => {
  it('renders all pattern details in the modal', () => {
    render(<PatternDetail pattern={mockPattern} onClose={() => {}} />);
    
    expect(screen.getByText('Adapter')).toBeInTheDocument();
    expect(screen.getByText('Intent')).toBeInTheDocument();
    expect(screen.getByText('Converts the interface of a class.')).toBeInTheDocument();
    expect(screen.getByText('When interfaces are incompatible')).toBeInTheDocument();
    expect(screen.getByText('class Adapter {};')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<PatternDetail pattern={mockPattern} onClose={onClose} />);
    
    // The X icon button is the last one in the header row
    const closeBtn = screen.getAllByRole('button').find(btn => btn.innerHTML.includes('svg'));
    if (closeBtn) fireEvent.click(closeBtn);
    
    // Alternative check if we added labels, but here we can find by close intent
    const buttons = screen.getAllByRole('button');
    // The last button in the header is the close button
    fireEvent.click(buttons[buttons.length - 1]);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onNext and onPrev when navigation buttons are clicked', () => {
    const onNext = vi.fn();
    const onPrev = vi.fn();
    render(<PatternDetail 
      pattern={mockPattern} 
      onClose={() => {}} 
      onNext={onNext} 
      onPrev={onPrev} 
    />);
    
    const nextBtn = screen.getByTitle('Next Pattern');
    const prevBtn = screen.getByTitle('Previous Pattern');
    
    fireEvent.click(nextBtn);
    expect(onNext).toHaveBeenCalled();
    
    fireEvent.click(prevBtn);
    expect(onPrev).toHaveBeenCalled();
  });

  it('copies code to clipboard and updates button state', async () => {
    render(<PatternDetail pattern={mockPattern} onClose={() => {}} />);
    
    const copyBtn = screen.getByText('Copy All Code');
    fireEvent.click(copyBtn);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('class Adapter {};');
    expect(screen.getByText('Copied to Clipboard!')).toBeInTheDocument();
  });

  it('toggles zoom when clicking the architectural diagram', () => {
    render(<PatternDetail pattern={mockPattern} onClose={() => {}} />);
    
    const image = screen.getByAltText('Adapter Diagram');
    fireEvent.click(image);
    
    // Check if zoomed modal appeared by looking for the large diagram alt text
    expect(screen.getByAltText('Adapter Large Diagram')).toBeInTheDocument();
    
    // Close zoom
    fireEvent.click(screen.getByAltText('Adapter Large Diagram'));
    expect(screen.queryByAltText('Adapter Large Diagram')).not.toBeInTheDocument();
  });
});
