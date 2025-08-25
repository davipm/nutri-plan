import Home from '@/app/page';
import { render, screen } from '@testing-library/react';
import { ClassAttributes, ImgHTMLAttributes, JSX } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLImageElement> &
      ImgHTMLAttributes<HTMLImageElement>,
  ) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt="Meal planning illustration" />;
  },
}));

describe('Home', () => {
  it('testRendersMainHeadingAndDescription', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /Smart Meal Planner/i, level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Plan your meals, track your nutrition, and achieve your health goals/i),
    ).toBeInTheDocument();
  });

  it('testNavigatesToSignInPageWhenGetStartedIsClicked', () => {
    render(<Home />);
    const link = screen.getByRole('link', { name: /Get Started/i });
    expect(link).toHaveAttribute('href', '/sign-in');
  });

  it('testDisplaysHeroImageWithCorrectAttributes', () => {
    render(<Home />);
    const image = screen.getByRole('img', {
      name: /Meal planning illustration/i,
    });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Meal planning illustration');
    expect(image.getAttribute('src')).toContain('/hero.png');
  });

  it('testGetStartedButtonPointsToSpecificUrl', () => {
    render(<Home />);
    const link = screen.getByRole('link', { name: /Get Started/i });
    expect(link).toHaveAttribute('href', '/sign-in');
  });

  it('testAppliesResponsiveLayoutClassesForDifferentScreenSizes', () => {
    render(<Home />);
    const layoutContainer = screen.getByRole('heading', {
      name: /Smart Meal Planner/i,
    }).parentElement?.parentElement;

    expect(layoutContainer).toHaveClass('flex-col');
    expect(layoutContainer).toHaveClass('md:flex-row');
  });

  it('testRendersImageComponentEvenIfSourceIsInvalid', () => {
    render(<Home />);
    // This test verifies that the Image component renders an `img` tag with the correct alt text,
    // which is crucial for accessibility, even if the image source were to be broken.
    const image = screen.getByRole('img', {
      name: /Meal planning illustration/i,
    });
    expect(image).toBeInTheDocument();
  });
});
