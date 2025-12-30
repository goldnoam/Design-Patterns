
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PatternCard from './PatternCard';
import { PatternCategory } from '../types';

const mockPattern = {
  id: 'factory-id',
  name: 'Factory Method',
  category: PatternCategory.CREATIONAL,
  description: 'Creates objects without specifying exact classes.',
  whenToUse: ['test use'],
  pros: ['pro 1', 'pro 2'],
  cons: ['con 1'],
  codeExample: 'void test() {}',
  visualAidUrl: 'https://example.com/test.jpg'
};

describe('PatternCard Component', () => {
  it('renders pattern basic information correctly', () => {
    const onClick = vi.fn();
    render(<PatternCard pattern={mockPattern} onClick={onClick} />);
    
    expect(screen.getByText('Factory Method')).toBeInTheDocument();
    expect(screen.getByText('Creates objects without specifying exact classes.')).toBeInTheDocument();
    expect(screen.getByText('CREATIONAL')).toBeInTheDocument();
  });

  it('displays the correct number of pros and cons indicators', () => {
    render(<PatternCard pattern={mockPattern} onClick={() => {}} />);
    
    // Pro indicators are green dots, cons are red. We check for the dots in the container.
    const proIndicators = document.querySelectorAll('.bg-emerald-500');
    const conIndicators = document.querySelectorAll('.bg-rose-500');
    
    expect(proIndicators.length).toBe(2);
    expect(conIndicators.length).toBe(1);
  });

  it('triggers onClick handler when card is clicked', () => {
    const onClick = vi.fn();
    render(<PatternCard pattern={mockPattern} onClick={onClick} />);
    
    fireEvent.click(screen.getByText('Factory Method'));
    expect(onClick).toHaveBeenCalledWith(mockPattern);
  });

  it('triggers onBookmarkToggle when bookmark button is clicked', () => {
    const onBookmarkToggle = vi.fn();
    render(<PatternCard 
      pattern={mockPattern} 
      onClick={() => {}} 
      onBookmarkToggle={onBookmarkToggle} 
    />);
    
    const bookmarkBtn = screen.getByRole('button');
    fireEvent.click(bookmarkBtn);
    
    expect(onBookmarkToggle).toHaveBeenCalledWith('factory-id');
  });

  it('shows filled bookmark icon when isBookmarked is true', () => {
    const { container } = render(<PatternCard 
      pattern={mockPattern} 
      onClick={() => {}} 
      isBookmarked={true} 
    />);
    
    const bookmarkSvg = container.querySelector('svg[fill="currentColor"]');
    expect(bookmarkSvg).toBeInTheDocument();
  });
});
